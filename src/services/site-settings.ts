import { onValue, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";

export type SiteSettings = {
  studioName: string;
  logoUrl: string;
  phone: string;
  email: string;
  instagramUrl: string;
  whatsappNumber: string;
  address: string;
  copyright: string;
  pageContent: Record<string, { eyebrow?: string; title?: string; intro?: string; body?: string }>;
  faq: Array<{ question: string; answer: string }>;
};

export const defaultSiteSettings: SiteSettings = {
  studioName: "Satish Photography",
  logoUrl: "/logo.png",
  phone: "+91 7997634562",
  email: "satish.ch.photography@gmail.com",
  instagramUrl: "https://www.instagram.com/satish_photography1_?igsh=NXhwYmFjcGgwdXNt",
  whatsappNumber: "917997634562",

  address: "Hyderabad, Telangana, India",
  copyright: "Copyright © 2026 Satish Photography. All rights reserved.",
  pageContent: {
    portfolio: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
    gallery: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
    services: { eyebrow: "The Studio", title: "CAPTURING MOMENTS. CREATING MEMORIES.", intro: "Every celebration has a story worth telling. We specialize in capturing genuine emotions, timeless moments, and beautiful connections through creative photography and cinematic storytelling." },
    pricing: { eyebrow: "PERSONALIZED PACKAGES", title: "Thoughtfully shaped around your story.", intro: "Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable." },
    about: { eyebrow: "Behind The Lens", title: "Real moments, artfully held.", intro: "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye." },
    testimonials: { eyebrow: "In Their Words", title: "The feeling stays with them.", intro: "Kind words from people who trusted us with their most cherished days." },
    awards: { eyebrow: "Recognition", title: "Work made with care, seen with generosity.", intro: "A few acknowledgements that keep us curious and grateful." },
    faq: { eyebrow: "Helpful Answers", title: "The details, made simple.", intro: "If you don't see your question here, we'll be glad to talk it through." },
    contact: { eyebrow: "Get In Touch", title: "Start a conversation", intro: "Your story deserves to be beautifully remembered. Reach out to us about your plans, your ideas, or simply to say hello." },
    "privacy-policy": { eyebrow: "Privacy", title: "Your information, handled with care.", intro: "We only use your details to respond to inquiries and deliver the photography services you request.", body: "By using this website or submitting an inquiry, you agree that the studio may process the information you provide to arrange and deliver the requested services." },
    terms: { eyebrow: "Terms", title: "A clear agreement, from the start.", intro: "Booking terms, payment schedules and usage rights are confirmed in your individual service agreement.", body: "Specific project terms are supplied before booking." },
  },
  faq: [
    { question: "How far in advance should we book?", answer: "For weddings, we recommend reaching out 6–12 months ahead. If your date is closer, ask anyway — we may be available." },
    { question: "Do you travel for celebrations?", answer: "Yes. We work across India and welcome destination celebrations." },
    { question: "When will we receive our images?", answer: "A curated preview arrives shortly after the event, followed by your complete gallery within the timeline in your agreement." },
  ],
};

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void) {
  if (!database) { callback(defaultSiteSettings); return () => undefined; }
  return onValue(ref(database, "websiteSettings"), (snapshot) => {
    const stored = snapshot.val() as Partial<SiteSettings> | null;
    callback({ ...defaultSiteSettings, ...stored, pageContent: { ...defaultSiteSettings.pageContent, ...(stored?.pageContent ?? {}) }, faq: stored?.faq ?? defaultSiteSettings.faq });
  }, () => callback(defaultSiteSettings));
}

export async function saveSiteSettings(settings: SiteSettings) {
  if (!database) throw new Error("Realtime Database is not configured.");
  await set(ref(database, "websiteSettings"), { ...settings, updatedAt: Date.now() });
}
