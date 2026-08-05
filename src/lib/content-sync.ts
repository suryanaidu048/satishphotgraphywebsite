// Legacy compatibility helpers. The production application never persists data
// in the browser; Realtime Database is the sole source of truth.
import type { HomepageSection } from "@/types/content";
import type { PublicEntry } from "@/services/content";

export function readStoredHomepageSections(defaultSections: HomepageSection[] = []) { return defaultSections; }
export function persistHomepageSections(_sections: HomepageSection[]) {}
export function subscribeToHomepageSectionsStorage(onData: (sections: HomepageSection[]) => void, fallback: HomepageSection[] = []) { onData(fallback); return () => undefined; }
export function readStoredPublicEntries(_collection: "pricingPlans" | "testimonials" | "gallery", defaultEntries: PublicEntry[] = []) { return defaultEntries; }
export function persistPublicEntries(_collection: "pricingPlans" | "testimonials" | "gallery", _entries: PublicEntry[]) {}
export function subscribeToPublicEntriesStorage(_collection: "pricingPlans" | "testimonials" | "gallery", onData: (entries: PublicEntry[]) => void, fallback: PublicEntry[] = []) { onData(fallback); return () => undefined; }
