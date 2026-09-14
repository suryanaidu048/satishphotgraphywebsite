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
import { defaultSiteSettings, subscribeToSiteSettings, type SiteSettings } from "@/services/site-settings";
import { ServiceCatalogueCarousel, type CatalogueItem } from "@/components/service-catalogue-carousel";

// Fallback page metadata (used when Firebase hasn't loaded yet)
const defaultPages: Record<string, { eyebrow: string; title: string; intro: string }> = {
  portfolio: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
  gallery: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", intro: "From big celebrations to the little moments in between, explore our latest work." },
  services: { eyebrow: "The Studio", title: "CAPTURING MOMENTS. CREATING MEMORIES.", intro: "Every celebration has a story worth telling. We specialize in capturing genuine emotions, timeless moments, and beautiful connections through creative photography and cinematic storytelling." },
  pricing: { eyebrow: "PERSONALIZED PACKAGES", title: "Thoughtfully shaped around your story.", intro: "Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable." },
  about: { eyebrow: "Behind The Lens", title: "Real moments, artfully held.", intro: "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye." },
  testimonials: { eyebrow: "In Their Words", title: "The feeling stays with them.", intro: "Kind words from people who trusted us with their most cherished days." },
  awards: { eyebrow: "Recognition", title: "Work made with care, seen with generosity.", intro: "A few acknowledgements that keep us curious and grateful." },
  faq: { eyebrow: "Helpful Answers", title: "The details, made simple.", intro: "If you don't see your question here, we'll be glad to talk it through." },
  contact: { eyebrow: "Get In Touch", title: "Start a conversation", intro: "Your story deserves to be beautifully remembered. Reach out to us about your plans, your ideas, or simply to say hello." },
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

import { WireframePlaceholder } from "@/components/ui/wireframe-placeholder";

function GalleryGrid() {
  const [items, setItems] = useState<PublicEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => setItems(entries));
    return unsub;
  }, []);

  const galleryItems = items
    .map((x) => ({
      id: x.id,
      src: String(x.src ?? ""),
      title: String(x.title || x.category || "Selected work"),
      category: String(x.category || "Wedding Photography"),
    }))
    .filter((x) => Boolean(x.src) && !x.src.includes("unsplash.com"));

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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3]">
                <WireframePlaceholder
                  aspectRatio="4/3"
                  label={`Gallery Slot ${i + 1}`}
                  sublabel="Upload photo in Admin Panel"
                />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-dashed border-[#c7a66b]/30 bg-[#161614] p-8 text-center text-sm text-white/60">
            Awaiting Cloudinary uploads for <span className="text-[#c7a66b] font-semibold">&ldquo;{activeCategory}&rdquo;</span>. Upload images in the Admin Gallery to replace these wireframe placeholders with your photos.
          </div>
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

// Default service entries used when Firebase has no services data yet
const defaultServicesData = [
  { id: "wedding", icon: "💍", title: "Wedding Photography", categoryKey: "Wedding", description: "Your wedding is one of life's most cherished milestones. We capture every smile, every emotion, and every unforgettable moment with a blend of creativity, elegance, and attention to detail, ensuring your memories remain timeless.", defaultImages: [] },
  { id: "pre-wedding", icon: "❤️", title: "Pre-Wedding Photography", categoryKey: "Pre-Wedding", description: "Celebrate your journey before the big day with creative and personalized pre-wedding sessions. Whether it's a romantic outdoor location or a meaningful place that reflects your story, we create photographs that beautifully showcase your bond.", defaultImages: [] },
  { id: "engagement", icon: "💑", title: "Engagement Photography", categoryKey: "Engagement", description: "Every proposal and engagement marks the beginning of a beautiful journey. We capture the excitement, love, and happiness of this special chapter with natural, heartfelt, and artistic photography.", defaultImages: [] },
  { id: "bridal", icon: "👰", title: "Bridal Portraits", categoryKey: "Bridal", description: "Celebrate your elegance with stunning bridal portraits that highlight every detail—from your smile to your attire. Our goal is to create timeless portraits that you'll treasure forever.", defaultImages: [] },
  { id: "celebrations", icon: "🎉", title: "Birthday & Family Celebrations", categoryKey: "Celebration", description: "From birthdays and anniversaries to family gatherings, we capture the laughter, joy, and unforgettable moments that make every celebration unique.", defaultImages: [] },
  { id: "maternity", icon: "👶", title: "Maternity & Baby Photography", categoryKey: "Maternity", description: "Every new beginning deserves to be remembered. We create warm, emotional, and beautifully crafted maternity and baby portraits that preserve these precious milestones for generations.", defaultImages: [] },
  { id: "videography", icon: "🎥", title: "Cinematic Videography", categoryKey: "Videography", description: "Transform your special moments into beautifully crafted films. Our cinematic videos capture every emotion, celebration, and unforgettable memory with stunning visuals and storytelling.", defaultImages: [] },
];

function DedicatedServicesPage() {
  // Subscribe to Firebase services collection — same source as homepage services section
  const [firebaseServices, setFirebaseServices] = useState<PublicEntry[]>([]);
  const [galleryItems, setGalleryItems] = useState<PublicEntry[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");

  useEffect(() => {
    const unsubServices = subscribeToPublicEntries("services", setFirebaseServices);
    const unsubGallery = subscribeToPublicEntries("gallery", setGalleryItems);
    return () => { unsubServices(); unsubGallery(); };
  }, []);

  // Build the display list: prefer Firebase entries, fall back to hardcoded defaults
  const servicesData = firebaseServices.length
    ? firebaseServices.map((s) => ({
        id: s.id,
        icon: String(s.icon || "📸"),
        title: String(s.title || "Photography Service"),
        categoryKey: String(s.sessionType || s.title || ""),
        description: String(s.body || s.description || ""),
        defaultImages: s.src && !String(s.src).includes("unsplash.com") ? [String(s.src)] : [],
      }))
    : defaultServicesData;

  const handleBookService = (sessionType: string) => {
    setSelectedSession(sessionType);
    const bookingFormEl = document.getElementById("service-booking-form");
    if (bookingFormEl) bookingFormEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1480px] px-5 py-10 md:px-10 space-y-16">
      {servicesData.map((service, index) => {
        // Show gallery photos & videos matching this service's category, fall back to service's own image
        const categoryMedia = galleryItems
          .filter((item) => item.src && !String(item.src).includes("unsplash.com") && String(item.category || item.title || "").toLowerCase().includes(service.categoryKey.toLowerCase()))
          .map((item) => ({
            id: item.id,
            src: String(item.src),
            title: String(item.title || service.title),
            mediaType: String(item.mediaType || (String(item.src).match(/\.(mp4|webm|mov)($|\?)/i) ? "video" : "image")),
          }));

        const catalogueItems: CatalogueItem[] =
          categoryMedia.length > 0
            ? categoryMedia
            : service.defaultImages.map((src, i) => ({
                src,
                title: `${service.title} Sample ${i + 1}`,
                mediaType: "image",
              }));

        return (
          <div key={service.id} className="rounded-2xl border border-white/15 bg-[#161614] p-6 md:p-10 space-y-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#c7a66b]/10 px-3 py-1 text-xs font-semibold text-[#c7a66b] mb-2">
                  <span>{service.icon}</span> Service {String(index + 1).padStart(2, "0")}
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
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-[#c7a66b] font-semibold">Service Showcase Catalogue</p>
                {catalogueItems.length > 0 && (
                  <span className="text-xs text-white/50">{catalogueItems.length} media items available</span>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-12 items-center">
                <div className="md:col-span-7">
                  <ServiceCatalogueCarousel items={catalogueItems} title={service.title} />
                </div>
                <div className="md:col-span-5 grid grid-cols-2 gap-3">
                  {catalogueItems.slice(0, 4).map((m, idx) => (
                    <figure key={idx} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#10100f]/50 border border-white/10">
                      {m.mediaType === "video" ? (
                        <div className="h-full w-full bg-black flex items-center justify-center">
                          <video src={m.src} className="h-full w-full object-cover" muted playsInline />
                          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[8px] text-[#c7a66b] font-bold uppercase">Film</span>
                        </div>
                      ) : (
                        <Image src={m.src} alt={`${service.title} sample ${idx + 1}`} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-300 hover:scale-105" />
                      )}
                    </figure>
                  ))}
                </div>
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
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  useEffect(() => subscribeToSiteSettings(setSettings), []);

  const fallback = defaultPages[slug];
  if (!fallback) return null;

  // Prefer live Firebase pageContent, fall back to hardcoded defaults
  const livePageContent = settings.pageContent?.[slug];
  const page = {
    eyebrow: livePageContent?.eyebrow || fallback.eyebrow,
    title: livePageContent?.title || fallback.title,
    intro: livePageContent?.intro || fallback.intro,
    body: livePageContent?.body,
  };

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

        {/* Services page — reads from Firebase services collection */}
        {slug === "services" && <DedicatedServicesPage />}

        {/* About page body — reads from settings.pageContent.about.body */}
        {slug === "about" && page.body && (
          <section className="mx-auto max-w-[900px] px-5 pb-16 md:px-10">
            <p className="text-sm sm:text-base leading-8 text-white/65 whitespace-pre-line">{page.body}</p>
          </section>
        )}

        {/* Awards page body — reads from settings.pageContent.awards.body */}
        {slug === "awards" && (
          <section className="mx-auto max-w-[900px] px-5 pb-16 md:px-10">
            {page.body
              ? <p className="text-sm sm:text-base leading-8 text-white/65 whitespace-pre-line">{page.body}</p>
              : <p className="text-sm text-white/35 border border-dashed border-white/15 rounded-xl p-10 text-center">No awards content yet. Add body copy under Awards in Admin → Website Settings.</p>
            }
          </section>
        )}

        {/* Dynamic pricing from Realtime Database */}
        {isPricing && <DynamicPricingSection />}

        {/* Dynamic testimonials from Realtime Database */}
        {slug === "testimonials" && <DynamicTestimonialsSection />}

        {/* FAQ */}
        {isFaq && (
          <section className="mx-auto max-w-[900px] px-5 py-10 md:px-10">
            {(settings.faq ?? defaultSiteSettings.faq).map(({ question, answer }) => (
              <details className="group border-t border-white/15 py-6" key={question}>
                <summary className="cursor-pointer list-none text-lg">{question}<span className="float-right text-[#c7a66b]">+</span></summary>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">{answer}</p>
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
                  {settings.phone && (
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-3 transition hover:text-white group">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                        <Phone size={16} />
                      </span>
                      <span className="font-medium tracking-wide break-all">{settings.phone} (Call)</span>
                    </a>
                  )}

                  {settings.whatsappNumber && (
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white group">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                        <MessageCircle size={16} />
                      </span>
                      <span className="font-medium tracking-wide break-all">{settings.phone} (WhatsApp)</span>
                    </a>
                  )}

                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 transition hover:text-white group">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                        <Mail size={16} />
                      </span>
                      <span className="font-medium tracking-wide break-all">{settings.email}</span>
                    </a>
                  )}

                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 transition hover:text-white group"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] group-hover:border-[#c7a66b] shrink-0">
                        <Instagram size={16} />
                      </span>
                      <span className="font-medium tracking-wide break-all">Instagram</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Inquiry form */}
              <div className="md:col-span-7">
                <InquiryForm kind="messages" />
              </div>
            </div>
          </section>
        )}

        {/* Legal pages */}
        {["privacy-policy", "terms"].includes(slug) && (
          <section className="mx-auto max-w-3xl px-5 py-10 text-sm leading-8 text-white/60 md:px-10">
            <p>{page.body || "By using this website or submitting an inquiry, you agree that the studio may process the information you provide to arrange and deliver the requested services. Specific project terms are supplied before booking."}</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
