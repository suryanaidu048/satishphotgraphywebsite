import { database } from "@/lib/firebase";
import { subscribeToCollection } from "@/services/realtime";

export type PublicEntry = { id: string; title?: string; body?: string; price?: string; features?: string[]; author?: string; role?: string; visible?: boolean; order?: number; src?: string; alt?: string; category?: string; hidden?: boolean; [key: string]: unknown };

export function subscribeToPublicEntries(collectionName: "pricingPlans" | "testimonials" | "gallery", callback: (entries: PublicEntry[]) => void, onlyVisible = true) {
  if (!database) { callback([]); return () => undefined; }
  return subscribeToCollection(collectionName, (items) => {
    let entries = (items as PublicEntry[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (onlyVisible) entries = entries.filter((item) => collectionName === "gallery" ? item.hidden !== true : item.visible !== false);
    callback(entries);
  }, () => callback([]));
}
