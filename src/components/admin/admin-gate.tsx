"use client";

import { getIdTokenResult, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export function AdminGate({ children }: { children: (user: User | { email: string; uid: string }) => React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<User | { email: string; uid: string } | null | undefined>(undefined);

  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) {
      setUser(null);
      return;
    }

    return onAuthStateChanged(firebaseAuth, async (current) => {
      if (!current) {
        setUser(null);
        return;
      }

      try {
        const token = await getIdTokenResult(current, true);
        if (token.claims.admin === true) {
          setUser(current);
          return;
        }
      } catch {
        // A failed token check is treated as an unauthenticated session.
      }

      await signOut(firebaseAuth).catch(() => null);
      setUser(null);
    });
  }, []);
  useEffect(() => { if (user === null) router.replace(`/admin/login?next=${encodeURIComponent(path)}`); }, [path, router, user]);
  if (!user) return <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]"><span className="label text-[#c7a66b]">Checking secure session…</span></main>;
  return <>{children(user)}</>;
}
