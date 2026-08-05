"use client";

import { ChangeEvent, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

type Props = { folder?: string; onUploaded?: (asset: { url: string; publicId: string; width: number; height: number }) => void };

export function CloudinaryUpload({ folder = "gallery", onUploaded }: Props) {
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Cloudinary free tier limit is 10MB
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      setState("error");
      event.target.value = "";
      return;
    }

    setErrorMsg("");
    setState("uploading");

    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.authorization = `Bearer ${token}`;
      }

      const signed = await fetch("/api/media/signature", {
        method: "POST",
        headers,
        body: JSON.stringify({ folder }),
      });

      if (!signed.ok) {
        console.error("Cloudinary signature request failed", await signed.text());
        setState("error");
        return;
      }

      const { timestamp, signature, apiKey, cloudName } = await signed.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("api_key", apiKey);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      if (response.ok) {
        const asset = await response.json();
        onUploaded?.({ url: asset.secure_url, publicId: asset.public_id, width: asset.width, height: asset.height });
        setState("idle");
        event.target.value = "";
        return;
      }

      const errorBody = await response.text();
      console.error("Cloudinary upload failed", response.status, errorBody);
      setState("error");
    } catch {
      setState("error");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <label>
      <input className="sr-only" type="file" accept="image/*" onChange={upload} disabled={state === "uploading"} />
      <Button asChild variant="outline" size="sm">
        <span>
          <Upload size={14} />
          {state === "uploading" ? "Uploading…" : "Upload image"}
        </span>
      </Button>
      {state === "error" && <span className="ml-3 text-xs text-[#e7a29b]">{errorMsg || "Upload unavailable. Please try again."}</span>}
    </label>
  );
}
