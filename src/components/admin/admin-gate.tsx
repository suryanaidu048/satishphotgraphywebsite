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
    // Check local storage PIN session first
    if (typeof window !== "undefined") {
      const pinSession = localStorage.getItem("satish_admin_auth");
      if (pinSession === "true") {
        setUser({ email: "admin@satishphotography.in", uid: "admin-local" });
        return;
      }
    }

    const firebaseAuth = auth;
    if (!firebaseAuth) {
      setUser(null);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (current) => {
      if (current) {
        setUser(current);
      } else {
        const pinSession = typeof window !== "undefined" ? localStorage.getItem("satish_admin_auth") : null;
        if (pinSession === "true") {
          setUser({ email: "admin@satishphotography.in", uid: "admin-local" });
        } else {
          setUser(null);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (user === null) {
      router.replace(`/admin/login?next=${encodeURIComponent(path)}`);
    }
  }, [path, router, user]);

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]">
        <span className="label text-[#c7a66b]">Checking secure session…</span>
      </main>
    );
  }

  return <>{children(user)}</>;
}
