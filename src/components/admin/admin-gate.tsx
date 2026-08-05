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
    const isLocalSession = typeof window !== "undefined" && localStorage.getItem("satish_admin_session") === "true";

    if (isLocalSession) {
      setUser({ email: "admin@satishphotography.com", uid: "studio-admin" });
      return;
    }

    if (!firebaseAuth) {
      setUser(isLocalSession ? { email: "admin@satishphotography.com", uid: "studio-admin" } : null);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (current) => {
      if (current) {
        setUser(current);
      } else if (localStorage.getItem("satish_admin_session") === "true") {
        setUser({ email: "admin@satishphotography.com", uid: "studio-admin" });
      } else {
        setUser(null);
      }
    });
  }, []);
  useEffect(() => { if (user === null) router.replace(`/admin/login?next=${encodeURIComponent(path)}`); }, [path, router, user]);
  if (!user) return <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]"><span className="label text-[#c7a66b]">Checking secure session…</span></main>;
  return <>{children(user)}</>;
}
