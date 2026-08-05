import "server-only";
import { createHash } from "crypto";

export const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

export function createUploadSignature(folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  return { timestamp, folder, signature, apiKey, cloudName };
}

export async function listCloudinaryGalleryImages() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return [];
  }

  try {
    const authHeader = "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=500`, {
      headers: {
        Authorization: authHeader,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.warn("Cloudinary list resources failed:", response.status, await response.text());
      return [];
    }

    const data = (await response.json()) as {
      resources?: Array<{ public_id: string; secure_url: string; width: number; height: number; created_at: string }>;
    };

    return (data.resources ?? []).map((res) => ({
      id: res.public_id,
      src: res.secure_url,
      publicId: res.public_id,
      width: res.width,
      height: res.height,
      title: "Gallery photo",
    }));
  } catch (error) {
    console.warn("Error listing Cloudinary gallery images:", error);
    return [];
  }
}
