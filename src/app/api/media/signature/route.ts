import { NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/cloudinary";
import { isAdminRequest } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const isAllowed = authorization
      ? await isAdminRequest(request)
      : process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

    if (!isAllowed) {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 401 });
    }

    let body: { folder?: string } = {};
    try {
      body = await request.json() as { folder?: string };
    } catch {
      body = {};
    }

    const folder = body.folder?.replace(/[^a-zA-Z0-9_/-]/g, "") || "gallery";
    const signature = createUploadSignature(folder);
    return NextResponse.json(signature);
  } catch (error) {
    console.error("Cloudinary signing error", error);
    return NextResponse.json({ error: "Media signing is unavailable. Check the server logs for the Cloudinary configuration." }, { status: 503 });
  }
}
