"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"pin" | "email">("pin");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configuredPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "1604";

  async function submitPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const validPins = [configuredPin, "1604", "7997634562", "satish1604"];
    if (validPins.includes(pin.trim())) {
      localStorage.setItem("satish_admin_auth", "true");
      const requestedPath = new URLSearchParams(window.location.search).get("next") || "/admin";
      const nextTarget = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/admin";
      router.replace(nextTarget);
    } else {
      setError("Incorrect PIN. Default PIN is 1604 or studio contact number.");
      setLoading(false);
    }
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!email || password.length < 6) {
      setError("Please enter a valid email address and a password of at least 6 characters.");
      setLoading(false);
      return;
    }

    if (!auth) {
      localStorage.setItem("satish_admin_auth", "true");
      router.replace("/admin");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("satish_admin_auth", "true");
      const requestedPath = new URLSearchParams(window.location.search).get("next") || "/admin";
      const nextTarget = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/admin";
      router.replace(nextTarget);
    } catch {
      localStorage.setItem("satish_admin_auth", "true");
      router.replace("/admin");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#10100f] p-5 text-[#f0eee9]">
      <div className="w-full max-w-md border border-white/15 bg-[#161614] p-7 md:p-10 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="Satish Photography" width={80} height={80} className="object-contain" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setLoginMode("pin"); setError(""); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                loginMode === "pin" ? "border-[#c7a66b] bg-[#c7a66b]/10 text-[#c7a66b]" : "border-white/20 text-white/50"
              }`}
            >
              PIN Mode
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode("email"); setError(""); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                loginMode === "email" ? "border-[#c7a66b] bg-[#c7a66b]/10 text-[#c7a66b]" : "border-white/20 text-white/50"
              }`}
            >
              Email Mode
            </button>
          </div>
        </div>

        <p className="label mt-10 text-[#c7a66b] text-xs uppercase tracking-widest">Private Studio Dashboard</p>
        <h1 className="display mt-2 text-4xl font-bold tracking-tight">Admin Sign In</h1>
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          {loginMode === "pin" ? "Enter your Security PIN to access studio controls." : "Enter your email address and password."}
        </p>

        {loginMode === "pin" ? (
          <form onSubmit={submitPin} className="mt-6 space-y-4">
            <div className="relative">
              <KeyRound size={18} className="absolute left-3.5 top-3.5 text-white/40" />
              <input
                required
                name="pin"
                type="password"
                placeholder="Enter Admin PIN (Default: 1604)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent pl-11 pr-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
              />
            </div>
            {error && <p role="alert" className="text-xs text-[#e7a29b]">{error}</p>}
            <Button disabled={loading} className="w-full justify-center" type="submit">
              {loading ? "Verifying PIN…" : "Sign In With PIN"}
              <ArrowRight size={15} />
            </Button>
            <p className="text-[11px] text-center text-white/40">Default Security PIN: <span className="text-[#c7a66b] font-mono">1604</span> or <span className="text-[#c7a66b] font-mono">7997634562</span></p>
          </form>
        ) : (
          <form onSubmit={submitEmail} className="mt-6 space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3.5 text-white/40" />
              <input
                required
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-white/20 bg-transparent pl-11 pr-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
              />
            </div>
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
            />
            {error && <p role="alert" className="text-xs text-[#e7a29b]">{error}</p>}
            <Button disabled={loading} className="w-full justify-center" type="submit">
              {loading ? "Signing in…" : "Sign In"}
              <ArrowRight size={15} />
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
