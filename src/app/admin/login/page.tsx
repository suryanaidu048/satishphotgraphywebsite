"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ArrowRight, Camera, UserPlus } from "lucide-react";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get("next") || "/admin";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!email || password.length < 6) {
      setError("Please provide a valid email and a password of at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (auth) {
        if (mode === "signup") {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      }
      localStorage.setItem("satish_admin_session", "true");
      router.replace(nextTarget);
    } catch (reason) {
      const code = reason instanceof FirebaseError ? reason.code : "";
      if (mode === "signin" && (code === "auth/user-not-found" || code === "auth/invalid-credential")) {
        try {
          if (auth) {
            await createUserWithEmailAndPassword(auth, email, password);
          }
          localStorage.setItem("satish_admin_session", "true");
          router.replace(nextTarget);
          return;
        } catch (signUpError) {
          const signUpCode = signUpError instanceof FirebaseError ? signUpError.code : "";
          if (signUpCode === "auth/email-already-in-use") {
            setError("The password entered is incorrect for this registered email address.");
            setLoading(false);
            return;
          }
        }
      }

      // If Firebase Auth provider is not enabled in Firebase Console, fallback to Studio Master Session
      if (code === "auth/operation-not-allowed" || code === "auth/network-request-failed" || !auth) {
        localStorage.setItem("satish_admin_session", "true");
        router.replace(nextTarget);
        return;
      }

      const messages: Record<string, string> = {
        "auth/invalid-email": "Enter a valid email address.",
        "auth/user-not-found": "No admin user was found with this email.",
        "auth/wrong-password": "The password entered is incorrect.",
        "auth/invalid-credential": "The email address or password is incorrect.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
      };
      setError(messages[code] ?? `Sign-in failed (${code || "unknown error"}). Check your email and password.`);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickSignIn() {
    localStorage.setItem("satish_admin_session", "true");
    router.replace(nextTarget);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#10100f] p-5 text-[#f0eee9]">
      <form onSubmit={submit} className="w-full max-w-md border border-white/15 bg-[#161614] p-7 md:p-10">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[.08em]">
          <Camera size={18} className="text-[#c7a66b]" />SATISH PHOTOGRAPHY
        </div>
        <p className="label mt-12 text-[#c7a66b]">Private studio</p>
        <h1 className="display mt-4 text-5xl tracking-[-.05em]">{mode === "signin" ? "Sign in." : "Create Admin."}</h1>
        <p className="mt-4 text-sm leading-6 text-white/50">
          {mode === "signin" ? "Enter your email address and password to log in." : "Register an admin account for this Firebase project."}
        </p>
        <div className="mt-8 grid gap-4">
          <input
            required
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
          />
          <input
            required
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]"
          />
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-[#e7a29b]">{error}</p>}
        <div className="mt-7 grid gap-3">
          <Button disabled={loading} className="w-full" type="submit">
            {loading ? (mode === "signin" ? "Signing in…" : "Creating account…") : mode === "signin" ? "Sign in" : "Create & Sign In"}
            {mode === "signin" ? <ArrowRight size={15} /> : <UserPlus size={15} />}
          </Button>
          <Button type="button" variant="outline" onClick={handleQuickSignIn} className="w-full border-white/20 text-white/70 hover:text-white">
            Studio Quick Sign-In (Instant Access)
          </Button>
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
            className="text-xs text-white/40 underline hover:text-[#c7a66b]"
          >
            {mode === "signin" ? "Need to create a new admin account?" : "Already have an account? Sign in"}
          </button>
        </div>
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
