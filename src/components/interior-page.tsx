"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InquiryForm } from "@/components/inquiry-form";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";
import { defaultTestimonials, defaultPricingPlans } from "@/lib/demo-content";

type Page = { eyebrow: string; title: string; intro: string };
const pages: Record<string, Page> = {
  portfolio: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
  gallery: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
  services: { eyebrow: "The Studio", title: "CAPTURING MOMENTS. CREATING MEMORIES.", intro: "Every celebration has a story worth telling. We specialize in capturing genuine emotions, timeless moments, and beautiful connections through creative photography and cinematic storytelling." },
  pricing: { eyebrow: "PERSONALIZED PACKAGES", title: "Thoughtfully shaped around your story.", intro: "Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable." },
  about: { eyebrow: "Behind The Lens", title: "Real moments, artfully held.", intro: "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye." },
  testimonials: { eyebrow: "In Their Words", title: "The feeling stays with them.", intro: "Kind words from people who trusted us with their most cherished days." },
  awards: { eyebrow: "Recognition", title: "Work made with care, seen with generosity.", intro: "A few acknowledgements that keep us curious and grateful." },
  faq: { eyebrow: "Helpful Answers", title: "The details, made simple.", intro: "If you don't see your question here, we'll be glad to talk it through." },
  contact: { eyebrow: "Get In Touch", title: "Start a conversation", intro: "Your story deserves to be beautifully remembered. Reach out to us about your plans, your ideas, or simply to say hello. We’re always happy to connect." },
  "privacy-policy": { eyebrow: "Privacy", title: "Your information, handled with care.", intro: "We only use your details to respond to inquiries and deliver the photography services you request." },
  terms: { eyebrow: "Terms", title: "A clear agreement, from the start.", intro: "Booking terms, payment schedules and usage rights are confirmed in your individual service agreement." },
};

const CATEGORY_TABS = [
  { label: "All Stories", value: "all" },
  { label: "💍 Wedding", value: "Wedding" },
  { label: "❤️ Pre-Wedding", value: "Pre-Wedding" },
  { label: "💑 Engagement", value: "Engagement" },
  { label: "👰 Bridal", value: "Bridal" },
  { label: "🎉 Celebrations", value: "Celebration" },
  { label: "👶 Maternity", value: "Maternity" },
  { label: "🎥 Videography", value: "Videography" },
  { label: "Others", value: "Others" },
];

