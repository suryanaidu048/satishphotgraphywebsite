"use client";

import { ChangeEvent, useState } from "react";
import { Upload, Link as LinkIcon, Loader2, Video, Image as ImageIcon } from "lucide-react";

export type Asset = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  resourceType?: "image" | "video";
};

export type CloudinaryUploadProps = {
  folder?: string;
  label?: string;
  className?: string;
  hideUrlButton?: boolean;
  multiple?: boolean;
  allowVideo?: boolean;
  onUploaded?: (asset: Asset) => void;
  onBatchUploaded?: (assets: Asset[]) => void;
};

async function optimizeImageForUpload(file: File): Promise<File | Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX_DIM = 2560;
      let { width, height } = img;

      if (width <= MAX_DIM && height <= MAX_DIM && file.size < 2 * 1024 * 1024) {
        resolve(file);
        return;
      }

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.88
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function CloudinaryUpload({
  folder,
  label = "Upload Image",
  className,
  hideUrlButton = false,
  multiple = false,
  allowVideo = false,
  onUploaded,
  onBatchUploaded,
}: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ukohceos";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "satish_gallery_unsigned";

  async function uploadFiles(files: File[]) {
    const isVideoMode = mediaType === "video";
    const validFiles = files.filter((f) => {
      if (isVideoMode) {
        return f.type.startsWith("video/") || f.name.match(/\.(mp4|webm|mov|mkv|m4v)$/i);
      }
      return f.type.startsWith("image/") || f.name.match(/\.(jpe?g|png|webp|avif|gif)$/i);
    });

    if (validFiles.length === 0) {
      alert(isVideoMode ? "Please select valid video files (MP4, WebM, MOV)." : "Please select valid image files.");
      return;
    }

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary is not configured. Paste a media URL instead, or check the cloud credentials.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const total = validFiles.length;
    const uploadedAssets: Asset[] = [];
    const errors: string[] = [];
    let completedCount = 0;

    async function processAndUpload(file: File, index: number) {
      try {
        let fileToUpload: File | Blob = file;

        if (isVideoMode) {
          // Video size check (e.g. 60MB max for fast reliable unsigned upload)
          if (file.size > 60 * 1024 * 1024) {
            throw new Error(`${file.name}: Exceeds 60MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
          }
          setStatusText(total > 1 ? `Uploading video ${index + 1}/${total}...` : "Uploading video...");
        } else {
          setStatusText(total > 1 ? `Optimizing ${index + 1}/${total}...` : "Optimizing...");
          fileToUpload = await optimizeImageForUpload(file);

          if (fileToUpload.size > 10 * 1024 * 1024) {
            throw new Error(`${file.name}: Exceeds 10MB limit (${(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB)`);
          }
          setStatusText(total > 1 ? `Uploading ${index + 1}/${total}...` : "Uploading...");
        }

        const form = new FormData();
        form.append("file", fileToUpload);
        form.append("upload_preset", uploadPreset);
        if (folder) {
          form.append("folder", folder);
        }

        const endpoint = isVideoMode
          ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const response = await fetch(endpoint, {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          let errorMsg = `Upload failed (Status ${response.status})`;
          try {
            const errJson = await response.json();
            if (errJson?.error?.message) {
              errorMsg = errJson.error.message;
            }
          } catch {
            // ignore
          }
          throw new Error(`${file.name}: ${errorMsg}`);
        }

        const asset = (await response.json()) as {
          secure_url: string;
          public_id: string;
          width?: number;
          height?: number;
          resource_type?: string;
        };

        const result: Asset = {
          url: asset.secure_url,
          publicId: asset.public_id,
          width: asset.width || (isVideoMode ? 1920 : 1200),
          height: asset.height || (isVideoMode ? 1080 : 800),
          resourceType: (asset.resource_type === "video" || isVideoMode) ? "video" : "image",
        };

        uploadedAssets.push(result);

        if (!onBatchUploaded) {
          onUploaded?.(result);
        }
      } catch (err: any) {
        console.error("Upload error for file:", file.name, err);
        errors.push(err.message || file.name);
      } finally {
        completedCount++;
        setProgress(Math.round((completedCount / total) * 100));
      }
    }

    try {
      const CONCURRENCY = isVideoMode ? 1 : 3;
      for (let i = 0; i < validFiles.length; i += CONCURRENCY) {
        const batch = validFiles.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map((f, bIdx) => processAndUpload(f, i + bIdx)));
      }

      if (onBatchUploaded && uploadedAssets.length > 0) {
        onBatchUploaded(uploadedAssets);
      }

      if (errors.length > 0) {
        alert(
          `Uploaded ${uploadedAssets.length} of ${total} files.\n${errors.length} failed:\n${errors.slice(0, 3).join("\n")}`
        );
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message || "An unexpected error occurred."}`);
    } finally {
      setLoading(false);
      setStatusText("");
      setProgress(0);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      uploadFiles(Array.from(event.target.files));
      event.target.value = "";
    }
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    const isVideo = Boolean(urlInput.match(/\.(mp4|webm|mov)($|\?)/i) || mediaType === "video");
    const asset: Asset = {
      url: urlInput.trim(),
      publicId: "custom-url",
      width: isVideo ? 1920 : 1200,
      height: isVideo ? 1080 : 800,
      resourceType: isVideo ? "video" : "image",
    };
    if (onBatchUploaded) {
      onBatchUploaded([asset]);
    } else if (onUploaded) {
      onUploaded(asset);
    }
    setUrlInput("");
    setShowUrlInput(false);
  }

  const isVideo = mediaType === "video";
  const fileAccept = isVideo ? "video/mp4,video/webm,video/quicktime,video/*" : "image/*";

  return (
    <div className={className || "w-full"}>
      {/* Media Type Switcher when allowVideo is true */}
      {allowVideo && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMediaType("image")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              !isVideo
                ? "bg-[#c7a66b] text-[#10100f] shadow"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ImageIcon size={13} />
            <span>Photos</span>
          </button>
          <button
            type="button"
            onClick={() => setMediaType("video")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              isVideo
                ? "bg-[#c7a66b] text-[#10100f] shadow"
                : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Video size={13} />
            <span>Cinematic Videos</span>
          </button>
        </div>
      )}

      {multiple ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              uploadFiles(Array.from(e.dataTransfer.files));
            }
          }}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed p-6 transition text-center rounded-sm ${
            isDragging
              ? "border-[#c7a66b] bg-[#c7a66b]/10"
              : "border-white/20 bg-[#121210] hover:border-[#c7a66b]/60 hover:bg-white/[0.02]"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs py-3">
              <Loader2 size={32} className="animate-spin text-[#c7a66b]" />
              <p className="text-sm font-medium text-white">{statusText || "Processing files..."}</p>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#c7a66b] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#c7a66b] font-semibold">{progress}% complete</span>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#c7a66b]/10 text-[#c7a66b]">
                {isVideo ? <Video size={24} /> : <Upload size={24} />}
              </div>
              <p className="text-sm font-medium text-white">
                Drag & drop {isVideo ? "videos" : "photos"} here, or{" "}
                <label className="cursor-pointer font-semibold text-[#c7a66b] underline hover:text-[#e0c68e]">
                  browse from device
                  <input
                    type="file"
                    accept={fileAccept}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-white/50">
                {isVideo
                  ? "Upload MP4, WebM, or MOV cinematic videos up to 60MB"
                  : "Bulk upload multiple photos at once (JPEG, PNG, WebP) · Auto-compressed for web"}
              </p>

              {!hideUrlButton && !showUrlInput && (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
                >
                  <LinkIcon size={13} />
                  <span>Or paste a direct {isVideo ? "video" : "image"} URL</span>
                </button>
              )}
            </>
          )}

          {showUrlInput && !loading && (
            <div className="mt-4 flex w-full max-w-md items-center gap-2">
              <input
                type="url"
                placeholder={isVideo ? "Paste video URL (e.g. MP4 link)..." : "Paste image URL..."}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent px-3 py-2 text-xs text-white outline-none focus:border-[#c7a66b]"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="rounded bg-[#c7a66b] px-3.5 py-2 text-xs font-semibold text-[#10100f] hover:bg-[#b8955a]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        // Standard compact single-media button
        !showUrlInput ? (
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-[#c7a66b]/40 bg-[#c7a66b]/10 px-3 py-2 text-xs font-semibold text-[#c7a66b] transition hover:bg-[#c7a66b]/20">
              {loading ? <Loader2 size={14} className="animate-spin" /> : (isVideo ? <Video size={14} /> : <Upload size={14} />)}
              <span>{loading ? (statusText || "Processing...") : label}</span>
              <input
                type="file"
                accept={fileAccept}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {!hideUrlButton && (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition py-2 px-1"
                title={`Paste ${isVideo ? "Video" : "Image"} URL`}
              >
                <LinkIcon size={12} />
                <span>URL</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder={isVideo ? "Paste video URL..." : "Paste image URL..."}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full rounded border border-white/20 bg-transparent px-3 py-1.5 text-xs text-white outline-none focus:border-[#c7a66b]"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="rounded bg-[#c7a66b] px-3 py-1.5 text-xs font-semibold text-[#10100f] hover:bg-[#b8955a]"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-xs text-white/50 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )
      )}
    </div>
  );
}
