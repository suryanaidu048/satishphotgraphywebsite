"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Star, Camera, Film, Play, Volume2, VolumeX, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultTestimonials, defaultPricingPlans } from "@/lib/demo-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";
import { subscribeToHomepageSections } from "@/services/homepage";
import type { HomepageSection } from "@/types/content";
import { InquiryForm } from "@/components/inquiry-form";
import { WireframePlaceholder } from "@/components/ui/wireframe-placeholder";
import { ServiceCatalogueCarousel, type CatalogueItem } from "@/components/service-catalogue-carousel";
import { MediaLightbox } from "@/components/media-lightbox";
import { defaultSiteSettings, subscribeToSiteSettings } from "@/services/site-settings";

// Detailed Default Services List matching requirements document
const detailedServices = [
  {
    id: "wedding",
    icon: "💍",
    title: "Wedding Photography",
    subtitle: "",
    description:
      "Your wedding is one of life's most cherished milestones. We capture every smile, every emotion, and every unforgettable moment with a blend of creativity, elegance, and attention to detail, ensuring your memories remain timeless.",
    buttonText: "Explore Wedding Stories →",
    link: "/gallery?category=Wedding",
    sessionType: "Wedding Photography",
    image: "",
  },
  {
    id: "pre-wedding",
    icon: "❤️",
    title: "Pre-Wedding Photography",
    subtitle: "",
    description:
      "Celebrate your journey before the big day with creative and personalized pre-wedding sessions. Whether it's a romantic outdoor location or a meaningful place that reflects your story, we create photographs that beautifully showcase your bond.",
    buttonText: "View Pre-Wedding Gallery →",
    link: "/gallery?category=Pre-Wedding",
    sessionType: "Pre-Wedding Photography",
    image: "",
  },
  {
    id: "engagement",
    icon: "💑",
    title: "Engagement Photography",
    subtitle: "",
    description:
      "Every proposal and engagement marks the beginning of a beautiful journey. We capture the excitement, love, and happiness of this special chapter with natural, heartfelt, and artistic photography.",
    buttonText: "Discover Engagement Shoots →",
    link: "/gallery?category=Engagement",
    sessionType: "Engagement Photography",
    image: "",
  },
  {
    id: "bridal",
    icon: "👰",
    title: "Bride & Groom Portraits",
    subtitle: "",
    description:
      "Celebrate your elegance with stunning bride & groom portraits that highlight every detail—from your smile to your attire. Our goal is to create timeless portraits that you'll treasure forever.",
    buttonText: "View Bride & Groom Gallery →",
    link: "/gallery?category=Bride%20%26%20Groom",
    sessionType: "Bride & Groom Portraits",
    image: "",
  },
  {
    id: "celebrity",
    icon: "🌟",
    title: "Celebrity Photography",
    subtitle: "",
    description:
      "High-profile red carpet, celebrity portraiture, press events, and VIP celebrations captured with supreme discretion, editorial lighting, and publication-ready perfection.",
    buttonText: "Explore Celebrity Gallery →",
    link: "/gallery?category=Celebrity",
    sessionType: "Celebrity Photography",
    image: "",
  },
  {
    id: "celebrations",
    icon: "🎉",
    title: "Birthday & Family Celebrations",
    subtitle: "",
    description:
      "From birthdays and anniversaries to family gatherings, we capture the laughter, joy, and unforgettable moments that make every celebration unique.",
    buttonText: "Explore Celebrations →",
    link: "/gallery?category=Celebration",
    sessionType: "Birthday & Family Celebrations",
    image: "",
  },
  {
    id: "maternity",
    icon: "👶",
    title: "Maternity & Baby Photography",
    subtitle: "",
    description:
      "Every new beginning deserves to be remembered. We create warm, emotional, and beautifully crafted maternity and baby portraits that preserve these precious milestones for generations.",
    buttonText: "View Baby & Maternity Gallery →",
    link: "/gallery?category=Maternity",
    sessionType: "Maternity & Baby Photography",
    image: "",
  },
  {
    id: "videography",
    icon: "🎥",
    title: "Cinematic Videography",
    subtitle: "",
    description:
      "Transform your special moments into beautifully crafted films. Our cinematic videos capture every emotion, celebration, and unforgettable memory with stunning visuals and storytelling.",
    buttonText: "Watch Our Films →",
    link: "/gallery?category=Videography",
    sessionType: "Cinematic Videography",
    image: "",
  },
];

