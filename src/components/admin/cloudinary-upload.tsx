"use client";

import { ChangeEvent, useState } from "react";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; label?: string; className?: string; onUploaded?: (asset: Asset) => void };

export function CloudinaryUpload({ label = "Upload Image", className, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) { setLoading(false); alert("Cloudinary is not configured. Paste an image URL instead, or add the Cloudinary cloud name and unsigned upload preset."); return; }
    try {
      const form = new FormData();
      form.append("file", file); form.append("upload_preset", uploadPreset);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
      if (!response.ok) throw new Error("Upload failed");
      const asset = await response.json() as { secure_url: string; public_id: string; width: number; height: number };
      onUploaded?.({ url: asset.secure_url, publicId: asset.public_id, width: asset.width, height: asset.height });
    } catch { alert("Cloudinary upload failed. Check the cloud name, unsigned preset, and preset folder permissions."); }
    finally { setLoading(false); }
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
            <span>{loading ? "Processing..." : label}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition py-2 px-1"
            title="Paste Image URL"
          >
            <LinkIcon size={12} />
            <span>URL</span>
          </button>
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
