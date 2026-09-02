"use client";

import { Eye, ImagePlus, Plus, Trash2, PencilLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GalleryPickerModal } from "@/components/admin/gallery-picker-modal";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { Button } from "@/components/ui/button";
import { database } from "@/lib/firebase";
import { createRealtimeItem, removeRealtimeItem, updateRealtimeItem } from "@/services/realtime";
import { seedHomepageSections, subscribeToHomepageSections, updateHomepageSection } from "@/services/homepage";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";
import type { GalleryImage, HomepageSection } from "@/types/content";

type HeroContent = { eyebrow?: string; title?: string; subtitle?: string; primaryCta?: string; primaryHref?: string; images?: GalleryImage[] };
type GalleryContent = { eyebrow?: string; title?: string; images?: GalleryImage[] };
type AboutContent = { eyebrow?: string; title?: string; body?: string; stat?: string; statLabel?: string; image?: string };

type PricingDraft = { title: string; price: string; body: string; features: string; visible: boolean };
type TestimonialDraft = { author: string; role: string; body: string; visible: boolean };

export function HomepageBuilder() {
  const [items, setItems] = useState<HomepageSection[]>([]);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  const [pricingItems, setPricingItems] = useState<PublicEntry[]>([]);
  const [testimonialItems, setTestimonialItems] = useState<PublicEntry[]>([]);
  const [notice, setNotice] = useState("");
  const [pricingDraft, setPricingDraft] = useState<PricingDraft>({ title: "", price: "", body: "", features: "", visible: true });
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialDraft>({ author: "", role: "", body: "", visible: true });
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<{ sectionId: string; index?: number } | null>(null);

  useEffect(() => {
    const unsubscribeHomepage = subscribeToHomepageSections((next) => {
      setItems(next);
      setSectionsLoaded(true); // BUG-16 fixed: mark loaded after first callback fires
    });
    const unsubscribePricing = subscribeToPublicEntries("pricingPlans", setPricingItems, false);
    const unsubscribeTestimonials = subscribeToPublicEntries("testimonials", setTestimonialItems, false);
    return () => {
      unsubscribeHomepage();
      unsubscribePricing();
      unsubscribeTestimonials();
    };
  }, []);

  const heroSection = items.find((item) => item.type === "hero");
  const gallerySection = items.find((item) => item.type === "gallery");
  const servicesSection = items.find((item) => item.type === "services" || item.id === "services");
  const whySection = items.find((item) => item.type === "whyChooseUs" || item.id === "whyChooseUs");
  const aboutSection = items.find((item) => item.type === "about");
  const heroContent = (heroSection?.content as HeroContent | undefined) ?? {};
  const servicesContent = (servicesSection?.content as Record<string, string> | undefined) ?? {};
  const galleryContent = (gallerySection?.content as GalleryContent | undefined) ?? {};
  const aboutContent = (aboutSection?.content as AboutContent | undefined) ?? {};
  const whyContent = (whySection?.content as Record<string, string> | undefined) ?? {};
  const heroImages = heroContent.images ?? [];
  const galleryImages = galleryContent.images ?? [];

  async function handleServicesTextChange(field: string, value: string) {
    const id = servicesSection?.id ?? "services";
    const currentContent = (servicesSection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, [field]: value } });
    setNotice("Services section header content is live on the public page.");
  }

  async function seedHomepage() {
    if (!database) { setNotice("Realtime Database is not configured."); return; }
    try {
      await seedHomepageSections();
      setNotice("Initial homepage content has been saved to Realtime Database.");
    } catch {
      setNotice("Could not seed homepage content. Confirm this account has administrator access.");
    }
  }

  function getSectionImages(section: HomepageSection | undefined): GalleryImage[] {
    if (!section) return [];
    const images = (section.content as { images?: GalleryImage[] } | undefined)?.images;
    return Array.isArray(images) ? images : [];
  }

  async function handleHeroTextChange(field: keyof HeroContent, value: string) {
    const id = heroSection?.id ?? "hero";
    const currentContent = (heroSection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, [field]: value } });
    setNotice("Hero content is live on the public page.");
  }

  async function handleWhyTextChange(field: string, value: string) {
    const id = whySection?.id ?? "whyChooseUs";
    const currentContent = (whySection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, [field]: value } });
    setNotice("Why Choose Us content is live on the public page.");
  }

  async function handleGalleryTextChange(field: keyof GalleryContent, value: string) {
    const id = gallerySection?.id ?? "gallery";
    const currentContent = (gallerySection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, [field]: value } });
    setNotice("Gallery content is live on the public page.");
  }

  async function handleAboutTextChange(field: keyof AboutContent, value: string) {
    const id = aboutSection?.id ?? "about";
    const currentContent = (aboutSection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, [field]: value } });
    setNotice("About section content is live on the public page.");
  }

  async function handleAboutImageChange(url: string) {
    const id = aboutSection?.id ?? "about";
    const currentContent = (aboutSection?.content as Record<string, unknown> | undefined) ?? {};
    await updateHomepageSection(id, { content: { ...currentContent, image: url } });
    setNotice("About section image updated on the public page.");
  }

  async function handleImageUpload(sectionId: string, index: number, asset: { url: string }) {
    const section = items.find((item) => item.id === sectionId) ?? { id: sectionId, type: sectionId as HomepageSection["type"], order: items.length, visible: true, published: true, content: {} };
    const currentImages = getSectionImages(section);
    const nextImages = [...currentImages];
    const nextImage = nextImages[index] ?? { id: `${section.type}-${index + 1}`, alt: `${section.type} image ${index + 1}`, src: "" };
    nextImages[index] = { ...nextImage, src: asset.url };

    setItems((current) => {
      const exists = current.some((entry) => entry.id === sectionId);
      if (exists) {
        return current.map((entry) => (entry.id === sectionId ? { ...entry, content: { ...(entry.content as Record<string, unknown>), images: nextImages } } : entry));
      }
      return [...current, { ...section, content: { ...(section.content as Record<string, unknown>), images: nextImages } }];
    });

    await updateHomepageSection(sectionId, { content: { ...(section.content as Record<string, unknown>), images: nextImages } });
    setNotice(`${section.type} image slot updated on the public page.`);
  }

  async function handleAddImageSlot(sectionId: string) {
    const section = items.find((item) => item.id === sectionId);
    if (!section) return;
    const currentImages = getSectionImages(section);
    currentImages.push({ id: `${section.type}-${currentImages.length + 1}`, alt: `${section.type} image ${currentImages.length + 1}`, src: "" });
    await updateHomepageSection(sectionId, { content: { ...(section.content as Record<string, unknown>), images: currentImages } });
    setNotice(`${section.type} image slot added.`);
  }

  async function handleRemoveImageSlot(sectionId: string, index: number) {
    const section = items.find((item) => item.id === sectionId);
    if (!section) return;
    const currentImages = getSectionImages(section).filter((_, currentIndex) => currentIndex !== index);
    await updateHomepageSection(sectionId, { content: { ...(section.content as Record<string, unknown>), images: currentImages } });
    setNotice(`${section.type} image slot removed.`);
  }

  async function savePricingEntry() {
    const trimmedTitle = pricingDraft.title.trim();
    if (!trimmedTitle) return;
    const payload = {
      title: trimmedTitle,
      price: pricingDraft.price.trim(),
      body: pricingDraft.body.trim(),
      features: pricingDraft.features.split(",").map((entry) => entry.trim()).filter(Boolean),
      visible: pricingDraft.visible,
    };

    if (!database) { setNotice("Realtime Database is not configured."); return; }
    try {
      if (editingPricingId) await updateRealtimeItem("pricingPlans", editingPricingId, payload);
      else await createRealtimeItem("pricingPlans", payload);
    } catch { setNotice("Could not save pricing. Check Realtime Database rules."); return; }

    setPricingDraft({ title: "", price: "", body: "", features: "", visible: true });
    setEditingPricingId(null);
    setNotice("Pricing package saved to Realtime Database.");
  }

  async function saveTestimonialEntry() {
    const trimmedAuthor = testimonialDraft.author.trim();
    if (!trimmedAuthor) return;
    const payload = {
      author: trimmedAuthor,
      role: testimonialDraft.role.trim(),
      body: testimonialDraft.body.trim(),
      visible: testimonialDraft.visible,
    };

    if (!database) { setNotice("Realtime Database is not configured."); return; }
    try {
      if (editingTestimonialId) await updateRealtimeItem("testimonials", editingTestimonialId, payload);
      else await createRealtimeItem("testimonials", payload);
    } catch { setNotice("Could not save testimonial. Check Realtime Database rules."); return; }

    setTestimonialDraft({ author: "", role: "", body: "", visible: true });
    setEditingTestimonialId(null);
    setNotice("Testimonial saved to Realtime Database.");
  }

  async function removePricingItem(id: string) {
    try { await removeRealtimeItem("pricingPlans", id); setNotice("Pricing package removed."); } catch { setNotice("Could not remove pricing package."); }
  }

  async function removeTestimonialItem(id: string) {
    try { await removeRealtimeItem("testimonials", id); setNotice("Testimonial removed."); } catch { setNotice("Could not remove testimonial."); }
  }

  function startEditingPricing(item: PublicEntry) {
    setEditingPricingId(item.id);
    setPricingDraft({ title: String(item.title ?? ""), price: String(item.price ?? ""), body: String(item.body ?? ""), features: Array.isArray(item.features) ? item.features.join(", ") : "", visible: item.visible !== false });
  }

  function startEditingTestimonial(item: PublicEntry) {
    setEditingTestimonialId(item.id);
    setTestimonialDraft({ author: String(item.author ?? ""), role: String(item.role ?? ""), body: String(item.body ?? ""), visible: item.visible !== false });
  }

  return (
    <div className="p-5 pt-20 md:p-8 lg:pt-8">
      <header className="mb-8 border-b border-white/10 pb-5">
        <p className="label text-[#c7a66b]">Dynamic content studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Homepage control center</h1>
        <p className="mt-2 text-sm text-white/45">Upload images into the existing hero and gallery placeholders, and manage packages and testimonials from one live admin screen.</p>
        {!items.length && sectionsLoaded && <Button className="mt-4" onClick={seedHomepage}>Create initial homepage content</Button>}
      </header>

      {notice && <p className="mb-6 border border-[#c7a66b]/25 bg-[#c7a66b]/10 p-3 text-sm text-[#e6cf9f]">{notice}</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-6">
          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center gap-2">
              <ImagePlus size={16} className="text-[#c7a66b]" />
              <h2 className="text-lg font-semibold">Hero section</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input disabled={!sectionsLoaded} value={heroContent.eyebrow ?? ""} onChange={(event) => handleHeroTextChange("eyebrow", event.target.value)} placeholder="Eyebrow" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <input disabled={!sectionsLoaded} value={heroContent.title ?? ""} onChange={(event) => handleHeroTextChange("title", event.target.value)} placeholder="Title" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <textarea disabled={!sectionsLoaded} value={heroContent.subtitle ?? ""} onChange={(event) => handleHeroTextChange("subtitle", event.target.value)} placeholder="Subtitle" rows={3} className="resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40 md:col-span-2" />
              <input disabled={!sectionsLoaded} value={heroContent.primaryCta ?? ""} onChange={(event) => handleHeroTextChange("primaryCta", event.target.value)} placeholder="Primary button" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <input disabled={!sectionsLoaded} value={heroContent.primaryHref ?? ""} onChange={(event) => handleHeroTextChange("primaryHref", event.target.value)} placeholder="Primary link" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(heroImages.length ? heroImages : Array.from({ length: 3 }, (_, i) => ({ id: `hero-${i + 1}`, alt: `Hero image ${i + 1}`, src: "" }))).map((image, index) => {
                return (
                  <div key={`hero-${index}`} className="flex flex-col justify-between rounded border border-white/10 p-3 min-w-0">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-1">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Hero slot {index + 1}</p>
                        {heroImages.length > 1 && heroSection && (
                          <button
                            onClick={() => handleRemoveImageSlot(heroSection.id, index)}
                            className="text-[10px] text-white/40 hover:text-[#e7a29b]"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {image?.src ? (
                        <img src={image.src} alt={image.alt ?? `Hero image ${index + 1}`} className="mb-3 h-28 w-full object-cover rounded" />
                      ) : (
                        <div className="mb-3 flex h-28 items-center justify-center border border-dashed border-white/15 text-xs text-white/40">
                          No image yet
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-0">
                      <CloudinaryUpload folder="hero" label="Upload photo" onUploaded={(asset) => handleImageUpload("hero", index, asset)} />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full whitespace-normal leading-snug py-2 px-2 h-auto text-center text-[10px]"
                        onClick={() => setPickerTarget({ sectionId: "hero", index })}
                      >
                        Select existing
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {heroSection && (
              <button
                onClick={() => handleAddImageSlot(heroSection.id)}
                className="mt-3 w-full rounded border border-dashed border-white/10 px-3 py-2 text-xs text-[#c7a66b] hover:border-[#c7a66b]"
              >
                + Add another hero slide
              </button>
            )}
          </div>

          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center gap-2">
              <ImagePlus size={16} className="text-[#c7a66b]" />
              <h2 className="text-lg font-semibold">Why Choose Us section</h2>
            </div>
            <div className="mt-4 space-y-3">
              <input
                disabled={!sectionsLoaded}
                value={whyContent.badge ?? ""}
                onChange={(event) => handleWhyTextChange("badge", event.target.value)}
                placeholder="Badge (e.g. Trusted by Happy Couples)"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
              <input
                disabled={!sectionsLoaded}
                value={whyContent.title ?? ""}
                onChange={(event) => handleWhyTextChange("title", event.target.value)}
                placeholder="Title (e.g. WHY COUPLES CHOOSE US?)"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
              <textarea
                disabled={!sectionsLoaded}
                value={whyContent.body ?? ""}
                onChange={(event) => handleWhyTextChange("body", event.target.value)}
                placeholder="Description paragraph"
                rows={3}
                className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
            </div>
          </div>

          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center gap-2">
              <ImagePlus size={16} className="text-[#c7a66b]" />
              <h2 className="text-lg font-semibold">Services section header</h2>
            </div>
            <div className="mt-4 space-y-3">
              <input
                disabled={!sectionsLoaded}
                value={servicesContent.eyebrow ?? ""}
                onChange={(event) => handleServicesTextChange("eyebrow", event.target.value)}
                placeholder="Eyebrow (e.g. One studio, many kinds of story.)"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
              <input
                disabled={!sectionsLoaded}
                value={servicesContent.title ?? ""}
                onChange={(event) => handleServicesTextChange("title", event.target.value)}
                placeholder="Title (e.g. CAPTURING MOMENTS. CREATING MEMORIES.)"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
              <textarea
                disabled={!sectionsLoaded}
                value={servicesContent.body ?? ""}
                onChange={(event) => handleServicesTextChange("body", event.target.value)}
                placeholder="Description paragraph (e.g. Every celebration has a story worth telling...)"
                rows={3}
                className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40"
              />
            </div>
          </div>

          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center gap-2">
              <ImagePlus size={16} className="text-[#c7a66b]" />
              <h2 className="text-lg font-semibold">Gallery section</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input disabled={!sectionsLoaded} value={galleryContent.eyebrow ?? ""} onChange={(event) => handleGalleryTextChange("eyebrow", event.target.value)} placeholder="Eyebrow" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <input disabled={!sectionsLoaded} value={galleryContent.title ?? ""} onChange={(event) => handleGalleryTextChange("title", event.target.value)} placeholder="Title" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
            </div>
            <div className="mt-4 space-y-3">
              {galleryImages.map((image, index) => (
                <div key={`gallery-${index}`} className="rounded border border-white/10 p-3 min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">Gallery slot {index + 1}</p>
                    <button onClick={() => gallerySection && handleRemoveImageSlot(gallerySection.id, index)} className="text-xs text-white/40 hover:text-[#e7a29b]">Remove</button>
                  </div>
                  {image?.src ? <img src={image.src} alt={image.alt ?? `Gallery image ${index + 1}`} className="mb-3 h-28 w-full object-cover rounded" /> : <div className="mb-3 flex h-28 items-center justify-center border border-dashed border-white/15 text-sm text-white/40">No image yet</div>}
                  <div className="flex flex-wrap gap-2 min-w-0">
                    <CloudinaryUpload folder="gallery" label="Upload photo" onUploaded={(asset) => handleImageUpload("gallery", index, asset)} />
                    <Button variant="outline" size="sm" className="whitespace-normal leading-snug py-2 px-2.5 h-auto text-[10px]" onClick={() => setPickerTarget({ sectionId: "gallery", index })}>
                      Select existing
                    </Button>
                  </div>
                </div>
              ))}
              {gallerySection && <button onClick={() => handleAddImageSlot(gallerySection.id)} className="w-full rounded border border-dashed border-white/10 px-3 py-2 text-sm text-[#c7a66b]">Add gallery image slot</button>}
            </div>
          </div>

          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center gap-2">
              <ImagePlus size={16} className="text-[#c7a66b]" />
              <h2 className="text-lg font-semibold">About section</h2>
            </div>
            <div className="mt-4 space-y-3">
              <input disabled={!sectionsLoaded} value={aboutContent.eyebrow ?? ""} onChange={(event) => handleAboutTextChange("eyebrow", event.target.value)} placeholder="Eyebrow" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <input disabled={!sectionsLoaded} value={aboutContent.title ?? ""} onChange={(event) => handleAboutTextChange("title", event.target.value)} placeholder="Title" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <textarea disabled={!sectionsLoaded} value={aboutContent.body ?? ""} onChange={(event) => handleAboutTextChange("body", event.target.value)} placeholder="Body paragraph" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              <div className="grid gap-3 md:grid-cols-2">
                <input disabled={!sectionsLoaded} value={aboutContent.stat ?? ""} onChange={(event) => handleAboutTextChange("stat", event.target.value)} placeholder="Stat (e.g. 12 years)" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
                <input disabled={!sectionsLoaded} value={aboutContent.statLabel ?? ""} onChange={(event) => handleAboutTextChange("statLabel", event.target.value)} placeholder="Stat label (e.g. of human stories)" className="border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b] disabled:opacity-40" />
              </div>
              <div className="rounded border border-white/10 p-3 min-w-0">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/35">About section image</p>
                {aboutContent.image ? <img src={aboutContent.image} alt="About image" className="mb-3 h-36 w-full object-cover rounded" /> : <div className="mb-3 flex h-36 items-center justify-center border border-dashed border-white/15 text-sm text-white/40">No image selected</div>}
                <div className="flex flex-wrap gap-2 min-w-0">
                  <CloudinaryUpload folder="about" label="Upload photo" onUploaded={(asset) => handleAboutImageChange(asset.url)} />
                  <Button variant="outline" size="sm" className="whitespace-normal leading-snug py-2 px-2.5 h-auto text-[10px]" onClick={() => setPickerTarget({ sectionId: "about" })}>
                    Select existing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Packages</h2>
              <Link href="/pricing" target="_blank" className="flex items-center gap-1 text-sm text-[#c7a66b]">
                <Eye size={14} />Preview
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <input value={pricingDraft.title} onChange={(event) => setPricingDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Package name" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={pricingDraft.price} onChange={(event) => setPricingDraft((current) => ({ ...current, price: event.target.value }))} placeholder="Price" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <textarea value={pricingDraft.body} onChange={(event) => setPricingDraft((current) => ({ ...current, body: event.target.value }))} placeholder="Description" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={pricingDraft.features} onChange={(event) => setPricingDraft((current) => ({ ...current, features: event.target.value }))} placeholder="Features (comma separated)" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <label className="flex items-center gap-2 text-sm text-white/55">
                <input type="checkbox" checked={pricingDraft.visible} onChange={(event) => setPricingDraft((current) => ({ ...current, visible: event.target.checked }))} />
                Show on public site
              </label>
              <Button onClick={savePricingEntry} className="w-full justify-center">
                <Plus size={15} />{editingPricingId ? "Save package" : "Add package"}
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {pricingItems.length ? pricingItems.map((item) => (
                <article key={item.id} className="border border-white/10 bg-[#10100f] p-3 min-w-0">
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium break-words [overflow-wrap:anywhere]">{String(item.title ?? "Untitled")}</p>
                      <p className="mt-1 text-sm text-white/45 break-words [overflow-wrap:anywhere]">{String(item.price ?? "")}</p>
                    </div>
                    <div className="flex shrink-0">
                      <button onClick={() => startEditingPricing(item)} className="p-2 text-white/45 hover:text-[#c7a66b]" aria-label="Edit package"><PencilLine size={16} /></button>
                      <button onClick={() => removePricingItem(item.id)} className="p-2 text-white/45 hover:text-[#e7a29b]" aria-label="Delete package"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              )) : <p className="border border-dashed border-white/15 p-4 text-sm text-white/40">No packages yet.</p>}
            </div>
          </div>

          <div className="border border-white/10 bg-[#161614] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Testimonials</h2>
              <Link href="/testimonials" target="_blank" className="flex items-center gap-1 text-sm text-[#c7a66b]">
                <Eye size={14} />Preview
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              <input value={testimonialDraft.author} onChange={(event) => setTestimonialDraft((current) => ({ ...current, author: event.target.value }))} placeholder="Author" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={testimonialDraft.role} onChange={(event) => setTestimonialDraft((current) => ({ ...current, role: event.target.value }))} placeholder="Role or location" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <textarea value={testimonialDraft.body} onChange={(event) => setTestimonialDraft((current) => ({ ...current, body: event.target.value }))} placeholder="Testimonial" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <label className="flex items-center gap-2 text-sm text-white/55">
                <input type="checkbox" checked={testimonialDraft.visible} onChange={(event) => setTestimonialDraft((current) => ({ ...current, visible: event.target.checked }))} />
                Show on public site
              </label>
              <Button onClick={saveTestimonialEntry} className="w-full justify-center">
                <Plus size={15} />{editingTestimonialId ? "Save testimonial" : "Add testimonial"}
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {testimonialItems.length ? testimonialItems.map((item) => (
                <article key={item.id} className="border border-white/10 bg-[#10100f] p-3 min-w-0">
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium break-words [overflow-wrap:anywhere]">{String(item.author ?? "Anonymous")}</p>
                      <p className="mt-1 text-sm text-white/45 break-words [overflow-wrap:anywhere]">{String(item.body ?? "")}</p>
                    </div>
                    <div className="flex shrink-0">
                      <button onClick={() => startEditingTestimonial(item)} className="p-2 text-white/45 hover:text-[#c7a66b]" aria-label="Edit testimonial"><PencilLine size={16} /></button>
                      <button onClick={() => removeTestimonialItem(item.id)} className="p-2 text-white/45 hover:text-[#e7a29b]" aria-label="Delete testimonial"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </article>
              )) : <p className="border border-dashed border-white/15 p-4 text-sm text-white/40">No testimonials yet.</p>}
            </div>
          </div>
        </section>
      </div>

      <GalleryPickerModal
        isOpen={Boolean(pickerTarget)}
        onClose={() => setPickerTarget(null)}
        onSelect={(asset) => {
          if (!pickerTarget) return;
          if (pickerTarget.sectionId === "about") {
            handleAboutImageChange(asset.url);
          } else {
            handleImageUpload(pickerTarget.sectionId, pickerTarget.index ?? 0, { url: asset.url });
          }
        }}
      />
    </div>
  );
}
