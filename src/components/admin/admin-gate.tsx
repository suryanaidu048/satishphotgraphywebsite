"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export function AdminGate({ children }: { children: (user: User) => React.ReactNode }) {
  const router = useRouter(); const path = usePathname(); const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => { if (!auth) { setUser(null); return; } return onAuthStateChanged(auth, (current) => setUser(current)); }, []);
  useEffect(() => { if (user === null) router.replace(`/admin/login?next=${encodeURIComponent(path)}`); }, [path, router, user]);
  if (!user) return <main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]"><span className="label text-[#c7a66b]">Checking secure session…</span></main>;
  return <>{children(user)}</>;
}
