"use client";

import { ShieldAlert } from "lucide-react";

type Asset = { url: string; publicId: string; width: number; height: number };
type Props = { folder?: string; label?: string; className?: string; onUploaded?: (asset: Asset) => void };

/**
 * Direct unsigned browser uploads expose a reusable Cloudinary capability to
 * every site visitor. Keep this fail-closed until a server-side signed upload
 * endpoint verifies the Firebase administrator token.
 */
export function CloudinaryUpload({ className }: Props) {
  return (
    <div className={className || "w-full"}>
      <p className="flex items-center gap-2 border border-[#e7a29b]/40 px-3 py-2 text-xs leading-5 text-[#e7a29b]">
        <ShieldAlert size={15} className="shrink-0" />
        Uploads are disabled until a protected, signed upload service is configured.
      </p>
    </div>
  );
}
