"use client";

import { ChangeEvent, useState } from "react";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; label?: string; className?: string; onUploaded?: (asset: Asset) => void };

export function CloudinaryUpload({ label = "Upload Image", className, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && onUploaded) {
        onUploaded({
          url: result,
          publicId: file.name,
          width: 1200,
          height: 800,
        });
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
    };
    reader.readAsDataURL(file);
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
