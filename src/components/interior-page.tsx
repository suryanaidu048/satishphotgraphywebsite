"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InquiryForm } from "@/components/inquiry-form";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";

type Page = { eyebrow: string; title: string; intro: string };
const pages: Record<string, Page> = {
  portfolio: { eyebrow: "Selected stories", title: "A photograph should bring the whole room back.", intro: "A living collection of weddings, portraits and celebrations made with patience and an editorial eye." },
  gallery: { eyebrow: "The archive", title: "Every frame has a pulse.", intro: "Explore stories arranged by the feeling they hold — from first light to the last song." },
  services: { eyebrow: "The studio", title: "Attentive coverage for your most human days.", intro: "Every commission is tailored around how you want the day to feel, not just how it will look." },
  pricing: { eyebrow: "Collections", title: "Thoughtfully shaped around your story.", intro: "We create bespoke collections after understanding your celebration, location and priorities." },
  about: { eyebrow: "Behind the lens", title: "To notice what others might miss.", intro: "Satish Photography is built on an instinct for atmosphere: the quiet before a ceremony, the hands that reach for one another, the joy that won't stay still." },
  testimonials: { eyebrow: "In their words", title: "The feeling stays with them.", intro: "Kind words from people who trusted us with their day." },
  awards: { eyebrow: "Recognition", title: "Work made with care, seen with generosity.", intro: "A few acknowledgements that keep us curious and grateful." },
  faq: { eyebrow: "Helpful answers", title: "The details, made simple.", intro: "If you don't see your question here, we'll be glad to talk it through." },
  contact: { eyebrow: "Get in touch", title: "Tell us about what's ahead.", intro: "For availability, collaborations and all other questions, write to the studio." },
  "privacy-policy": { eyebrow: "Privacy", title: "Your information, handled with care.", intro: "We only use your details to respond to inquiries and deliver the photography services you request." },
  terms: { eyebrow: "Terms", title: "A clear agreement, from the start.", intro: "Booking terms, payment schedules and usage rights are confirmed in your individual service agreement." },
};

function GalleryGrid() {
  const [items, setItems] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => setItems(entries));
    return unsub;
  }, []);

  const galleryItems = items
    .map((x) => ({ id: x.id, src: String(x.src ?? ""), title: String(x.title || x.category || "Selected work") }))
    .filter((x) => Boolean(x.src));

  if (!galleryItems.length) {
    return (
      <section className="mx-auto max-w-[1480px] px-5 py-20 md:px-10">
        <div className="border border-dashed border-white/15 bg-white/5 p-12 text-center text-sm text-white/60">
          No gallery images uploaded yet. Upload images from the Admin Panel to display them here.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-[1480px] gap-4 px-5 py-20 md:grid-cols-3 md:px-10">
      {galleryItems.map((item, i) => (
        <figure className={i % 3 === 1 ? "md:mt-20" : ""} key={item.id}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <figcaption className="label mt-3 text-white/45">{item.title}</figcaption>
        </figure>
      ))}
    </section>
  );
}

function DynamicPricingSection() {
  const [plans, setPlans] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("pricingPlans", setPlans), []);

  if (!plans.length) {
    return (
      <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
        <div className="border border-dashed border-white/15 bg-white/5 p-12 text-center text-sm text-white/60">
          No pricing packages configured yet. Add pricing collections from the Admin Panel to show them here.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-[1480px] gap-4 px-5 py-10 md:grid-cols-3 md:px-10">
      {plans.map((plan, index) => (
        <article key={plan.id} className="border border-white/15 p-7">
          <p className="label text-[#c7a66b]">{plan.price || `Collection ${String(index + 1).padStart(2, "0")}`}</p>
          <h2 className="display mt-5 text-4xl">{String(plan.title ?? "")}</h2>
          <p className="my-7 text-sm text-white/55">{String(plan.body ?? "")}</p>
          <ul className="space-y-3 text-sm text-white/70">
            {(plan.features ?? []).map((x) => (
              <li key={x} className="flex gap-2"><Check size={15} className="text-[#c7a66b]" />{x}</li>
            ))}
          </ul>
          <Link href="/booking" className="label mt-10 inline-block border-b border-[#c7a66b] pb-2">Request a proposal</Link>
        </article>
      ))}
    </section>
  );
}

