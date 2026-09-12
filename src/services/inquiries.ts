import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  // 1. Save directly to Firebase Realtime Database
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }

  // 2. Dispatch notification to Google Apps Script Web App (satish.ch.photography@gmail.com)
  const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
  if (appsScriptUrl) {
    try {
      await fetch(appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          recipient: "satish.ch.photography@gmail.com",
          timestamp: new Date().toISOString(),
          ...values,
        }),
      });
    } catch {
      // Non-blocking: background notification failure should not block user feedback
    }
  }
}

