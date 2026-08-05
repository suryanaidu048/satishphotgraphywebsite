"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ArrowRight, Camera } from "lucide-react";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get("next") || "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) {
      setError("Firebase is not configured in this environment.");
      return;
    }
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(auth, String(data.get("email")), String(data.get("password")));
      router.replace(nextTarget);
    } catch (reason) {
      const code = reason instanceof FirebaseError ? reason.code : "";
      const messages: Record<string, string> = {
        "auth/invalid-email": "Enter a valid email address.",
        "auth/user-not-found": "No user was found with this email address.",
        "auth/wrong-password": "The password is incorrect.",
        "auth/invalid-credential": "The email address or password is incorrect.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase Authentication.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
        "auth/network-request-failed": "We couldn’t reach Firebase. Check your connection and try again.",
      };
      setError(messages[code] ?? "Sign-in failed. Check the account details and Firebase Authentication settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#10100f] p-5 text-[#f0eee9]">
      <form onSubmit={submit} className="w-full max-w-md border border-white/15 bg-[#161614] p-7 md:p-10">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[.08em]">
          <Camera size={18} className="text-[#c7a66b]" />SATISH PHOTOGRAPHY
        </div>
        <p className="label mt-12 text-[#c7a66b]">Private studio</p>
        <h1 className="display mt-4 text-5xl tracking-[-.05em]">Sign in.</h1>
        <p className="mt-4 text-sm leading-6 text-white/50">Use the email address and password created in Firebase Authentication.</p>
        <div className="mt-8 grid gap-4">
          <input required name="email" type="email" placeholder="Email address" autoComplete="email" className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]" />
          <input required name="password" type="password" placeholder="Password" autoComplete="current-password" className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]" />
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-[#e7a29b]">{error}</p>}
        <Button disabled={!firebaseEnabled || loading} className="mt-7 w-full" type="submit">
          {loading ? "Signing in…" : "Sign in"}<ArrowRight size={15} />
        </Button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#10100f] text-[#f0eee9]"><span className="label text-[#c7a66b]">Loading studio sign-in…</span></main>}>
      <LoginForm />
    </Suspense>
  );
}
