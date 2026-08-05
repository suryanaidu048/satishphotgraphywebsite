"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createInquiry } from "@/services/inquiries";

export function InquiryForm({ kind = "messages" }: { kind?: "messages" | "bookings" }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, ...values }),
      });

      if (!response.ok) {
        // Fall back to direct Firestore/localStorage service
        await createInquiry(kind, values);
      }

      setState("sent");
      form.reset();
    } catch {
      try {
        await createInquiry(kind, values);
        setState("sent");
        form.reset();
      } catch {
        setState("error");
      }
    }
  }
  const booking = kind === "bookings";
  return <form onSubmit={submit} className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2"><input required name="name" placeholder="Your name" className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]" /><input required type="email" name="email" placeholder="Email address" className="border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]" /></div>{booking && <div className="grid gap-4 sm:grid-cols-2"><input name="date" type="date" aria-label="Event date" className="border border-white/20 bg-transparent px-4 py-3 text-sm text-white/70 outline-none focus:border-[#c7a66b]" /><select name="eventType" defaultValue="" className="border border-white/20 bg-[#10100f] px-4 py-3 text-sm text-white/70 outline-none focus:border-[#c7a66b]"><option value="" disabled>Type of session</option><option>Wedding</option><option>Pre-wedding</option><option>Portrait</option><option>Event</option></select></div>}<textarea required name="message" rows={4} placeholder={booking ? "Tell us about the day, venue and guest count." : "How can we help?"} className="resize-none border border-white/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c7a66b]" /><Button disabled={state === "sending"} type="submit" className="w-full sm:w-fit">{state === "sending" ? "Sending…" : state === "sent" ? "Received — thank you" : "Send inquiry"}<ArrowRight size={15} /></Button>{state === "error" && <p className="text-sm text-[#e7a29b]">We couldn’t send this yet. Please try again shortly.</p>}</form>;
}
