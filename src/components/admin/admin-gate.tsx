"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

function checkAdminSession(): { authenticated: boolean; email: string } {
  if (typeof window === "undefined") return { authenticated: false, email: "satish@satish.com" };
  
  const localAuth = localStorage.getItem("satish_admin_auth") === "true";
  const localEmail = localStorage.getItem("satish_admin_email");

  const cookieAuth = document.cookie.includes("satish_admin_auth=true");
  const cookieEmailMatch = document.cookie.match(/satish_admin_email=([^;]+)/);
  const cookieEmail = cookieEmailMatch ? decodeURIComponent(cookieEmailMatch[1]) : null;

  if (localAuth || cookieAuth) {
    return {
      authenticated: true,
      email: localEmail || cookieEmail || "satish@satish.com",
    };
  }

  return { authenticated: false, email: "satish@satish.com" };
}

export function AdminGate({ children }: { children: (user: User | { email: string; uid: string }) => React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<User | { email: string; uid: string } | null | undefined>(undefined);

  useEffect(() => {
    const session = checkAdminSession();
    if (session.authenticated) {
      setUser({ email: session.email, uid: "admin-session" });
      return;
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
        const recheck = checkAdminSession();
        if (recheck.authenticated) {
          setUser({ email: recheck.email, uid: "admin-session" });
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
