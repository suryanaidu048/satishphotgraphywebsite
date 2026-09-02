"use client";

import { ChangeEvent, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; label?: string; className?: string; onUploaded?: (asset: Asset) => void };
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function CloudinaryUpload({ folder = "gallery", label, className, onUploaded }: Props) {
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setErrorMsg("Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
      setState("error");
      return;
    }

    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_BYTES) {
      setErrorMsg("Upload a JPG, PNG, WebP, or AVIF image up to 10 MB.");
      setState("error");
      return;
    }

    setState("uploading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson?.error?.message || "Upload was rejected by Cloudinary.");
      }

      const asset = await response.json();
      onUploaded?.({
        url: asset.secure_url,
        publicId: asset.public_id,
        width: asset.width || 1200,
        height: asset.height || 900,
      });
      setState("idle");
    } catch (err) {
      const details = err instanceof Error ? err.message : "Network error";
      console.warn("Cloudinary direct upload rejected:", details);
      setErrorMsg(`Cloudinary upload failed: ${details}`);
      setState("error");
    }
  }

  return (
    <label className="block w-full min-w-0">
      <input
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={upload}
        disabled={state === "uploading"}
      />
      <Button asChild variant="outline" size="sm" className={className || "w-full whitespace-normal leading-snug py-2 px-2.5 h-auto text-center text-[10px]"}>
        <span className="flex items-center justify-center gap-1.5 min-w-0">
          <Upload size={13} className="shrink-0" />
          <span className="break-words">{state === "uploading" ? "Uploading…" : (label || "Upload image")}</span>
        </span>
      </Button>
      {state === "error" && <p className="mt-2 text-xs text-[#e7a29b] break-words">{errorMsg}</p>}
    </label>
  );
}
