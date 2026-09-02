"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultTestimonials, defaultPricingPlans } from "@/lib/demo-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";
import { subscribeToHomepageSections } from "@/services/homepage";
import type { HomepageSection } from "@/types/content";
import { InquiryForm } from "@/components/inquiry-form";

// Hero Slideshow Fallback Images
const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
    title: "Timeless Indian Celebrations",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80",
    title: "Unscripted Emotional Moments",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80",
    title: "Editorial Wedding Storytelling",
  },
];

// Detailed Default Services List matching requirements document
const detailedServices = [
  {
    id: "wedding",
    icon: "💍",
    title: "Wedding Photography",
    subtitle: "Your wedding is one of life's most cherished milestones.",
    description:
      "We capture every smile, every emotion, and every unforgettable moment with a blend of creativity, elegance, and attention to detail, ensuring your memories remain timeless.",
    buttonText: "Explore Wedding Stories →",
    link: "/gallery?category=Wedding",
    sessionType: "Wedding Photography",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "pre-wedding",
    icon: "❤️",
    title: "Pre-Wedding Photography",
    subtitle: "Celebrate your journey before the big day.",
    description:
      "Celebrate your journey before the big day with creative and personalized pre-wedding sessions. Whether it's a romantic outdoor location or a meaningful place that reflects your story, we create photographs that beautifully showcase your bond.",
    buttonText: "View Pre-Wedding Gallery →",
    link: "/gallery?category=Pre-Wedding",
    sessionType: "Pre-Wedding Photography",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "engagement",
    icon: "💑",
    title: "Engagement Photography",
    subtitle: "Every proposal and engagement marks the beginning of a beautiful journey.",
    description:
      "Every proposal and engagement marks the beginning of a beautiful journey. We capture the excitement, love, and happiness of this special chapter with natural, heartfelt, and artistic photography.",
    buttonText: "Discover Engagement Shoots →",
    link: "/gallery?category=Engagement",
    sessionType: "Engagement Photography",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bridal",
    icon: "👰",
    title: "Bridal Portraits",
    subtitle: "Celebrate your elegance with stunning bridal portraits.",
    description:
      "Celebrate your elegance with stunning bridal portraits that highlight every detail—from your smile to your attire. Our goal is to create timeless portraits that you'll treasure forever.",
    buttonText: "View Bridal Gallery →",
    link: "/gallery?category=Bridal",
    sessionType: "Bridal Portraits",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "celebrations",
    icon: "🎉",
    title: "Birthday & Family Celebrations",
    subtitle: "From birthdays and anniversaries to family gatherings.",
    description:
      "From birthdays and anniversaries to family gatherings, we capture the laughter, joy, and unforgettable moments that make every celebration unique.",
    buttonText: "Explore Celebrations →",
    link: "/gallery?category=Celebration",
    sessionType: "Birthday & Family Celebrations",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "maternity",
    icon: "👶",
    title: "Maternity & Baby Photography",
    subtitle: "Every new beginning deserves to be remembered.",
    description:
      "Every new beginning deserves to be remembered. We create warm, emotional, and beautifully crafted maternity and baby portraits that preserve these precious milestones for generations.",
    buttonText: "View Baby & Maternity Gallery →",
    link: "/gallery?category=Maternity",
    sessionType: "Maternity & Baby Photography",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "videography",
    icon: "🎥",
    title: "Cinematic Videography",
    subtitle: "Relive your special day through film.",
    description:
      "Relive your special day through high-definition cinematic films. We capture authentic sound, motion, and grand emotion in high frame rates and color grades.",
    buttonText: "Watch Cinematic Films →",
    link: "/gallery?category=Videography",
    sessionType: "Cinematic Videography",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
  },
];

