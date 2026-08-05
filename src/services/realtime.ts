import { onValue, push, ref, remove, set, update } from "firebase/database";
import { database } from "@/lib/firebase";

export type RealtimeItem = { id: string; [key: string]: unknown };

export function subscribeToCollection(path: string, callback: (items: RealtimeItem[]) => void, onError?: (error: Error) => void) {
  if (!database) return () => undefined;
  return onValue(ref(database, path), (snapshot) => {
    const value = (snapshot.val() ?? {}) as Record<string, Record<string, unknown>>;
    callback(Object.entries(value).map(([id, data]) => ({ id, ...data })));
  }, onError);
}

export async function createRealtimeItem(path: string, value: Record<string, unknown>) {
  if (!database) throw new Error("Realtime Database is not configured.");
  const target = push(ref(database, path));
  await set(target, { ...value, createdAt: Date.now(), updatedAt: Date.now() });
  return target.key!;
}

export async function updateRealtimeItem(path: string, id: string, value: Record<string, unknown>) {
  if (!database) throw new Error("Realtime Database is not configured.");
  await update(ref(database, `${path}/${id}`), { ...value, updatedAt: Date.now() });
}

export async function removeRealtimeItem(path: string, id: string) {
  if (!database) throw new Error("Realtime Database is not configured.");
  await remove(ref(database, `${path}/${id}`));
}
