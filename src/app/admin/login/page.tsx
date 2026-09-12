"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function friendlyAuthError(code: string): string {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password. Please try again.";
      case "auth/invalid-email":
        return "That doesn't look like a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Contact the site owner.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Sign-in failed. Please check your credentials.";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    // Firebase must be configured — without it there is no safe way to verify identity
    if (!auth) {
      setError("Authentication service is not configured. Contact the site owner.");
      setLoading(false);
      return;
    }

    try {
      // Sign in via Firebase — this is the ONLY gate; we navigate only on success
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);

      const requestedPath = new URLSearchParams(window.location.search).get("next") || "/admin";
      const nextTarget =
        requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/admin";

      router.push(nextTarget);
    } catch (err) {
      const authErr = err as AuthError;
      setError(friendlyAuthError(authErr.code ?? ""));
    } finally {
      setLoading(false);
    }
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
                placeholder="Enter email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 block mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-white/40" />
              <input
                required
                name="password"
                type="password"
                placeholder="Enter password"
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
        </form>
      </div>
    </main>
  );
}
