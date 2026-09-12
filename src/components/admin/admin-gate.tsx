"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

/**
 * AdminGate — renders children only for a Firebase-authenticated user.
 *
 * Auth state is read exclusively from Firebase Auth (onAuthStateChanged).
 * No localStorage or cookie fallbacks are used; they were a security bypass
 * that allowed any visitor to enter the admin by manually setting a flag.
 */
export function AdminGate({ children }: { children: (user: User) => React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  // undefined = still resolving | null = unauthenticated | User = authenticated
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!auth) {
      // Firebase is not configured — treat as unauthenticated immediately
      setUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null) {
      // Not signed in — redirect to login
      router.replace(`/admin/login?next=${encodeURIComponent(path)}`);
    }
  }, [path, router, user]);

  // Still resolving Firebase auth state
  if (user === undefined) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]">
        <span className="label text-[#c7a66b]">Checking secure session…</span>
      </main>
    );
  }

  // Not authenticated — the redirect effect above handles navigation
  if (user === null) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]">
        <span className="label text-[#c7a66b]">Redirecting to sign in…</span>
      </main>
    );
  }

  // Firebase confirmed this user is authenticated
  return <>{children(user)}</>;
}