function GalleryGrid() {
  const [items, setItems] = useState<PublicEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => setItems(entries));
    return unsub;
  }, []);

  const galleryItems = items.length
    ? items
        .map((x) => ({
          id: x.id,
          src: String(x.src ?? ""),
          title: String(x.title || x.category || "Selected work"),
          category: String(x.category || "Wedding Photography"),
        }))
        .filter((x) => Boolean(x.src))
    : [
        { id: "1", src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", title: "Royal Wedding Ceremony", category: "Wedding Photography" },
        { id: "2", src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80", title: "Sunset Pre-Wedding Story", category: "Pre-Wedding Photography" },
        { id: "3", src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80", title: "Engagement Celebration", category: "Engagement Photography" },
        { id: "4", src: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80", title: "Bridal Portraiture", category: "Bridal Portraits" },
        { id: "5", src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80", title: "Family Gathering & Joy", category: "Birthday & Family Celebrations" },
        { id: "6", src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80", title: "Maternity & Baby Portrait", category: "Maternity & Baby Photography" },
        { id: "7", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80", title: "Cinematic Film Stills", category: "Cinematic Videography" },
      ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => {
        const itemCat = item.category.toLowerCase();
        const itemTitle = item.title.toLowerCase();
        const target = activeCategory.toLowerCase();
        return itemCat.includes(target) || itemTitle.includes(target);
      });

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-8 md:px-10">
      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? "bg-[#c7a66b] text-[#10100f] shadow-lg"
                  : "border border-white/20 bg-white/5 text-white/70 hover:border-[#c7a66b] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredItems.length ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, i) => {
            const isLandscape = i % 3 === 0;
            return (
              <figure
                key={item.id}
                className={`relative overflow-hidden rounded-xl bg-[#10100f]/10 shadow-sm transition duration-300 hover:scale-[1.02] ${
                  isLandscape ? "aspect-[4/3] sm:col-span-2" : "aspect-[3/4]"
                }`}
              >
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-xs font-medium text-white opacity-90 flex items-end justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-[10px] text-[#c7a66b] uppercase tracking-wider">{item.category}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/20 p-12 text-center text-sm text-white/50">
          No photos found for "{activeCategory}". Upload photos in this category from the Admin Panel to feature them here.
        </div>
      )}
    </section>
  );
}

function DynamicPricingSection() {
  const [plans, setPlans] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("pricingPlans", setPlans), []);

  const displayPlans = plans.length ? plans : defaultPricingPlans;

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
      <div className="rounded-2xl bg-[#e8dad3] p-8 md:p-14 text-[#10100f]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#10100f] sm:text-4xl md:text-5xl uppercase">
            PERSONALIZED PACKAGES
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#10100f]/80 md:text-base">
            Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-3 items-stretch">
          {displayPlans.map((plan, index) => {
            const isHighlighted = Boolean(plan.highlight) || plan.title?.toLowerCase() === "premium" || index === 2;
            return (
              <article
                key={plan.id}
                className={`flex flex-col justify-between p-7 sm:p-9 transition-shadow duration-300 ${
                  isHighlighted
                    ? "bg-[#222222] text-white border border-[#222222] shadow-2xl"
                    : "bg-[#e5d5ca] text-[#10100f] border-2 border-[#10100f]"
                }`}
              >
                <div className="text-center">
                  <h3 className="text-3xl font-semibold tracking-wide">{plan.title}</h3>
                  <p className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{plan.price}</p>

                  <div className="mt-8 space-y-0 text-center">
                    {(plan.features ?? []).map((feature, fIndex) => (
                      <div key={feature}>
                        <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                          <Check size={16} className={isHighlighted ? "text-white" : "text-[#10100f]"} />
                          <span>{feature}</span>
                        </div>
                        {fIndex < (plan.features ?? []).length - 1 && (
                          <div className={`h-px w-full ${isHighlighted ? "bg-white/20" : "bg-[#10100f]"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-4 text-center">
                  <Link
                    href="/booking"
                    className="inline-block w-full bg-[#b38e2e] hover:bg-[#a07d24] text-white font-semibold py-3 px-4 text-sm uppercase tracking-wider transition border border-white/30"
                  >
                    BOOK NOW
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DynamicTestimonialsSection() {
  const [quotes, setQuotes] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("testimonials", setQuotes);
    return unsub;
  }, []);

  const displayQuotes = quotes.length ? quotes : defaultTestimonials;

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10">
      <div className="divide-y divide-white/15 border-y border-white/15">
        {displayQuotes.map((quote, i) => (
          <blockquote className="py-12 md:grid md:grid-cols-12 md:gap-8 md:py-16 min-w-0" key={quote.id || `quote-${i}`}>
            <div className="mb-6 md:col-span-4 md:mb-0 min-w-0">
              <div className="flex items-center gap-3">
                <span className="label font-mono text-sm tracking-wider text-[#c7a66b]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-6 bg-[#c7a66b]/40" />
              </div>
              <h3 className="mt-4 text-xl font-medium tracking-wide text-white break-words [overflow-wrap:anywhere]">
                {String(quote.author || "Client note")}
              </h3>
              {quote.role && (
                <p className="mt-1 text-sm leading-relaxed text-white/50 break-words [overflow-wrap:anywhere]">
                  {String(quote.role)}
                </p>
              )}
            </div>

            <div className="md:col-span-8 min-w-0">
              <p className="display text-3xl leading-snug tracking-[-.02em] text-white/95 md:text-4xl lg:text-5xl break-words [overflow-wrap:anywhere]">
                "{String(quote.body)}"
              </p>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function DedicatedServicesPage() {
  const [galleryItems, setGalleryItems] = useState<PublicEntry[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", setGalleryItems);
    return unsub;
  }, []);

  const handleBookService = (sessionType: string) => {
    setSelectedSession(sessionType);
    const bookingFormEl = document.getElementById("service-booking-form");
    if (bookingFormEl) {
      bookingFormEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const servicesData = [
    {
      id: "wedding",
      icon: "💍",
      title: "Wedding Photography",
      categoryKey: "Wedding",
      description:
        "Your wedding is one of life's most cherished milestones. We capture every smile, every emotion, and every unforgettable moment with a blend of creativity, elegance, and attention to detail, ensuring your memories remain timeless.",
      defaultImages: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "pre-wedding",
      icon: "❤️",
      title: "Pre-Wedding Photography",
      categoryKey: "Pre-Wedding",
      description:
        "Celebrate your journey before the big day with creative and personalized pre-wedding sessions. Whether it's a romantic outdoor location or a meaningful place that reflects your story, we create photographs that beautifully showcase your bond.",
      defaultImages: [
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "engagement",
      icon: "💑",
      title: "Engagement Photography",
      categoryKey: "Engagement",
      description:
        "Every proposal and engagement marks the beginning of a beautiful journey. We capture the excitement, love, and happiness of this special chapter with natural, heartfelt, and artistic photography.",
      defaultImages: [
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "bridal",
      icon: "👰",
      title: "Bridal Portraits",
      categoryKey: "Bridal",
      description:
        "Celebrate your elegance with stunning bridal portraits that highlight every detail—from your smile to your attire. Our goal is to create timeless portraits that you'll treasure forever.",
      defaultImages: [
        "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "celebrations",
      icon: "🎉",
      title: "Birthday & Family Celebrations",
      categoryKey: "Celebration",
      description:
        "From birthdays and anniversaries to family gatherings, we capture the laughter, joy, and unforgettable moments that make every celebration unique.",
      defaultImages: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "maternity",
      icon: "👶",
      title: "Maternity & Baby Photography",
      categoryKey: "Maternity",
      description:
        "Every new beginning deserves to be remembered. We create warm, emotional, and beautifully crafted maternity and baby portraits that preserve these precious milestones for generations.",
      defaultImages: [
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "videography",
      icon: "🎥",
      title: "Cinematic Videography",
      categoryKey: "Videography",
      description:
        "Transform your special moments into beautifully crafted films. Our cinematic videos capture every emotion, celebration, and unforgettable memory with stunning visuals and storytelling.",
      defaultImages: [
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10 space-y-16">
      {servicesData.map((service, index) => {
        const serviceCategoryPhotos = galleryItems
          .filter(
            (item) =>
              item.src &&
              String(item.category || item.title || "")
                .toLowerCase()
                .includes(service.categoryKey.toLowerCase())
          )
          .map((item) => String(item.src));

        const displayPhotos = serviceCategoryPhotos.length ? serviceCategoryPhotos.slice(0, 3) : service.defaultImages;

        return (
          <div
            key={service.id}
            className="rounded-2xl border border-white/15 bg-[#161614] p-6 md:p-10 space-y-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#c7a66b]/10 px-3 py-1 text-xs font-semibold text-[#c7a66b] mb-2">
                  <span>{service.icon}</span> Service 0{index + 1}
                </div>
                <h2 className="text-2xl font-bold sm:text-3xl text-white">{service.title}</h2>
                <p className="mt-2 text-sm text-white/70 max-w-3xl leading-relaxed">{service.description}</p>
              </div>

              <button
                onClick={() => handleBookService(service.title)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c7a66b] px-7 py-3 text-xs font-bold text-[#10100f] hover:bg-[#d8b77c] transition shadow-lg shrink-0"
              >
                <span>Book Now</span>
              </button>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#c7a66b] font-semibold mb-4">Sample Showcase Images</p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {displayPhotos.map((src, imgIdx) => (
                  <figure key={imgIdx} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#10100f]/50">
                    <Image
                      src={src}
                      alt={`${service.title} sample ${imgIdx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Embedded Booking Form */}
      <div id="service-booking-form" className="rounded-2xl border border-[#c7a66b]/30 bg-[#10100f] p-8 md:p-12 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="label text-[#c7a66b] text-xs uppercase tracking-widest">Book Your Session</p>
          <h2 className="text-3xl font-bold text-white uppercase">Reserve Your Event Date</h2>
          <p className="text-sm text-white/60">Fill out your details below and we will confirm availability promptly.</p>
        </div>
        <InquiryForm kind="bookings" initialSession={selectedSession} />
      </div>
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
        <section className="px-5 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28">
          <div className="mx-auto max-w-[1480px]">
            <p className="label text-[#c7a66b] text-xs uppercase tracking-widest">{page.eyebrow}</p>
            <h1 className="display mt-4 max-w-5xl text-4xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">{page.title}</h1>
            <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-white/60">{page.intro}</p>
          </div>
        </section>

        {/* Portfolio / gallery grid */}
        {isPortfolio && <GalleryGrid />}

        {/* Services page */}
        {slug === "services" && <DedicatedServicesPage />}

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

        {/* Contact section with studio info & inquiry form */}
        {isContact && (
          <section className="mx-auto max-w-[1050px] px-5 py-10 md:px-10">
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              {/* Studio contact details card */}
              <div className="md:col-span-5 rounded border border-white/15 bg-[#161614] p-6 space-y-6">
                <div>
                  <p className="label text-[#c7a66b] text-xs uppercase tracking-widest">Get In Touch</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Studio Details</h3>
                  <p className="mt-2 text-xs text-white/50 leading-relaxed">Reach out directly or send us an inquiry with your event details.</p>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/10 text-sm text-[#c7a66b]">
                  <a href="tel:+917997634562" className="flex items-center gap-3 transition hover:text-white group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                      <Phone size={16} />
                    </span>
                    <span className="font-medium tracking-wide break-all">+91 7997634562 (Call)</span>
                  </a>

                  <a href="https://wa.me/917997634562" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                      <MessageCircle size={16} />
                    </span>
                    <span className="font-medium tracking-wide break-all">+91 7997634562 (WhatsApp)</span>
                  </a>

                  <a href="mailto:satishphotography16@gmail.com" className="flex items-center gap-3 transition hover:text-white group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                      <Mail size={16} />
                    </span>
                    <span className="font-medium tracking-wide break-all">satishphotography16@gmail.com</span>
                  </a>

                  <a
                    href="https://www.instagram.com/satish_photography1_?igsh=NXhwYmFjcGgwdXNt"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 transition hover:text-white group"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                      <Instagram size={16} />
                    </span>
                    <span className="font-medium tracking-wide break-all">@mr_satish_ch__</span>
                  </a>
                </div>
              </div>

              {/* Inquiry form */}
              <div className="md:col-span-7">
                <InquiryForm kind="bookings" />
              </div>
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
