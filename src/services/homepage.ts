import { ref, set, update } from "firebase/database";
import { database } from "@/lib/firebase";
import type { HomepageSection } from "@/types/content";
import { demoSections } from "@/lib/demo-content";
import { subscribeToCollection } from "@/services/realtime";

export function subscribeToHomepageSections(onData: (sections: HomepageSection[]) => void) {
  if (!database) { onData([]); return () => undefined; }
  return subscribeToCollection("homepageSections", (items) => onData((items as unknown as HomepageSection[]).sort((a, b) => a.order - b.order)), () => onData([]));
}

export async function updateHomepageSection(id: string, changes: Partial<HomepageSection>) {
  if (!database) throw new Error("Realtime Database is not configured.");
  await update(ref(database, `homepageSections/${id}`), { ...changes, updatedAt: Date.now() });
}

export async function saveHomepageOrder(items: HomepageSection[]) {
  if (!database) throw new Error("Realtime Database is not configured.");
  const changes: Record<string, unknown> = {};
  items.forEach((item, order) => { changes[`homepageSections/${item.id}/order`] = order; });
  await update(ref(database), changes);
}

export async function seedHomepageSections() {
  if (!database) throw new Error("Realtime Database is not configured.");
  const values: Record<string, HomepageSection> = {};
  demoSections.forEach((section) => { values[section.id] = section; });
  await set(ref(database, "homepageSections"), values);
}
