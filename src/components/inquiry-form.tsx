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
    const rawEntries = Array.from(new FormData(form).entries());
    const values: Record<string, string> = {};
    for (const [k, v] of rawEntries) {
      values[k] = typeof v === "string" ? v.trim() : String(v);
    }

    setState("sending");
    try {
      await createInquiry(kind, values);
      setState("sent");

      // Format WhatsApp notification text for immediate dispatch to studio WhatsApp
      const waText = encodeURIComponent(
        `📸 *New ${booking ? "Booking Request" : "Website Inquiry"} - Satish Photography*\n\n` +
        `👤 *Name:* ${values.name || "-"}\n` +
        `📞 *Phone:* ${values.phone || "-"}\n` +
        `✉️ *Email:* ${values.email || "-"}\n` +
        (values.date ? `📅 *Event Date:* ${values.date}\n` : "") +
        (values.eventType ? `🎯 *Session Type:* ${values.eventType}\n` : "") +
        `💬 *Message:* ${values.message || "-"}\n\n` +
        `_Submitted via satishphotography website_`
      );
      const waUrl = `https://api.whatsapp.com/send?phone=917997634562&text=${waText}`;

      // Open WhatsApp notification automatically in new tab
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }

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
                <option value="Bride & Groom Portraits">👰🤵 Bride & Groom Portraits</option>
                <option value="Celebrity Photography">🌟 Celebrity Photography</option>
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

      {state === "sent" && (
        <div className="mt-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-4 text-sm text-[#25D366]">
          <p className="font-semibold">✓ Inquiry received & stored successfully!</p>
          <p className="mt-1 text-xs text-white/80">
            A WhatsApp notification was prepared for Satish Photography (+91 7997634562). We will get back to you shortly.
          </p>
        </div>
      )}
      {state === "error" && <p className="text-sm text-[#e7a29b]">We couldn’t send this right now. Please try again or reach out directly on WhatsApp (+91 7997634562) or phone.</p>}
    </form>
  );
}
