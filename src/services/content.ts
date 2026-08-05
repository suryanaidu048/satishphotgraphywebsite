import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { persistPublicEntries, readStoredPublicEntries, subscribeToPublicEntriesStorage } from "@/lib/content-sync";

export type PublicEntry = {
  id: string;
  title?: string;
  body?: string;
  price?: string;
  features?: string[];
  author?: string;
  role?: string;
  visible?: boolean;
  order?: number;
  src?: string;
  alt?: string;
  category?: string;
  hidden?: boolean;
};

export function subscribeToPublicEntries(
  collectionName: "pricingPlans" | "testimonials" | "gallery",
  callback: (entries: PublicEntry[]) => void,
  onlyVisible = true,
) {
  if (!db) {
    return subscribeToPublicEntriesStorage(collectionName, callback);
  }

  // BUG-06 fixed: Track whether Firestore has replied at least once.
  // localStorage data is emitted only as an initial render while Firestore loads.
  // Once Firestore responds (even with empty results), it takes full authority.
  let hasFirestoreResult = false;

  const unsubscribeStorage = subscribeToPublicEntriesStorage(collectionName, (entries) => {
    if (!hasFirestoreResult) {
      callback(entries);
    }
  });

  const firestoreQuery =
    onlyVisible && collectionName !== "gallery"
      ? query(collection(db, collectionName), where("visible", "==", true))
      : query(collection(db, collectionName));

  const unsubscribeFirestore = onSnapshot(
    firestoreQuery,
    (snapshot) => {
      hasFirestoreResult = true;
      let firestoreItems = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as PublicEntry)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      if (onlyVisible) {
        if (collectionName === "gallery") {
          firestoreItems = firestoreItems.filter((item) => item.hidden !== true);
        } else {
          firestoreItems = firestoreItems.filter((item) => item.visible !== false);
        }
      }

      // Always use Firestore as the source of truth once it has responded and sync with local storage
      persistPublicEntries(collectionName, firestoreItems);
      callback(firestoreItems);
    },
    (error) => {
      console.warn(`Firestore subscription error for ${collectionName}:`, error);
      // Firestore failed — fall back to last known localStorage data.
      const stored = readStoredPublicEntries(collectionName, []);
      callback(stored);
    },
  );

  return () => {
    unsubscribeStorage();
    unsubscribeFirestore();
  };
}