function Hero({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "Satish Photography · India");
  const title = String(content.title || "Turning Moments Into Timeless Memories");
  const subtitle = String(content.subtitle || "Wedding, portrait and celebration stories observed with an unhurried eye.");
  const primaryCta = String(content.primaryCta || "Explore Our Work");
  const primaryHref = String(content.primaryHref || "#why-choose-us");

  const rawImages = (content.images as Array<{ src?: string; alt?: string }> | undefined) ?? [];
  const validImages = rawImages.filter((img) => Boolean(img?.src)).map((img) => ({ src: String(img.src), title }));
  const slides = validImages.length ? validImages : heroSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <header className="relative min-h-[90vh] w-full overflow-hidden bg-[#10100f] text-white flex items-center justify-center pt-24 pb-16">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms" }}
          >
            <Image
              src={slide.src}
              alt={slide.title || title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center brightness-[0.40] contrast-[1.05]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10100f] via-[#10100f]/40 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <p className="label mb-4 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-tight">
          {title}
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className="rounded-full bg-[#c7a66b] px-8 py-3.5 text-sm font-semibold text-[#10100f] hover:bg-[#d8b77c] transition duration-200 shadow-lg"
          >
            {primaryCta}
          </Link>
          <Link
            href="#booking"
            className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 hover:border-white transition duration-200"
          >
            Book A Session
          </Link>
        </div>

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-[#c7a66b]" : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function WhyChooseUs({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const badge = String(content.badge || "Trusted by Happy Couples");
  const title = String(content.title || "WHY COUPLES CHOOSE US?");
  const body = String(
    content.body ||
      "Every wedding is a once-in-a-lifetime celebration, and we believe every emotion deserves to be captured with care. From the joyful smiles to the heartfelt moments, we create timeless photographs that tell your unique love story with creativity, passion, and attention to every detail."
  );
  const ctaText = String(content.ctaText || "Explore Our Work →");
  const ctaHref = String(content.ctaHref || "/gallery");

  return (
    <section id="why-choose-us" className="bg-[#10100f] px-5 py-16 text-white md:px-10 md:py-24 border-t border-white/10">
      <div className="mx-auto max-w-4xl text-center">
        {/* Rating Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c7a66b]/30 bg-[#c7a66b]/10 px-4 py-1.5 text-xs font-semibold text-[#c7a66b]">
          <div className="flex text-amber-400">
            <Star size={14} className="fill-amber-400" />
            <Star size={14} className="fill-amber-400" />
            <Star size={14} className="fill-amber-400" />
            <Star size={14} className="fill-amber-400" />
            <Star size={14} className="fill-amber-400" />
          </div>
          <span>{badge}</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">
          {title}
        </h2>

        {/* Descriptive Body */}
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/70 max-w-3xl mx-auto font-light">
          {body}
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c7a66b] hover:text-[#e6cf9f] transition"
          >
            <span>{ctaText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services({
  section,
  onBookService,
}: {
  section?: HomepageSection;
  onBookService: (sessionType: string) => void;
}) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "Our Studio Services");
  const title = String(content.title || "CAPTURING MOMENTS. CREATING MEMORIES.");
  const body = String(
    content.body ||
      "Every celebration has a story worth telling. We specialize in capturing genuine emotions, timeless moments, and beautiful connections through creative photography and cinematic storytelling."
  );

  const [customServices, setCustomServices] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("services", (entries) => setCustomServices(entries));
    return unsub;
  }, []);

  const servicesList = customServices.length
    ? customServices.map((s) => ({
        id: s.id,
        icon: "📸",
        title: String(s.title || "Photography Service"),
        subtitle: String(s.subtitle || s.body || ""),
        description: String(s.body || s.description || ""),
        buttonText: `Explore ${String(s.title)} →`,
        link: `/gallery?category=${encodeURIComponent(String(s.title))}`,
        sessionType: String(s.title),
        image: String(s.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"),
      }))
    : detailedServices;

  return (
    <section id="services" className="bg-[#161614] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 max-w-3xl">
          <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base text-white/70">{body}</p>
        </div>

        {/* Stacked Services Cards */}
        <div className="space-y-12">
          {servicesList.map((service, index) => (
            <div
              key={service.id}
              className={`grid gap-8 rounded-2xl border border-white/10 bg-[#10100f] p-6 md:p-10 lg:grid-cols-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image side */}
              <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>

              {/* Text & Actions Side */}
              <div className={`space-y-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="inline-flex items-center justify-center rounded-full bg-[#c7a66b]/10 px-3.5 py-1 text-xs font-semibold text-[#c7a66b]">
                  <span className="mr-1.5">{service.icon}</span> Service {index + 1}
                </div>
                <h3 className="text-2xl font-bold sm:text-3xl text-white">{service.title}</h3>
                <p className="text-sm font-medium text-[#c7a66b]">{service.subtitle}</p>
                <p className="text-sm text-white/70 leading-relaxed font-light">{service.description}</p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white hover:border-[#c7a66b] hover:text-[#c7a66b] transition"
                  >
                    <span>{service.buttonText}</span>
                  </Link>

                  <button
                    onClick={() => onBookService(service.sessionType)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c7a66b] px-6 py-2.5 text-xs font-semibold text-[#10100f] hover:bg-[#d8b77c] transition shadow-md"
                  >
                    <span>Book {service.title}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "OUR STORIES");
  const title = String(content.title || "The moments we loved capturing.");
  const subtitle = String(content.subtitle || "From big celebrations to the little moments in between, explore our latest work.");

  const [items, setItems] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("gallery", setItems), []);

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
      ];

  return (
    <section id="gallery" className="bg-[#10100f] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/60 max-w-xl">{subtitle}</p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold text-white hover:border-[#c7a66b] hover:text-[#c7a66b] transition shrink-0"
          >
            <span>View Full Gallery</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {galleryItems.slice(0, 6).map((item, i) => (
            <figure key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#161614] group">
              <Image src={item.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-xs font-medium text-white flex items-end justify-between">
                <span className="font-semibold">{item.title}</span>
                <span className="text-[10px] text-[#c7a66b] uppercase tracking-wider">{item.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const title = String(content.title || "PERSONALIZED PACKAGES");
  const subtitle = String(
    content.subtitle ||
      "Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable."
  );

  const [plans, setPlans] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("pricingPlans", setPlans), []);

  const displayPlans = plans.length ? plans : defaultPricingPlans;

  return (
    <section id="pricing" className="bg-[#161614] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">Investment</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">{title}</h2>
          <p className="mt-3 text-sm text-white/60">{subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {displayPlans.map((plan) => {
            const isHighlight = Boolean(plan.highlight);
            const planTitle = String(plan.title ?? "Package");
            const planPrice = String(plan.price ?? "");
            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-2xl border p-8 transition duration-300 ${
                  isHighlight
                    ? "border-[#c7a66b] bg-[#10100f] shadow-2xl relative scale-105"
                    : "border-white/10 bg-[#10100f]/60 hover:border-white/20"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#c7a66b] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#10100f]">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{planTitle}</h3>
                  <div className="mt-4 text-3xl font-extrabold text-[#c7a66b]">{planPrice}</div>

                  <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {Array.isArray(plan.features) &&
                      plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-white/80">
                          <Check size={14} className="text-[#c7a66b] shrink-0" />
                          <span>{String(feature)}</span>
                        </div>
                      ))}
                  </div>
                </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="#booking"
                  className={`block w-full text-center rounded-full py-3 text-xs font-bold uppercase tracking-wider transition ${
                    isHighlight
                      ? "bg-[#c7a66b] text-[#10100f] hover:bg-[#d8b77c]"
                      : "border border-white/20 bg-white/5 text-white hover:border-[#c7a66b] hover:text-[#c7a66b]"
                  }`}
                >
                  Book Package
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "In Their Words");
  const title = String(content.title || "The feeling stays with them.");

  const [testimonials, setTestimonials] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("testimonials", setTestimonials), []);

  const displayTestimonials = testimonials.length ? testimonials : defaultTestimonials;

  return (
    <section id="testimonials" className="bg-[#10100f] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 text-center">
          <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">{title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayTestimonials.map((item) => (
            <div key={item.id} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161614] p-8">
              <div className="space-y-4">
                <div className="flex text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
                <p className="text-sm text-white/80 leading-relaxed font-light">"{item.body}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm font-bold text-white">{item.author}</p>
                <p className="text-xs text-[#c7a66b] mt-0.5">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection({ section, selectedSession }: { section?: HomepageSection; selectedSession?: string }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "Get In Touch");
  const title = String(content.title || "Start a conversation");
  const subtitle = String(content.subtitle || "Your story deserves to be beautifully remembered.");
  const body = String(content.body || "Reach out to us about your plans, your ideas, or simply to say hello. We’re always happy to connect.");

  return (
    <section id="booking" className="bg-[#10100f] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">
            {title}
          </h2>
          <p className="mt-3 text-base text-[#c7a66b] font-medium">
            {subtitle}
          </p>
          <p className="mt-2 text-sm text-white/60 max-w-xl mx-auto">
            {body}
          </p>
        </div>

        <InquiryForm kind="bookings" initialSession={selectedSession} />
      </div>
    </section>
  );
}

function About({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "Behind The Lens");
  const title = String(content.title || "Real moments, artfully held.");
  const body = String(
    content.body ||
      "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye."
  );
  const stat = String(content.stat || "12+ Years");
  const statLabel = String(content.statLabel || "of human stories");
  const image = String(content.image || "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80");

  return (
    <section id="about" className="bg-[#161614] px-5 py-16 text-white md:px-10 md:py-24 border-t border-white/10">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12 items-center">
        {/* Portrait Image Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <figure className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl border border-white/15 shadow-2xl">
            <Image
              src={image}
              alt="Satish Photography Studio"
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="object-cover"
            />
          </figure>
        </div>

        {/* Text Content */}
        <div className="space-y-6 lg:col-span-7">
          <p className="label text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/70 font-normal">
            {body}
          </p>
          <div className="pt-4 border-t border-white/10 flex items-center gap-6">
            <div>
              <div className="text-4xl font-bold text-[#c7a66b]">{stat}</div>
              <div className="text-xs uppercase tracking-wider text-white/50 mt-1">{statLabel}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#c7a66b]">500+</div>
              <div className="text-xs uppercase tracking-wider text-white/50 mt-1">celebrations documented</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Homepage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");

  useEffect(() => {
    const unsub = subscribeToHomepageSections((data) => {
      if (data && data.length) {
        setSections(data);
      }
    });
    return unsub;
  }, []);

  const getSection = (type: string) => sections.find((s) => s.type === type || s.id === type);

  const handleBookService = (sessionType: string) => {
    setSelectedSession(sessionType);
    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20"><SiteHeader /></div>
      <main>
        <Hero section={getSection("hero")} />
        <WhyChooseUs section={getSection("whyChooseUs")} />
        <Services section={getSection("services")} onBookService={handleBookService} />
        <Gallery section={getSection("gallery")} />
        <Pricing section={getSection("pricing")} />
        <Testimonials section={getSection("testimonials")} />
        <BookingSection section={getSection("booking")} selectedSession={selectedSession} />
        <About section={getSection("about")} />
      </main>
      <SiteFooter />
    </>
  );
}
