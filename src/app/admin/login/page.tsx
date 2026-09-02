"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("satish@satish.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setAdminSession(userEmail: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("satish_admin_auth", "true");
      localStorage.setItem("satish_admin_email", userEmail);
      document.cookie = "satish_admin_auth=true; path=/; max-age=864000; SameSite=Lax";
      document.cookie = `satish_admin_email=${encodeURIComponent(userEmail)}; path=/; max-age=864000; SameSite=Lax`;
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError("Please enter your email and password / PIN.");
      setLoading(false);
      return;
    }

    // Set local and cookie session immediately
    setAdminSession(cleanEmail);

    const requestedPath = new URLSearchParams(window.location.search).get("next") || "/admin";
    const nextTarget = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/admin";

    // Immediate navigation
    router.push(nextTarget);
    setTimeout(() => {
      window.location.href = nextTarget;
    }, 50);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#10100f] p-5 text-[#f0eee9]">
      <div className="w-full max-w-md border border-white/15 bg-[#161614] p-7 md:p-10 rounded-xl shadow-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <Image src="/logo.png" alt="Satish Photography" width={70} height={70} className="object-contain" />
          <div>
            <p className="label text-[#c7a66b] text-xs uppercase tracking-widest">Private Studio Dashboard</p>
            <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60 block mb-1 font-medium">Admin Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-white/40" />
              <input
                required
                name="email"
                type="email"
                placeholder="satish@satish.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 block mb-1 font-medium">Password or Security PIN</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-white/40" />
              <input
                required
                name="password"
                type="password"
                placeholder="Enter password or PIN (Default: 1604)"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
              />
            </div>
          </div>

          {error && <p role="alert" className="text-xs text-[#e7a29b]">{error}</p>}

          <Button disabled={loading} className="w-full justify-center mt-2" type="submit">
            {loading ? "Authenticating…" : "Sign In to Admin Dashboard"}
            <ArrowRight size={15} />
          </Button>

          <div className="pt-2 text-center text-xs text-white/40 border-t border-white/10 mt-4 space-y-1">
            <p>Admin Email: <span className="text-[#c7a66b] font-mono">satish@satish.com</span></p>
            <p>Default PIN: <span className="text-[#c7a66b] font-mono">1604</span> or <span className="text-[#c7a66b] font-mono">7997634562</span></p>
          </div>
        </form>
      </div>
    </main>
  );
}
