"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Calendar, User, Mail, Phone, MessageSquare, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createInquiry } from "@/services/inquiries";

export function InquiryForm({
  kind = "bookings",
  initialSession = "",
}: {
  kind?: "messages" | "bookings";
  initialSession?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    try {
      await createInquiry(kind, values);
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  const booking = kind === "bookings";

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="relative">
          <input
            required
            name="name"
            placeholder="Your name"
            className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#c7a66b] transition"
          />
          <User size={16} className="absolute left-3 top-3.5 text-white/40" />
        </div>
        <div className="relative">
          <input
            required
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#c7a66b] transition"
          />
          <Mail size={16} className="absolute left-3 top-3.5 text-white/40" />
        </div>
        <div className="relative">
          <input
            required
            type="tel"
            name="phone"
            placeholder="Mobile number"
            className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#c7a66b] transition"
          />
          <Phone size={16} className="absolute left-3 top-3.5 text-white/40" />
        </div>
      </div>

      {booking && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#c7a66b]">Event Date (dd-mm-yyyy)</label>
            <div className="relative">
              <input
                required
                name="date"
                type="date"
                aria-label="Event Date (dd-mm-yyyy)"
                className="w-full border border-white/20 bg-transparent px-4 py-3 pl-10 text-sm text-white outline-none focus:border-[#c7a66b] transition [color-scheme:dark]"
              />
              <Calendar size={16} className="absolute left-3 top-3.5 text-white/40" />
            </div>
          </div>

          <div className="relative flex flex-col gap-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#c7a66b]">Type of Session</label>
            <div className="relative">
              <select
                required
                name="eventType"
                defaultValue={initialSession || ""}
                className="w-full border border-white/20 bg-[#161614] px-4 py-3 pl-10 text-sm text-white outline-none focus:border-[#c7a66b] transition"
              >
                <option value="" disabled>Select session type</option>
                <option value="Wedding Photography">💍 Wedding Photography</option>
                <option value="Pre-Wedding Photography">❤️ Pre-Wedding Photography</option>
                <option value="Engagement Photography">💑 Engagement Photography</option>
                <option value="Bridal Portraits">👰 Bridal Portraits</option>
                <option value="Birthday & Family Celebrations">🎉 Birthday & Family Celebrations</option>
                <option value="Maternity & Baby Photography">👶 Maternity & Baby Photography</option>
                <option value="Cinematic Videography">🎥 Cinematic Videography</option>
                <option value="Others">Others</option>
              </select>
              <Tag size={16} className="absolute left-3 top-3.5 text-white/40" />
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          required
          name="message"
          rows={3}
          placeholder={booking ? "Tell us about your celebration, location, or ideas..." : "How can we help?"}
          className="w-full resize-none border border-white/20 bg-transparent px-4 py-3 pl-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#c7a66b] transition"
        />
        <MessageSquare size={16} className="absolute left-3 top-3.5 text-white/40" />
      </div>

      <Button disabled={state === "sending"} type="submit" className="w-full sm:w-fit py-3.5 px-8 text-sm uppercase tracking-wider bg-[#c7a66b] text-[#10100f] hover:bg-[#b59457] font-semibold">
        {state === "sending" ? "Sending…" : state === "sent" ? "Inquiry Sent Successfully!" : "Submit Inquiry"}
        <ArrowRight size={15} />
      </Button>

      {state === "sent" && <p className="text-sm text-[#c7a66b]">Thank you! We will connect with you shortly.</p>}
      {state === "error" && <p className="text-sm text-[#e7a29b]">We couldn’t send this right now. Please try again or reach out on WhatsApp/Phone.</p>}
    </form>
  );
}
