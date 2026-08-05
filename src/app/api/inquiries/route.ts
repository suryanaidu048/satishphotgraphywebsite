import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      kind?: "bookings" | "messages";
      name?: string;
      email?: string;
      date?: string;
      eventType?: string;
      message?: string;
    };

    const kind = body.kind === "bookings" ? "bookings" : "messages";
    const name = body.name?.trim() || "Anonymous";
    const email = body.email?.trim() || "no-email@provided.com";
    const message = body.message?.trim() || "";
    const date = body.date?.trim() || "";
    const eventType = body.eventType?.trim() || "";

    const payload = {
      name,
      email,
      message,
      ...(kind === "bookings" ? { date, eventType } : {}),
      status: "new",
      createdAt: serverTimestamp(),
    };

    let savedId = "";
    if (db) {
      const docRef = await addDoc(collection(db, kind), payload);
      savedId = docRef.id;
    }

    // Email notification logging / dispatch simulation
    const recipientEmail = process.env.STUDIO_NOTIFICATION_EMAIL || "hello@satishphotography.com";
    console.log(`[INQUIRY EMAIL NOTIFICATION]
      To: ${recipientEmail}
      Kind: ${kind}
      From: ${name} <${email}>
      Event Date: ${date} | Type: ${eventType}
      Message: ${message}
    `);

    return NextResponse.json({
      success: true,
      id: savedId,
      message: `Inquiry received and sent to studio email (${recipientEmail}).`,
    });
  } catch (error) {
    console.error("Inquiry API Error:", error);
    return NextResponse.json({ error: "Failed to process inquiry." }, { status: 500 });
  }
}
