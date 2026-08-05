"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InquiryForm } from "@/components/inquiry-form";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";

type Page = { eyebrow: string; title: string; intro: string; image?: string };
const pages: Record<string, Page> = {
  portfolio: { eyebrow: "Selected stories", title: "A photograph should bring the whole room back.", intro: "A living collection of weddings, portraits and celebrations made with patience and an editorial eye.", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85" },
  gallery: { eyebrow: "The archive", title: "Every frame has a pulse.", intro: "Explore stories arranged by the feeling they hold — from first light to the last song.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85" },
  services: { eyebrow: "The studio", title: "Attentive coverage for your most human days.", intro: "Every commission is tailored around how you want the day to feel, not just how it will look.", image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1800&q=85" },
  pricing: { eyebrow: "Collections", title: "Thoughtfully shaped around your story.", intro: "We create bespoke collections after understanding your celebration, location and priorities." },
  about: { eyebrow: "Behind the lens", title: "To notice what others might miss.", intro: "Satish Photography is built on an instinct for atmosphere: the quiet before a ceremony, the hands that reach for one another, the joy that won't stay still.", image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1800&q=85" },
  testimonials: { eyebrow: "In their words", title: "The feeling stays with them.", intro: "Kind words from people who trusted us with their day." },
  awards: { eyebrow: "Recognition", title: "Work made with care, seen with generosity.", intro: "A few acknowledgements that keep us curious and grateful." },
  faq: { eyebrow: "Helpful answers", title: "The details, made simple.", intro: "If you don't see your question here, we'll be glad to talk it through." },
  contact: { eyebrow: "Get in touch", title: "Tell us about what's ahead.", intro: "For availability, collaborations and all other questions, write to the studio." },
  "privacy-policy": { eyebrow: "Privacy", title: "Your information, handled with care.", intro: "We only use your details to respond to inquiries and deliver the photography services you request." },
  terms: { eyebrow: "Terms", title: "A clear agreement, from the start.", intro: "Booking terms, payment schedules and usage rights are confirmed in your individual service agreement." },
};

const fallbackPortfolio = [
  { id: "fallback-1", src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", title: "Weddings" },
  { id: "fallback-2", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85", title: "Pre-wedding" },
  { id: "fallback-3", src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85", title: "Portraits" },
];

function GalleryGrid() {
  const [items, setItems] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => setItems(entries));
    return unsub;
  }, []);

  const firestoreItems = items
    .map((x) => ({ id: x.id, src: String(x.src ?? ""), title: String(x.title || x.category || "Selected work") }))
    .filter((x) => Boolean(x.src));

  const combined = firestoreItems;

  const displayItems = combined.length ? combined : fallbackPortfolio;
  // BUG-20 fixed: removed dead isDataUrl helper — base64 fallback no longer exists

  return (
    <section className="mx-auto grid max-w-[1480px] gap-4 px-5 py-20 md:grid-cols-3 md:px-10">
      {displayItems.map((item, i) => (
        <figure className={i % 3 === 1 ? "md:mt-20" : ""} key={item.id}>
          <div className="relative aspect-[4/5]">
            <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <figcaption className="label mt-3 text-white/45">{item.title}</figcaption>
        </figure>
      ))}
    </section>
  );
}

// Pricing is sourced from the central Realtime Database.
function DynamicPricingSection() {
  const [plans, setPlans] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("pricingPlans", setPlans), []);

  if (!plans.length) {
    // Fallback static UI while data loads or if no plans are configured yet.
    return (
      <section className="mx-auto grid max-w-[1480px] gap-4 px-5 py-10 md:grid-cols-3 md:px-10">
        {["Essentials", "Signature", "The complete story"].map((plan, index) => (
          <article key={plan} className="border border-white/15 p-7">
            <p className="label text-[#c7a66b]">Collection {String(index + 1).padStart(2, "0")}</p>
            <h2 className="display mt-5 text-4xl">{plan}</h2>
            <p className="my-7 text-sm text-white/55">A tailored approach, beginning with a conversation.</p>
            <ul className="space-y-3 text-sm text-white/70">
              {["Pre-event consultation", "Edited high-resolution images", "Private online gallery"].map((x) => (
                <li key={x} className="flex gap-2"><Check size={15} className="text-[#c7a66b]" />{x}</li>
              ))}
            </ul>
            <Link href="/booking" className="label mt-10 inline-block border-b border-[#c7a66b] pb-2">Request a proposal</Link>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-[1480px] gap-4 px-5 py-10 md:grid-cols-3 md:px-10">
      {plans.map((plan, index) => (
        <article key={plan.id} className="border border-white/15 p-7">
          <p className="label text-[#c7a66b]">{plan.price || `Collection ${String(index + 1).padStart(2, "0")}`}</p>
          <h2 className="display mt-5 text-4xl">{String(plan.title ?? "")}</h2>
          <p className="my-7 text-sm text-white/55">{String(plan.body ?? "A tailored approach, beginning with a conversation.")}</p>
          <ul className="space-y-3 text-sm text-white/70">
            {(plan.features ?? ["Pre-event consultation", "Edited high-resolution images", "Private online gallery"]).map((x) => (
              <li key={x} className="flex gap-2"><Check size={15} className="text-[#c7a66b]" />{x}</li>
            ))}
          </ul>
          <Link href="/booking" className="label mt-10 inline-block border-b border-[#c7a66b] pb-2">Request a proposal</Link>
        </article>
      ))}
    </section>
  );
}

// Testimonials are sourced from the central Realtime Database.
function DynamicTestimonialsSection() {
  const [quotes, setQuotes] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("testimonials", setQuotes), []);

  const fallbackQuotes = [
    "You captured every in-between moment we never knew we needed.",
    "The photographs feel exactly like the day did — warm, wild and full of us.",
    "Calm presence, beautiful eye, extraordinary work.",
  ];

  const displayQuotes = quotes.length
    ? quotes.map((q) => ({ id: q.id, body: String(q.body ?? ""), author: String(q.author ?? ""), role: String(q.role ?? "") }))
    : fallbackQuotes.map((q, i) => ({ id: `fallback-${i}`, body: q, author: "Client note", role: "" }));

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
      {displayQuotes.map((quote, i) => (
        <blockquote className="border-t border-white/15 py-10 md:grid md:grid-cols-3" key={quote.id}>
          <p className="label text-[#c7a66b]">0{i + 1} / {quote.author || "Client note"}</p>
          <p className="display col-span-2 text-3xl leading-tight md:text-5xl">"{quote.body}"</p>
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

        {/* Hero image */}
        {page.image && (
          <div className="relative mx-auto h-[48vh] max-w-[1480px] px-5 md:h-[68vh] md:px-10">
            <Image src={page.image} alt="Satish Photography work" fill sizes="100vw" className="object-cover px-5 md:px-10" />
          </div>
        )}

        {/* Portfolio / gallery grid */}
        {isPortfolio && <GalleryGrid />}

        {/* Services list & pricing packages */}
        {slug === "services" && (
          <>
            <section className="mx-auto max-w-[1480px] px-5 py-20 md:px-10">
              <div className="divide-y divide-white/15 border-y border-white/15">
                {["Wedding photography", "Pre-wedding stories", "Portrait sessions", "Editorial & commercial"].map((item) => (
                  <Link href="/booking" key={item} className="flex items-center justify-between py-5 text-2xl md:text-4xl">
                    <span>{item}</span>
                    <ArrowUpRight className="text-[#c7a66b]" />
                  </Link>
                ))}
              </div>
            </section>
            <div className="border-t border-white/10 pt-10">
              <div className="mx-auto max-w-[1480px] px-5 md:px-10">
                <p className="label text-[#c7a66b]">Available Collections</p>
                <h2 className="display mt-2 text-4xl md:text-6xl">Bespoke photography packages</h2>
              </div>
              <DynamicPricingSection />
            </div>
          </>
        )}

        {/* Dynamic pricing from Realtime Database */}
        {isPricing && <DynamicPricingSection />}

        {/* Dynamic testimonials from Realtime Database */}
        {slug === "testimonials" && <DynamicTestimonialsSection />}

        {/* Awards */}
        {slug === "awards" && (
          <section className="mx-auto grid max-w-[1480px] gap-px bg-white/15 px-5 py-10 md:grid-cols-3 md:px-10">
            {["International Wedding Awards", "Fearless Photographers", "Wedding Sutra"].map((award, i) => (
              <article className="bg-[#10100f] p-7" key={award}>
                <p className="label text-[#c7a66b]">20{22 + i}</p>
                <h2 className="display mt-10 text-3xl">{award}</h2>
                <p className="mt-3 text-sm text-white/50">Selected work</p>
              </article>
            ))}
          </section>
        )}

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
            <div className="mt-16 border-t border-white/15 pt-6 text-sm text-white/55">
              Based in India · Available worldwide<br />
              <a className="text-[#c7a66b]" href="mailto:hello@satishphotography.com">hello@satishphotography.com</a>
            </div>
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