function DynamicTestimonialsSection() {
  const [quotes, setQuotes] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("testimonials", setQuotes), []);

  if (!quotes.length) {
    return (
      <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
        <div className="border border-dashed border-white/15 bg-white/5 p-12 text-center text-sm text-white/60">
          No client testimonials added yet. Add testimonials from the Admin Panel to show them here.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
      {quotes.map((quote, i) => (
        <blockquote className="border-t border-white/15 py-10 md:grid md:grid-cols-3" key={quote.id}>
          <p className="label text-[#c7a66b]">0{i + 1} / {String(quote.author || "Client note")}</p>
          <p className="display col-span-2 text-3xl leading-tight md:text-5xl">"{String(quote.body)}"</p>
          {quote.role && <p className="label mt-2 text-white/45 md:col-start-2">{String(quote.role)}</p>}
        </blockquote>
      ))}
    </section>
  );
}

export function InteriorPage({ slug }: { slug: string }) {
  const page = pages[slug];
  if (!page) return null;

  const isPortfolio = slug === "portfolio" || slug === "gallery";
  const isContact = slug === "contact";
  const isPricing = slug === "pricing";
  const isFaq = slug === "faq";

  return (
    <div>
      <SiteHeader />
      <main>
        {/* Page header */}
        <section className="px-5 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
          <div className="mx-auto max-w-[1480px]">
            <p className="label text-[#c7a66b]">{page.eyebrow}</p>
            <h1 className="display mt-5 max-w-5xl text-6xl leading-[.94] tracking-[-.05em] md:text-8xl">{page.title}</h1>
            <p className="mt-8 max-w-xl text-sm leading-8 text-white/60">{page.intro}</p>
          </div>
        </section>

        {/* Portfolio / gallery grid */}
        {isPortfolio && <GalleryGrid />}

        {/* Services list & pricing packages */}
        {slug === "services" && (
          <>
            <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
              <div className="border-t border-white/10 pt-10">
                <div className="mx-auto max-w-[1480px]">
                  <p className="label text-[#c7a66b]">Available Collections</p>
                  <h2 className="display mt-2 text-4xl md:text-6xl">Bespoke photography packages</h2>
                </div>
                <DynamicPricingSection />
              </div>
            </section>
          </>
        )}

        {/* Dynamic pricing from Realtime Database */}
        {isPricing && <DynamicPricingSection />}

        {/* Dynamic testimonials from Realtime Database */}
        {slug === "testimonials" && <DynamicTestimonialsSection />}

        {/* FAQ */}
        {isFaq && (
          <section className="mx-auto max-w-[900px] px-5 py-10 md:px-10">
            {[
              ["How far in advance should we book?", "For weddings, we recommend reaching out 6–12 months ahead. If your date is closer, ask anyway — we may be available."],
              ["Do you travel for celebrations?", "Yes. We work across India and welcome destination celebrations."],
              ["When will we receive our images?", "A curated preview arrives shortly after the event, followed by your complete gallery within the timeline in your agreement."],
            ].map(([q, a]) => (
              <details className="group border-t border-white/15 py-6" key={q}>
                <summary className="cursor-pointer list-none text-lg">{q}<span className="float-right text-[#c7a66b]">+</span></summary>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">{a}</p>
              </details>
            ))}
          </section>
        )}

        {/* Contact form */}
        {isContact && (
          <section className="mx-auto max-w-[900px] px-5 py-10 md:px-10">
            <InquiryForm />
          </section>
        )}

        {/* Legal pages */}
        {["privacy-policy", "terms"].includes(slug) && (
          <section className="mx-auto max-w-3xl px-5 py-10 text-sm leading-8 text-white/60 md:px-10">
            <p>By using this website or submitting an inquiry, you agree that the studio may process the information you provide to arrange and deliver the requested services. Specific project terms are supplied before booking.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
