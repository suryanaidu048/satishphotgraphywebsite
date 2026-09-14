"use client";

import { ChangeEvent, useState } from "react";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; label?: string; className?: string; hideUrlButton?: boolean; onUploaded?: (asset: Asset) => void };

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

export function CloudinaryUpload({ folder, label = "Upload Image", className, hideUrlButton = false, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusText("Optimizing...");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ukohceos";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "satish_gallery_unsigned";

    if (!cloudName || !uploadPreset) {
      setLoading(false);
      setStatusText("");
      alert("Cloudinary is not configured. Paste an image URL instead, or add the Cloudinary cloud name and unsigned upload preset.");
      return;
    }

    try {
      const fileToUpload = await optimizeImageForUpload(file);

      if (fileToUpload.size > 10 * 1024 * 1024) {
        throw new Error(
          `File size (${(fileToUpload.size / (1024 * 1024)).toFixed(1)}MB) exceeds Cloudinary's 10MB limit. Please choose a smaller image.`
        );
      }

      setStatusText("Uploading...");
      const form = new FormData();
      form.append("file", fileToUpload);
      form.append("upload_preset", uploadPreset);
      if (folder) {
        form.append("folder", folder);
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
          // ignore json parse error
        }
        throw new Error(errorMsg);
      }

      const asset = (await response.json()) as {
        secure_url: string;
        public_id: string;
        width: number;
        height: number;
      };

      onUploaded?.({
        url: asset.secure_url,
        publicId: asset.public_id,
        width: asset.width,
        height: asset.height,
      });
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      alert(`Upload failed: ${err.message || "An unexpected error occurred while uploading. Check your network connection."}`);
    } finally {
      setLoading(false);
      setStatusText("");
      if (event.target) {
        event.target.value = "";
      }
    }
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    if (onUploaded) {
      onUploaded({
        url: urlInput.trim(),
        publicId: "custom-url",
        width: 1200,
        height: 800,
      });
    }
    setUrlInput("");
    setShowUrlInput(false);
  }

  return (
    <div className={className || "w-full"}>
      {!showUrlInput ? (
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-[#c7a66b]/40 bg-[#c7a66b]/10 px-3 py-2 text-xs font-semibold text-[#c7a66b] transition hover:bg-[#c7a66b]/20">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>{loading ? (statusText || "Processing...") : label}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {!hideUrlButton && (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition py-2 px-1"
              title="Paste Image URL"
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
            placeholder="Paste image URL..."
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
      )}
    </div>
  );
}
