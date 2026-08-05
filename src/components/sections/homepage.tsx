"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeToHomepageSections } from "@/services/homepage";
import type { GalleryImage, HomepageSection } from "@/types/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";

function content<T>(section: HomepageSection) { return section.content as T; }
function Eyebrow({ children }: { children: string }) { return <p className="label mb-5 text-[#c7a66b]">{children}</p>; }

function Hero({ section }: { section: HomepageSection }) {
  const data = content<{ eyebrow: string; title: string; subtitle: string; primaryCta: string; primaryHref: string; images: GalleryImage[] }>(section);
  const heroImages = (data.images ?? []).filter((img) => Boolean(img && img.src)).slice(0, 3);
  const primaryImage = heroImages[0];
  const secondaryImages = heroImages.slice(1, 3);
  // The public site only renders media stored in Firestore-backed content.

  return (
    <section className="relative min-h-screen overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-32">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
        <div className="z-10 max-w-2xl pb-0 lg:pb-10">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1 className="display max-w-[760px] text-5xl leading-[.96] tracking-[-.045em] text-[#f0eee9] sm:text-7xl md:text-8xl">{data.title}</h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-white/60">{data.subtitle}</p>
          <Button asChild className="mt-9">
            <a href={data.primaryHref}>{data.primaryCta}<ArrowDownRight size={16} /></a>
          </Button>
        </div>
        <div className="grid grid-cols-[1.25fr_.75fr] gap-3 self-stretch sm:gap-5">
          <figure className="relative min-h-[410px] overflow-hidden sm:min-h-[590px]">
            {primaryImage?.src ? (
              <>
                <Image
                  src={primaryImage.src}
                  alt={primaryImage.alt ?? "Hero image"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 70vw, 48vw"
                  className="object-cover grayscale-[12%]"
                />
                {primaryImage.title && (
                  <figcaption className="absolute bottom-4 left-4 label text-white/70">{primaryImage.title}</figcaption>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center border border-dashed border-white/15 bg-white/5 text-center text-sm text-white/60">
                Upload a hero image from the admin panel.
              </div>
            )}
          </figure>
          <div className="flex flex-col gap-3 sm:gap-5">
            {secondaryImages.length ? (
              secondaryImages.map((image) => (
                <figure key={image.id} className="relative min-h-[190px] flex-1 overflow-hidden">
                  <Image src={image.src} alt={image.alt ?? "Hero image"} fill sizes="25vw" className="object-cover" />
                </figure>
              ))
            ) : (
              <>
                <div className="flex min-h-[190px] flex-1 items-center justify-center border border-dashed border-white/15 bg-white/5 text-center text-sm text-white/60">Add another image</div>
                <div className="flex min-h-[190px] flex-1 items-center justify-center border border-dashed border-white/15 bg-white/5 text-center text-sm text-white/60">Add another image</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-7 flex max-w-[1480px] items-center justify-between border-t border-white/15 pt-4 label text-white/40">
        <span>Scroll to explore</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </section>
  );
}

function Gallery({ section }: { section: HomepageSection }) {
  const data = content<{ eyebrow: string; title: string; images: GalleryImage[] }>(section);
  const [liveGallery, setLiveGallery] = useState<PublicEntry[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublicEntries("gallery", (entries) => setLiveGallery(entries));
    return unsub;
  }, []);

  const sectionImages = (data.images ?? []).filter((img) => Boolean(img && img.src));
  const liveItems = liveGallery.map((item) => ({ id: item.id, src: String(item.src ?? ""), alt: String(item.alt ?? "Gallery image"), title: String(item.title ?? ""), category: String(item.category ?? "") }));

  const combinedImages: GalleryImage[] = [
    ...liveItems,
    ...sectionImages,
  ].filter((img) => Boolean(img.src)).slice(0, 9);

  return (
    <section className="bg-[#f0eee9] px-5 py-24 text-[#10100f] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h2 className="display text-5xl tracking-[-.04em] md:text-7xl">{data.title}</h2>
          </div>
          <Link href="/gallery" className="label inline-flex items-center gap-2 border-b border-[#10100f] pb-2">
            View all work <ArrowUpRight size={14} />
          </Link>
        </div>
        {combinedImages.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {combinedImages.map((image, index) => (
              <figure key={image.id} className={index === 1 ? "md:mt-20" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <figcaption className="mt-3 flex justify-between label text-[#10100f]/60">
                  <span>{image.title}</span>
                  <span>{image.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded border border-dashed border-[#10100f]/20 bg-white/60 p-8 text-center text-sm text-[#10100f]/70">
            Upload gallery images from the admin panel to populate this section.
          </div>
        )}
      </div>
    </section>
  );
}

function About({ section }: { section: HomepageSection }) {
  const d = content<{ eyebrow: string; title: string; body: string; stat: string; statLabel: string; image?: string }>(section);
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1480px] gap-12 border-y border-white/15 py-12 md:grid-cols-[1fr_1.3fr] items-center">
        <div>
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <div className="display text-6xl text-[#c7a66b]">{d.stat}</div>
          <div className="label mt-2 text-white/45">{d.statLabel}</div>
          {d.image && (
            <div className="relative mt-8 aspect-[4/3] w-full max-w-md overflow-hidden border border-white/10">
              <Image src={d.image} alt={d.title || "About Satish Photography"} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
          )}
        </div>
        <div>
          <h2 className="display max-w-xl text-5xl leading-none tracking-[-.04em] md:text-7xl">{d.title}</h2>
          <p className="mt-8 max-w-lg text-sm leading-8 text-white/60">{d.body}</p>
        </div>
      </div>
    </section>
  );
}

function Services({ section }: { section: HomepageSection }) {
  const d = content<{ eyebrow: string; title: string; items: string[] }>(section);
  return (
    <section className="px-5 py-16 md:px-10">
      <div className="mx-auto max-w-[1480px]">
        <Eyebrow>{d.eyebrow}</Eyebrow>
        <h2 className="display max-w-xl text-5xl tracking-[-.04em] md:text-7xl">{d.title}</h2>
        <div className="mt-12 divide-y divide-white/15 border-t border-white/15">
          {d.items.map((item) => (
            <a href="#booking" key={item} className="group flex items-center justify-between py-5 text-xl md:text-2xl">
              <span>{item}</span>
              <ArrowUpRight className="text-[#c7a66b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// BUG-11 fixed: Pricing now accepts section prop for future section-level config access.
// Visibility filtering is already handled in Homepage before rendering.
function Pricing({ section: _section }: { section: HomepageSection }) {
  const [plans, setPlans] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("pricingPlans", (items) => setPlans(items)), []);

  return (
    <section className="bg-[#e9e5dd] px-5 py-24 text-[#10100f] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1480px]">
        <Eyebrow>Collections</Eyebrow>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="display text-5xl tracking-[-.04em] md:text-7xl">Thoughtfully shaped<br />around your story.</h2>
          <Link href="/pricing" className="label border-b border-[#10100f] pb-2">Explore collections</Link>
        </div>
        {plans.length ? (
          <div className="mt-14 grid gap-px bg-black/15 md:grid-cols-3">
            {plans.map((plan) => (
              <article className="bg-[#e9e5dd] p-6 md:p-8" key={plan.id}>
                <p className="label text-[#8e7344]">{plan.price}</p>
                <h3 className="display mt-7 text-4xl">{plan.title}</h3>
                <p className="mt-4 min-h-12 text-sm leading-6 text-black/60">{plan.body}</p>
                <ul className="mt-7 space-y-2 text-sm">
                  {(plan.features ?? []).map((feature) => <li key={feature}>— {feature}</li>)}
                </ul>
                <Link href="/booking" className="label mt-10 inline-block border-b border-[#10100f] pb-2">Request proposal</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded border border-dashed border-[#10100f]/20 bg-white/60 p-8 text-center text-sm text-[#10100f]/70">
            Add a package from the admin panel to show it here.
          </div>
        )}
      </div>
    </section>
  );
}

// BUG-11 fixed: Testimonials now accepts section prop for future section-level config access.
function Testimonials({ section: _section }: { section: HomepageSection }) {
  const [quotes, setQuotes] = useState<PublicEntry[]>([]);
  useEffect(() => subscribeToPublicEntries("testimonials", (items) => setQuotes(items)), []);

  return (
    <section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1480px]">
        <Eyebrow>In their words</Eyebrow>
        <h2 className="display max-w-2xl text-5xl tracking-[-.04em] md:text-7xl">The feeling stays with them.</h2>
        {quotes.length ? (
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {quotes.map((quote) => (
              <blockquote className="border border-white/15 p-7 md:p-10" key={quote.id}>
                <p className="display text-3xl leading-tight md:text-4xl">"{quote.body}"</p>
                <footer className="label mt-10 text-[#c7a66b]">
                  {quote.author}{quote.role ? ` · ${quote.role}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-white/70">
            Add a testimonial from the admin panel to show it here.
          </div>
        )}
      </div>
    </section>
  );
}

function Booking({ section }: { section: HomepageSection }) {
  const d = content<{ eyebrow: string; title: string; body: string }>(section);
  return (
    <section id="booking" className="px-5 py-24 md:px-10">
      <div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-8 bg-[#c7a66b] p-7 text-[#10100f] md:flex-row md:items-end md:p-14">
        <div>
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 className="display max-w-2xl text-5xl leading-none tracking-[-.04em] md:text-7xl">{d.title}</h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#10100f]/70">{d.body}</p>
        </div>
        <Button asChild variant="outline" className="border-[#10100f] text-[#10100f] hover:bg-[#10100f] hover:text-white">
          <Link href="/booking">Check availability <ArrowUpRight size={16} /></Link>
        </Button>
      </div>
    </section>
  );
}

export function Homepage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  useEffect(() => subscribeToHomepageSections(setSections), []);

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20"><SiteHeader /></div>
      <main>
        {sections
          .filter((s) => s.visible && s.published)
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            if (section.type === "hero") return <Hero key={section.id} section={section} />;
            if (section.type === "gallery") return <Gallery key={section.id} section={section} />;
            if (section.type === "about") return <About key={section.id} section={section} />;
            if (section.type === "services") return <Services key={section.id} section={section} />;
            // BUG-11 fixed: pass section so components have access to section-level config
            if (section.type === "pricing") return <Pricing key={section.id} section={section} />;
            if (section.type === "testimonials") return <Testimonials key={section.id} section={section} />;
            if (section.type === "booking") return <Booking key={section.id} section={section} />;
            return null;
          })}
      </main>
      <SiteFooter />
    </>
  );
}
