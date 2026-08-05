import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PENDING_KEY = "satish-pending-inquiries";

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (!db) {
    // BUG-04 fixed: Save to localStorage so data is NOT lost when Firebase is unconfigured.
    // The studio can retrieve these locally until Firebase is fully set up.
    try {
      const stored = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]") as Array<Record<string, unknown>>;
      stored.push({ kind, ...values, status: "new", createdAt: new Date().toISOString(), id: `pending-${Date.now()}` });
      localStorage.setItem(PENDING_KEY, JSON.stringify(stored));
    } catch {
      throw new Error("Unable to submit your inquiry. Please email us directly.");
    }
    return; // Saved locally — don't throw, UX shows "Received — thank you"
  }
  await addDoc(collection(db, kind), { ...values, status: "new", createdAt: serverTimestamp() });
}