function safeServiceLink(value: string, fallback: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function Hero({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "Satish Photography · India");
  const title = String(content.title || "Turning Moments Into Timeless Memories");
  const subtitle = String(content.subtitle || "Wedding, portrait and celebration stories observed with an unhurried eye.");
  const primaryCta = String(content.primaryCta || "Book Your Wedding Shoot");
  const primaryHref = String(content.primaryHref || "#pricing");

  const rawImages = (content.images as Array<{ src?: string; alt?: string }> | undefined) ?? [];
  const validImages = rawImages
    .filter((img) => Boolean(img?.src) && !String(img?.src).includes("unsplash.com"))
    .map((img) => ({ src: String(img.src), title }));
  const slides = validImages;

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
      {/* Background Slideshow or Ambient Editorial Framing Backdrop */}
      <div className="absolute inset-0 z-0">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
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
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#141412] via-[#10100f] to-[#10100f]">
            {/* Elegant camera wireframe ambient backdrop */}
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-[#c7a66b]" />
              <div className="absolute inset-x-0 bottom-1/4 border-b border-dashed border-[#c7a66b]" />
              <div className="absolute inset-y-0 left-1/4 border-r border-dashed border-[#c7a66b]" />
              <div className="absolute inset-y-0 right-1/4 border-r border-dashed border-[#c7a66b]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-64 w-64 rounded-full border border-[#c7a66b]/30" />
                <div className="absolute inset-8 rounded-full border border-[#c7a66b]/20" />
              </div>
            </div>
          </div>
        )}
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

function GalleryCarouselCard({
  item,
  onClick,
}: {
  item: { id: string; src: string; title: string; category: string; mediaType?: string };
  onClick?: () => void;
}) {
  const isVideo = item.mediaType === "video" || Boolean(String(item.src).match(/\.(mp4|webm|mov)($|\?)/i));
  return (
    <div
      onClick={onClick}
      className="group relative h-64 w-80 sm:h-72 sm:w-96 md:h-80 md:w-[420px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#161614] shadow-xl cursor-pointer transition duration-300 hover:border-[#c7a66b]/60"
    >
      {isVideo ? (
        <div className="relative h-full w-full bg-black flex items-center justify-center">
          <video src={item.src} className="h-full w-full object-cover" muted loop autoPlay playsInline />
          <div className="absolute top-3 right-3 rounded bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase text-[#c7a66b] border border-white/10">
            Cinematic Film
          </div>
        </div>
      ) : (
        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 80vw, 420px"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end">
        <span className="text-[11px] uppercase tracking-widest text-[#c7a66b] font-semibold">{item.category}</span>
        <h4 className="text-sm font-semibold text-white mt-1 truncate">{item.title}</h4>
      </div>
    </div>
  );
}

function CinematicTeaserReel({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "CINEMATIC TREASURES & FILMS");
  const title = String(content.title || "MOTION, EMOTION & TIMELESS FILMS");
  const subtitle = String(
    content.subtitle ||
      "Watch our automatic cinematic reels capturing the heart of wedding vows, emotional tears, and electric celebrations."
  );

  const [galleryVideos, setGalleryVideos] = useState<PublicEntry[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => {
      const vids = entries.filter((e) =>
        e.mediaType === "video" || Boolean(String(e.src).match(/\.(mp4|webm|mov)($|\?)/i))
      );
      setGalleryVideos(vids);
    });
    return unsub;
  }, []);

  const videoList = galleryVideos.length > 0
    ? galleryVideos
    : [
        {
          id: "default-teaser",
          title: "Cinematic Wedding Story",
          src: "https://assets.mixkit.co/videos/preview/mixkit-romantic-wedding-couple-walking-in-a-forest-41126-large.mp4",
          category: "Cinematic Film",
        },
      ];

  const currentVideo = videoList[activeVideoIdx] || videoList[0];

  return (
    <section id="teaser-videos" className="relative overflow-hidden bg-[#0c0c0b] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 px-3.5 py-1 text-xs font-semibold text-[#c7a66b] mb-3">
              <Film size={14} />
              <span>{eyebrow}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white leading-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/60 max-w-2xl">
              {subtitle}
            </p>
          </div>
          <Link
            href="/gallery?category=Videography"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white hover:border-[#c7a66b] hover:text-[#c7a66b] transition shrink-0"
          >
            <span>View All Films</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Video Player Display Container */}
        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto overflow-hidden rounded-3xl border border-white/20 bg-[#121210] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <video
            key={currentVideo.src}
            src={currentVideo.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Editorial Overlay Gradients */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

          {/* Top Bar with Badge */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="rounded-md bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#c7a66b] border border-white/10">
              {String(currentVideo.category || "Treasure Film")}
            </span>
          </div>

          {/* Video Controls Toggle */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-[#c7a66b] hover:text-[#10100f] transition"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Bottom Title & Book CTA */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#c7a66b]">Cinematic Reel</p>
              <h3 className="text-lg sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
                {String(currentVideo.title || "Cinematic Wedding Story")}
              </h3>
            </div>
            <Link
              href="#booking"
              className="rounded-full bg-[#c7a66b] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#10100f] hover:bg-[#d8b77c] transition shadow-lg shrink-0 text-center"
            >
              Book Cinematic Teaser
            </Link>
          </div>
        </div>

        {/* Video Selector Thumbnails if more than 1 video */}
        {videoList.length > 1 && (
          <div className="mt-6 flex justify-center gap-3 overflow-x-auto py-2">
            {videoList.map((vid, idx) => (
              <button
                key={vid.id || idx}
                onClick={() => setActiveVideoIdx(idx)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  idx === activeVideoIdx
                    ? "bg-[#c7a66b] text-[#10100f] shadow-md"
                    : "border border-white/20 bg-white/5 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                <Play size={12} className={idx === activeVideoIdx ? "fill-[#10100f]" : "fill-white/70"} />
                <span>{String(vid.title || `Reel ${idx + 1}`)}</span>
              </button>
            ))}
          </div>
        )}
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
  const [galleryEntries, setGalleryEntries] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsubServices = subscribeToPublicEntries("services", setCustomServices);
    const unsubGallery = subscribeToPublicEntries("gallery", setGalleryEntries);
    return () => {
      unsubServices();
      unsubGallery();
    };
  }, []);

  const servicesList = customServices.length
    ? customServices.map((s) => ({
        id: s.id,
        icon: String(s.icon || "📸"),
        title: String(s.title || "Photography Service"),
        subtitle: String(s.subtitle || ""),
        description: String(s.body || s.description || ""),
        buttonText: String(s.buttonText || `Explore ${String(s.title)} →`),
        link: safeServiceLink(String(s.link || ""), `/gallery?category=${encodeURIComponent(String(s.title))}`),
        sessionType: String(s.sessionType || s.title),
        image: String(s.src || s.image || ""),
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

        {/* Stacked Services Cards with Individual Image/Video Catalogue Carousel */}
        <div className="space-y-12">
          {servicesList.map((service, index) => {
            const serviceKey = (service.sessionType || service.title || "").toLowerCase();
            const matchingPhotos = galleryEntries
              .filter((g) => {
                const cat = String(g.category || "").toLowerCase();
                const itemTitle = String(g.title || "").toLowerCase();
                return (
                  (cat.includes(serviceKey) || serviceKey.includes(cat) || itemTitle.includes(serviceKey)) &&
                  Boolean(g.src) &&
                  !String(g.src).includes("unsplash.com")
                );
              })
              .map((g) => ({
                id: g.id,
                src: String(g.src),
                title: String(g.title || service.title),
                mediaType: String(g.mediaType || (String(g.src).match(/\.(mp4|webm|mov)($|\?)/i) ? "video" : "image")),
              }));

            const catalogueItems: CatalogueItem[] =
              matchingPhotos.length > 0
                ? matchingPhotos
                : service.image && !service.image.includes("unsplash.com")
                ? [{ src: service.image, title: service.title, mediaType: "image" }]
                : [];

            return (
              <div
                key={service.id}
                className={`grid gap-8 rounded-2xl border border-white/10 bg-[#10100f] p-6 md:p-10 lg:grid-cols-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Individual Service Catalogue Carousel */}
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl lg:col-span-6 ${
                    index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {catalogueItems.length > 0 ? (
                    <ServiceCatalogueCarousel items={catalogueItems} title={service.title} />
                  ) : (
                    <WireframePlaceholder
                      aspectRatio="4/3"
                      label={service.title}
                      sublabel="Upload photos/videos in Admin Gallery"
                    />
                  )}
                </div>

                {/* Text & Actions Side */}
                <div className={`space-y-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="inline-flex items-center justify-center rounded-full bg-[#c7a66b]/10 px-3.5 py-1 text-xs font-semibold text-[#c7a66b]">
                    <span className="mr-1.5">{service.icon}</span> Service {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold sm:text-3xl text-white">{service.title}</h3>
                  {service.subtitle && <p className="text-sm font-medium text-[#c7a66b]">{service.subtitle}</p>}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Gallery({ section }: { section?: HomepageSection }) {
  const content = (section?.content as Record<string, unknown> | undefined) ?? {};
  const eyebrow = String(content.eyebrow || "PORTFOLIO ARCHIVE");
  const title = String(content.title || "The moments we loved capturing.");
  const subtitle = String(content.subtitle || "From big celebrations to the little moments in between, explore our latest work.");

  const [items, setItems] = useState<PublicEntry[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => subscribeToPublicEntries("gallery", setItems), []);

  const galleryItems = items.length
    ? items
        .map((x) => ({
          id: x.id,
          src: String(x.src ?? ""),
          title: String(x.title || x.category || "Selected work"),
          category: String(x.category || "Wedding Photography"),
          mediaType: String(x.mediaType || (String(x.src).match(/\.(mp4|webm|mov)($|\?)/i) ? "video" : "image")),
        }))
        .filter((x) => Boolean(x.src) && !x.src.includes("unsplash.com"))
    : [];

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Prepare tracks for continuous infinite marquee carousel
  const trackItems = galleryItems.slice(0, 14);
  const forwardTrack = trackItems.length > 0 ? [...trackItems, ...trackItems] : [];
  const reverseTrack = trackItems.length > 0 ? [...trackItems].reverse().concat([...trackItems].reverse()) : [];

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#10100f] py-20 text-white md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label mb-2 text-[#c7a66b] text-xs uppercase tracking-widest">{eyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">{title}</h2>
            <p className="mt-2 text-sm text-white/60 max-w-xl">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white hover:border-[#c7a66b] hover:text-[#c7a66b] transition shrink-0"
            >
              <span>Explore All Work</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {galleryItems.length > 0 ? (
        <div className="relative w-full overflow-hidden">
          {/* Edge Gradient Fading Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-36 bg-gradient-to-r from-[#10100f] via-[#10100f]/85 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-36 bg-gradient-to-l from-[#10100f] via-[#10100f]/85 to-transparent" />

          {/* Top Marquee Carousel Track (Forward) */}
          <div aria-label="Selected photography carousel" className="gallery-marquee overflow-hidden py-3">
            <div className="gallery-marquee-track">
              <div className="gallery-marquee-group">
                {forwardTrack.map((item, idx) => (
                  <GalleryCarouselCard
                    item={item}
                    key={`fwd-${item.id}-${idx}`}
                    onClick={() => openLightboxAt(idx % galleryItems.length)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Marquee Carousel Track (Reverse) */}
          {trackItems.length > 2 && (
            <div aria-label="More selected photography carousel" className="gallery-marquee overflow-hidden py-3 mt-3">
              <div className="gallery-marquee-track gallery-marquee-track-reverse">
                <div className="gallery-marquee-group">
                  {reverseTrack.map((item, idx) => (
                    <GalleryCarouselCard
                      item={item}
                      key={`rev-${item.id}-${idx}`}
                      onClick={() => {
                        const originalIdx = galleryItems.findIndex((g) => g.id === item.id);
                        openLightboxAt(originalIdx >= 0 ? originalIdx : 0);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3]">
                <WireframePlaceholder
                  aspectRatio="4/3"
                  label={`Gallery Slot ${i + 1}`}
                  sublabel="Upload photos/videos in Admin Gallery"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Media Lightbox Modal */}
      <MediaLightbox
        isOpen={lightboxOpen}
        items={galleryItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % galleryItems.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}
      />
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

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {displayPlans.map((plan, index) => {
            const isHighlight = Boolean(plan.highlight) || plan.title?.toLowerCase() === "premium" || index === 1;
            const planTitle = String(plan.title ?? "Package");
            const planPrice = String(plan.price ?? "");
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-8 transition-all duration-300 ${
                  isHighlight
                    ? "border-2 border-[#c7a66b] bg-gradient-to-b from-[#1c1a16] to-[#121210] shadow-[0_0_40px_rgba(199,166,107,0.3)] scale-105 z-10"
                    : "border border-white/10 bg-[#10100f]/70 hover:border-white/20"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d8b77c] to-[#c7a66b] px-4 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#10100f] shadow-lg">
                    Most Popular & Recommended
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">{planTitle}</h3>
                  <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#c7a66b]">{planPrice}</div>

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
                    className={`block w-full text-center rounded-full py-3.5 text-xs font-bold uppercase tracking-wider transition ${
                      isHighlight
                        ? "bg-[#c7a66b] text-[#10100f] hover:bg-[#d8b77c] shadow-lg"
                        : "border border-white/20 bg-white/5 text-white hover:border-[#c7a66b] hover:text-[#c7a66b]"
                    }`}
                  >
                    Book This Package
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
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3.5">
                {(item.avatar || item.src || item.image) ? (
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#c7a66b]/50 shadow-md shrink-0">
                    <Image
                      src={String(item.avatar || item.src || item.image)}
                      alt={String(item.author || "Client")}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c7a66b]/20 border border-[#c7a66b]/40 text-[#c7a66b] font-bold text-sm shrink-0">
                    {String(item.author || "C").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{item.author}</p>
                  <p className="text-xs text-[#c7a66b] mt-0.5">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const unsub = subscribeToSiteSettings(setSettings);
    return unsub;
  }, []);

  const faqs = settings.faq && settings.faq.length > 0 ? settings.faq : defaultSiteSettings.faq;

  return (
    <section id="faq" className="bg-[#161614] px-5 py-20 text-white md:px-10 md:py-28 border-t border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 px-3.5 py-1 text-xs font-semibold text-[#c7a66b] mb-3">
            <HelpCircle size={14} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl uppercase text-white">
            Helpful Answers & Details
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Everything you need to know about our booking process, photography style, travel, and deliverable timelines.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#10100f] transition duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] text-lg font-bold shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-6 pb-6 pt-3 text-sm leading-relaxed text-white/70 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-white/50">
            Have a different question?{" "}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#c7a66b] font-semibold underline underline-offset-4 hover:text-[#e5cf9e]"
            >
              Chat directly with Satish on WhatsApp →
            </a>
          </p>
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
  const rawImage = String(content.image || "");
  const hasImage = Boolean(rawImage && !rawImage.includes("unsplash.com"));

  return (
    <section id="about" className="bg-[#161614] px-5 py-16 text-white md:px-10 md:py-24 border-t border-white/10">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12 items-center">
        {/* Portrait Image Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <figure className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl border border-white/15 shadow-2xl">
            {hasImage ? (
              <Image
                src={rawImage}
                alt="Satish Photography Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            ) : (
              <WireframePlaceholder
                aspectRatio="3/4"
                label="Studio Portrait"
                sublabel="Upload portrait in Admin"
              />
            )}
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
        <CinematicTeaserReel section={getSection("cinematicFilms")} />
        <Services section={getSection("services")} onBookService={handleBookService} />
        <Gallery section={getSection("gallery")} />
        <Pricing section={getSection("pricing")} />
        <Testimonials section={getSection("testimonials")} />
        <FaqSection />
        <BookingSection section={getSection("booking")} selectedSession={selectedSession} />
        <About section={getSection("about")} />
      </main>
      <SiteFooter />
    </>
  );
}
