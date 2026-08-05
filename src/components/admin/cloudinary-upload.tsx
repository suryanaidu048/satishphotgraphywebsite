"use client";

import { ChangeEvent, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; onUploaded?: (asset: Asset) => void };
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function CloudinaryUpload({ folder = "gallery", onUploaded }: Props) {
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (!cloudName || !uploadPreset) { setErrorMsg("Cloudinary upload preset is not configured."); setState("error"); return; }
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_BYTES) { setErrorMsg("Upload a JPG, PNG, WebP, or AVIF image up to 10 MB."); setState("error"); return; }
    setState("uploading"); setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file); formData.append("upload_preset", uploadPreset); formData.append("folder", folder);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Cloudinary rejected the upload.");
      const asset = await response.json();
      onUploaded?.({ url: asset.secure_url, publicId: asset.public_id, width: asset.width, height: asset.height });
      setState("idle");
    } catch (error) { console.error("Cloudinary upload failed", error); setErrorMsg("Upload failed. Check the Cloudinary preset settings."); setState("error"); }
  }
  return <label><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={state === "uploading"} /><Button asChild variant="outline" size="sm"><span><Upload size={14} />{state === "uploading" ? "Uploading…" : "Upload image"}</span></Button>{state === "error" && <span className="ml-3 text-xs text-[#e7a29b]">{errorMsg}</span>}</label>;
}
