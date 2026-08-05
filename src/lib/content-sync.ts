import type { HomepageSection } from "@/types/content";
import type { PublicEntry } from "@/services/content";

export const HOMEPAGE_SECTIONS_STORAGE_KEY = "satish-homepage-sections";
export const CONTENT_SYNC_EVENT = "satish-content-sync";

export const PUBLIC_ENTRY_STORAGE_KEYS = {
  pricingPlans: "satish-pricing-plans",
  testimonials: "satish-testimonials",
  gallery: "satish-gallery",
} as const;

type PublicEntryCollectionName = "pricingPlans" | "testimonials" | "gallery";

function isBrowser() {
  return typeof window !== "undefined";
}

function sortHomepageSections(sections: HomepageSection[]) {
  return sections.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function sortPublicEntries(entries: PublicEntry[]) {
  return entries.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function emitContentUpdate() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CONTENT_SYNC_EVENT));
}

export function readStoredHomepageSections(defaultSections: HomepageSection[] = []): HomepageSection[] {
  if (!isBrowser()) return defaultSections;
  try {
    const raw = window.localStorage.getItem(HOMEPAGE_SECTIONS_STORAGE_KEY);
    if (!raw) return defaultSections;
    const parsed = JSON.parse(raw) as HomepageSection[];
    return Array.isArray(parsed) ? sortHomepageSections(parsed) : defaultSections;
  } catch {
    return defaultSections;
  }
}

export function persistHomepageSections(sections: HomepageSection[]) {
  if (!isBrowser()) return;
  const normalized = sortHomepageSections(sections);
  window.localStorage.setItem(HOMEPAGE_SECTIONS_STORAGE_KEY, JSON.stringify(normalized));
  emitContentUpdate();
}

export function subscribeToHomepageSectionsStorage(
  onData: (sections: HomepageSection[]) => void,
  fallbackSections: HomepageSection[] = [],
) {
  if (!isBrowser()) return () => undefined;

  const emit = (sections: HomepageSection[]) => {
    const next = sections.length ? sortHomepageSections(sections) : fallbackSections;
    onData(next);
  };

  const handleUpdate = () => {
    const stored = readStoredHomepageSections(fallbackSections);
    emit(stored);
  };

  handleUpdate();

  const onStorage = (event: StorageEvent) => {
    if (event.key === HOMEPAGE_SECTIONS_STORAGE_KEY) {
      handleUpdate();
    }
  };

  const onCustomEvent = () => handleUpdate();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONTENT_SYNC_EVENT, onCustomEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONTENT_SYNC_EVENT, onCustomEvent);
  };
}

export function readStoredPublicEntries(
  collectionName: PublicEntryCollectionName,
  defaultEntries: PublicEntry[] = [],
): PublicEntry[] {
  if (!isBrowser()) return defaultEntries;
  try {
    const raw = window.localStorage.getItem(PUBLIC_ENTRY_STORAGE_KEYS[collectionName]);
    if (!raw) return defaultEntries;
    const parsed = JSON.parse(raw) as PublicEntry[];
    return Array.isArray(parsed) ? sortPublicEntries(parsed) : defaultEntries;
  } catch {
    return defaultEntries;
  }
}

export function persistPublicEntries(collectionName: PublicEntryCollectionName, entries: PublicEntry[]) {
  if (!isBrowser()) return;
  const normalized = sortPublicEntries(entries);
  window.localStorage.setItem(PUBLIC_ENTRY_STORAGE_KEYS[collectionName], JSON.stringify(normalized));
  emitContentUpdate();
}

export function subscribeToPublicEntriesStorage(
  collectionName: PublicEntryCollectionName,
  onData: (entries: PublicEntry[]) => void,
  fallbackEntries: PublicEntry[] = [],
) {
  if (!isBrowser()) return () => undefined;

  const emit = (entries: PublicEntry[]) => {
    const next = entries.length ? sortPublicEntries(entries) : fallbackEntries;
    onData(next);
  };

  const handleUpdate = () => {
    const stored = readStoredPublicEntries(collectionName, fallbackEntries);
    emit(stored);
  };

  handleUpdate();

  const onStorage = (event: StorageEvent) => {
    if (event.key === PUBLIC_ENTRY_STORAGE_KEYS[collectionName]) {
      handleUpdate();
    }
  };

  const onCustomEvent = () => handleUpdate();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONTENT_SYNC_EVENT, onCustomEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONTENT_SYNC_EVENT, onCustomEvent);
  };
}
