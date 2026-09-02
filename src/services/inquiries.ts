import { push, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export async function createInquiry(kind: "bookings" | "messages", values: Record<string, string>) {
  if (database) {
    const target = push(ref(database, kind));
    await set(target, { ...values, status: "new", createdAt: Date.now() });
  }
}
