import { NextResponse } from "next/server";
import { listCloudinaryGalleryImages } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = await listCloudinaryGalleryImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery Media API Error:", error);
    return NextResponse.json({ images: [] });
  }
}
