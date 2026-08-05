import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { HomepageSection } from "@/types/content";
import { demoSections } from "@/lib/demo-content";
import {
  persistHomepageSections,
  readStoredHomepageSections,
  subscribeToHomepageSectionsStorage,
} from "@/lib/content-sync";

export function subscribeToHomepageSections(onData: (sections: HomepageSection[]) => void) {
  if (!db) {
    return subscribeToHomepageSectionsStorage(onData, demoSections);
  }

  const unsubscribeStorage = subscribeToHomepageSectionsStorage(onData, demoSections);
  const unsubscribeFirestore = onSnapshot(query(collection(db, "homepageSections"), orderBy("order")), (snapshot) => {
    const firestoreSections = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as HomepageSection);
    const sections = firestoreSections.length ? firestoreSections : readStoredHomepageSections(demoSections);
    persistHomepageSections(sections);
    onData(sections);
  });

  return () => {
    unsubscribeStorage();
    unsubscribeFirestore();
  };
}

export async function updateHomepageSection(id: string, changes: Partial<HomepageSection>) {
  const storedSections = readStoredHomepageSections(demoSections);
  const sectionExists = storedSections.some((section) => section.id === id);
  const baseSection = sectionExists
    ? storedSections.find((section) => section.id === id)!
    : demoSections.find((section) => section.id === id) ?? { id, type: id as HomepageSection["type"], order: storedSections.length, visible: true, published: true, content: {} };

  const updatedSection: HomepageSection = {
    ...baseSection,
    ...changes,
    content: { ...((baseSection.content as Record<string, unknown>) ?? {}), ...((changes.content as Record<string, unknown>) ?? {}) },
  };

  const nextSections = sectionExists
    ? storedSections.map((section) => (section.id === id ? updatedSection : section))
    : [...storedSections, updatedSection];

  persistHomepageSections(nextSections);

  if (!db) return;

  const firestore = db;

  // BUG-07 fixed: Use dot-notation field paths for content sub-keys so that
  // updating content.images from one tab never overwrites content.title set
  // by another. updateDoc with "content.key" paths merges at the sub-field level.
  const firestorePayload: Record<string, unknown> = {};
  if (changes.content) {
    for (const [key, value] of Object.entries(changes.content as Record<string, unknown>)) {
      firestorePayload[`content.${key}`] = value;
    }
  }
  const { content: _omit, ...otherChanges } = changes;
  Object.assign(firestorePayload, otherChanges);

  if (Object.keys(firestorePayload).length > 0) {
    try {
      await updateDoc(doc(firestore, "homepageSections", id), firestorePayload);
    } catch {
      // Document doesn't exist yet (fresh install before seeding) — create it.
      await setDoc(doc(firestore, "homepageSections", id), updatedSection, { merge: true });
    }
  }
}

export async function saveHomepageOrder(items: HomepageSection[]) {
  persistHomepageSections(items);

  if (!db) return;

  const firestore = db;
  const batch = writeBatch(firestore);
  items.forEach((item, order) => batch.update(doc(firestore, "homepageSections", item.id), { order }));
  await batch.commit();
}

export async function seedHomepageSections() {
  persistHomepageSections(demoSections);

  if (!db) return;

  const firestore = db;
  const batch = writeBatch(firestore);
  demoSections.forEach((section) => batch.set(doc(firestore, "homepageSections", section.id), section));
  await batch.commit();
}
