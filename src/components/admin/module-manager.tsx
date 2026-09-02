"use client";

import { Calendar, Mail, MessageCircle, Pencil, Phone, Plus, Tag, Trash2, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { Button } from "@/components/ui/button";
import { database } from "@/lib/firebase";
import { createRealtimeItem, removeRealtimeItem, subscribeToCollection, updateRealtimeItem } from "@/services/realtime";
import { persistPublicEntries, readStoredPublicEntries } from "@/lib/content-sync";

const modules: Record<string, { collection: string; title: string; helper: string; readOnly?: boolean }> = {
  gallery: {
    collection: "gallery",
    title: "Gallery Manager",
    helper: "Upload and manage high-resolution photography work.",
  },
  services: {
    collection: "services",
    title: "Services & Offerings",
    helper: "Manage photography services offered to clients.",
  },
  pricing: {
    collection: "pricingPlans",
    title: "Pricing & Collections",
    helper: "Manage photography collections and pricing packages.",
  },
  testimonials: {
    collection: "testimonials",
    title: "Client Testimonials",
    helper: "Manage client reviews and testimonials.",
  },
  bookings: {
    collection: "bookings",
    title: "Booking Inquiries",
    helper: "New reservation requests submitted by website visitors.",
  },
  messages: {
    collection: "messages",
    title: "Contact Messages",
    helper: "Inquiries and notes sent through the website contact form.",
  },
  analytics: {
    collection: "analytics",
    title: "Analytics Overview",
    helper: "Track website engagement and visitor traffic.",
    readOnly: true,
  },
  settings: {
    collection: "websiteSettings",
    title: "Website Settings",
    helper: "Manage global website branding and studio contact details.",
  },
};

type Item = { id: string; [key: string]: unknown };

export function ModuleManager({ module }: { module: string; user: { email?: string | null } | User }) {
  const config = modules[module];
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [visible, setVisible] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("Wedding Photography");
  const [editingGallery, setEditingGallery] = useState<{ id: string; title: string; alt: string; category: string; hidden: boolean } | null>(null);
  const [notice, setNotice] = useState("");

  const isPricing = module === "pricing";
  const isTestimonials = module === "testimonials";
  const isGallery = module === "gallery";
  const isBookings = module === "bookings";
  const isMessages = module === "messages";

  useEffect(() => {
    if (!config) return;

    const loadLocal = (): Item[] => {
      if (config.collection === "pricingPlans" || config.collection === "testimonials" || config.collection === "gallery") {
        return readStoredPublicEntries(config.collection as "pricingPlans" | "testimonials" | "gallery", []).map((item) => ({ ...item, id: item.id }));
      }
      return [];
    };

    if (!database) {
      setItems(loadLocal());
      return;
    }

    return subscribeToCollection(
      config.collection,
      (entries) => {
        const local = loadLocal();
        const map = new Map<string, Item>();
        entries.forEach((e) => {
          const key = e.id || String(e.src ?? "");
          if (key) map.set(key, e);
        });
        local.forEach((l) => {
          const key = l.id || String(l.src ?? "");
          if (key && !map.has(key)) map.set(key, l);
        });
        const merged = Array.from(map.values()).sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0));
        setItems(merged);
      },
      (error) => setNotice(`Could not load items: ${error.message}. Check Realtime Database rules.`),
    );
  }, [config]);

  if (!config) return null;

  function resetForm() {
    setTitle(""); setBody(""); setPrice(""); setFeatures("");
    setAuthor(""); setRole(""); setVisible(true); setEditingId(null);
  }

  async function saveItem() {
    if (!title.trim() && !isPricing && !isTestimonials) {
      setNotice("A title is required before adding an item.");
      return;
    }

    if (isTestimonials && (!author.trim() || !body.trim())) {
      setNotice("Both client name and testimonial quote are required.");
      return;
    }

    const payload = isPricing
      ? { title: title.trim(), body: body.trim(), price: price.trim(), features: features.split(",").map((f) => f.trim()).filter(Boolean), visible }
      : isTestimonials
        ? { author: author.trim(), role: role.trim(), body: body.trim(), visible }
        : { title: title.trim(), body: body.trim(), visible };

    try {
      if (!database && (isPricing || isTestimonials)) {
        const collName = config.collection as "pricingPlans" | "testimonials";
        const stored = readStoredPublicEntries(collName, []);
        const nextItems = editingId
          ? stored.map((item) => (item.id === editingId ? { ...item, ...payload, id: item.id } : item))
          : [...stored, { id: `${collName}-${Date.now()}`, ...payload, order: stored.length, visible }];
        persistPublicEntries(collName, nextItems);
        setItems(nextItems.map((item) => ({ ...item, id: item.id })));
        setNotice("Saved locally — visible on the public page.");
      } else if (database) {
        if (editingId) {
          await updateRealtimeItem(config.collection, editingId, payload);
        } else {
          await createRealtimeItem(config.collection, payload);
        }
        setNotice("Saved successfully.");
      }
      resetForm();
    } catch {
      setNotice("Couldn't save. Confirm this account has admin database permissions.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;

    if (!database) {
      const handleLocalDelete = (collName: "pricingPlans" | "testimonials" | "gallery") => {
        const stored = readStoredPublicEntries(collName, []);
        const next = stored.filter((item) => item.id !== id);
        persistPublicEntries(collName, next);
        setItems(next.map((item) => ({ ...item, id: item.id })));
        setNotice("Item deleted locally.");
      };
      if (isGallery) handleLocalDelete("gallery");
      else if (isPricing) handleLocalDelete("pricingPlans");
      else if (isTestimonials) handleLocalDelete("testimonials");
      else {
        setItems((current) => current.filter((item) => item.id !== id));
        setNotice("Entry deleted.");
      }
      return;
    }

    try {
      await removeRealtimeItem(config.collection, id);
      setNotice("Item deleted.");
    } catch {
      setNotice("Couldn't delete this item.");
    }
  }

  function edit(item: Item) {
    setEditingId(item.id);
    setTitle(String(item.title ?? ""));
    setBody(String(item.body ?? ""));
    setPrice(String(item.price ?? ""));
    setFeatures(Array.isArray(item.features) ? item.features.join(", ") : "");
    setAuthor(String(item.author ?? ""));
    setRole(String(item.role ?? ""));
    setVisible(item.visible !== false);
  }

  async function saveGalleryItem() {
    if (!editingGallery) return;
    const { id, title, alt, category, hidden } = editingGallery;
    try {
      if (database) {
        await updateRealtimeItem("gallery", id, { title, alt, category, hidden });
      } else {
        const stored = readStoredPublicEntries("gallery", []);
        const next = stored.map((item) => item.id === id ? { ...item, title, alt, category, hidden } : item);
        persistPublicEntries("gallery", next);
        setItems(next.map((item) => ({ ...item, id: item.id })));
      }
      setEditingGallery(null);
      setNotice("Gallery item updated.");
    } catch {
      setNotice("Couldn't update gallery item.");
    }
  }

  async function uploaded(asset: { url: string; publicId: string; width: number; height: number }) {
    const payload = {
      src: asset.url,
      cloudinaryPublicId: asset.publicId,
      width: asset.width,
      height: asset.height,
      title: uploadCategory,
      alt: `${uploadCategory} photograph`,
      category: uploadCategory,
      hidden: false,
    };
    if (database) {
      try {
        const id = await createRealtimeItem("gallery", payload);
        const newItem = { id, ...payload };
        setItems((current) => [newItem, ...current.filter((i) => i.id !== id)]);
        setNotice(`Image uploaded to ${uploadCategory} gallery.`);
      } catch {
        setNotice("Image uploaded, but metadata could not be saved.");
      }
    } else {
      const stored = readStoredPublicEntries("gallery", []);
      const newItem = {
        id: `gallery-${Date.now()}`,
        ...payload,
        order: 0,
      };
      const nextItems = [newItem, ...stored.map((item, idx) => ({ ...item, order: idx + 1 }))];
      persistPublicEntries("gallery", nextItems);
      setItems(nextItems);
      setNotice(`Image uploaded and saved locally to ${uploadCategory} gallery.`);
    }
  }

  return (
    <div className="p-5 pt-20 md:p-8 lg:pt-8">
      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <div>
          <p className="label text-[#c7a66b]">Content Studio</p>
          <h1 className="mt-1 text-3xl font-semibold">{config.title}</h1>
          <p className="mt-1 text-sm text-white/50">{config.helper}</p>
        </div>
      </header>

      {notice && (
        <p className="mt-5 flex items-center justify-between border border-[#e7a29b]/30 bg-[#e7a29b]/10 p-3.5 text-sm text-[#e7a29b]">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="underline opacity-70 hover:opacity-100">Dismiss</button>
        </p>
      )}

      {/* Gallery upload */}
      {isGallery && (
        <section className="mt-6 border border-white/10 bg-[#161614] p-6 space-y-4">
          <div>
            <h2 className="text-base font-medium text-[#c7a66b]">Upload New Photo</h2>
            <p className="mt-1 text-xs text-white/50">Select a category/type for your photo and upload it to Cloudinary. It will appear in that category gallery immediately on the website.</p>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-medium text-white/60 mb-1">Select Photo Type / Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full border border-white/15 bg-[#10100f] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#c7a66b]"
            >
              <option value="Wedding Photography">💍 Wedding Photography</option>
              <option value="Pre-Wedding Photography">❤️ Pre-Wedding Photography</option>
              <option value="Engagement Photography">💑 Engagement Photography</option>
              <option value="Bridal Portraits">👰 Bridal Portraits</option>
              <option value="Birthday & Family Celebrations">🎉 Birthday & Family Celebrations</option>
              <option value="Maternity & Baby Photography">👶 Maternity & Baby Photography</option>
              <option value="Cinematic Videography">🎥 Cinematic Videography</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="mt-4">
            <CloudinaryUpload folder="gallery" onUploaded={uploaded} />
          </div>
        </section>
      )}

      {/* Gallery item edit panel */}
      {isGallery && editingGallery && (
        <section className="mt-4 max-w-xl border border-[#c7a66b]/30 bg-[#161614] p-5">
          <p className="label text-[#c7a66b]">Edit Gallery Image Details</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Photo Title / Caption</label>
              <input
                value={editingGallery.title}
                onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                placeholder="e.g., Royal Wedding Ceremony in Udaipur"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Photo Type / Category</label>
              <select
                value={editingGallery.category}
                onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                className="w-full border border-white/15 bg-[#10100f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c7a66b]"
              >
                <option value="Wedding Photography">💍 Wedding Photography</option>
                <option value="Pre-Wedding Photography">❤️ Pre-Wedding Photography</option>
                <option value="Engagement Photography">💑 Engagement Photography</option>
                <option value="Bridal Portraits">👰 Bridal Portraits</option>
                <option value="Birthday & Family Celebrations">🎉 Birthday & Family Celebrations</option>
                <option value="Maternity & Baby Photography">👶 Maternity & Baby Photography</option>
                <option value="Cinematic Videography">🎥 Cinematic Videography</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Alt Text (Accessibility Description)</label>
              <input
                value={editingGallery.alt}
                onChange={(e) => setEditingGallery({ ...editingGallery, alt: e.target.value })}
                placeholder="Describe the photo (e.g., Sunset wedding ceremony in Jaipur)"
                className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={editingGallery.hidden}
                onChange={(e) => setEditingGallery({ ...editingGallery, hidden: e.target.checked })}
              />
              Hide from public website gallery
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={saveGalleryItem}><Plus size={15} />Save Changes</Button>
            <Button onClick={() => setEditingGallery(null)} variant="outline">Cancel</Button>
          </div>
        </section>
      )}

      {/* Structured Form for Services, Pricing, Testimonials */}
      {!config.readOnly && !isGallery && (
        <section className="mt-6 max-w-2xl border border-white/10 bg-[#161614] p-6">
          <h2 className="label text-[#c7a66b]">{editingId ? "Edit Item" : "Add New Entry"}</h2>
          <p className="mt-1 text-xs text-white/40">Data entered here updates your live website in real time.</p>
          
          {isPricing ? (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Package Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Signature Wedding Collection" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Price / Investment</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₹1,50,000 or Starting from ₹75,000" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Short Description</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe what is included in this package..." rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Key Features (Comma separated)</label>
                <input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Full day coverage, High-res gallery, Fine art album" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                Publish on website
              </label>
            </div>
          ) : isTestimonials ? (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Client Name / Author</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Priya & Rahul" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Role / Event / Location</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Wedding at Udaipur" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Testimonial Quote</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter the client's review..." rows={4} className="w-full resize-none border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                Publish on website
              </label>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Service Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Pre-wedding Stories)" className="w-full border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Service Details</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Short summary of this service..." rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              </div>
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <Button onClick={saveItem}><Plus size={15} />{editingId ? "Save Changes" : "Add Entry"}</Button>
            {editingId && (
              <Button onClick={resetForm} variant="outline">Cancel</Button>
            )}
          </div>
        </section>
      )}

      {/* Clean Structured Data List View */}
      <section className="mt-8 max-w-4xl space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
          {isBookings ? "Received Booking Inquiries" : isMessages ? "Received Contact Messages" : isGallery ? "Uploaded Gallery Images" : "Current Entries"} ({items.length})
        </h2>

        {items.length ? (
          items.map((item) => (
            <article className="border border-white/10 bg-[#161614] p-5 shadow-sm transition hover:border-white/20 min-w-0" key={item.id}>
              {isBookings || isMessages ? (
                /* Structured Booking / Contact Card */
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 min-w-0">
                    <div className="flex items-center gap-2 text-base font-semibold text-[#c7a66b] min-w-0 break-words [overflow-wrap:anywhere]">
                      <UserIcon size={16} className="shrink-0" />
                      <span className="break-words [overflow-wrap:anywhere]">{String(item.name || item.author || "Website Visitor")}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/40 shrink-0 mr-1">
                        <Calendar size={13} />
                        {item.createdAt ? new Date(Number(item.createdAt)).toLocaleString() : "Recently received"}
                      </div>

                      {/* Direct CTA Action Buttons */}
                      {Boolean(item.phone) && (
                        <a
                          href={`tel:${item.phone}`}
                          title="Call Client Directly"
                          className="flex items-center gap-1 rounded border border-[#c7a66b]/30 bg-[#c7a66b]/10 px-2.5 py-1 text-xs font-medium text-[#c7a66b] hover:bg-[#c7a66b] hover:text-[#10100f] transition"
                        >
                          <Phone size={13} />
                          <span>Call</span>
                        </a>
                      )}

                      {Boolean(item.phone) && (
                        <a
                          href={`https://wa.me/91${String(item.phone).replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Chat on WhatsApp"
                          className="flex items-center gap-1 rounded border border-[#25D366]/30 bg-[#25D366]/10 px-2.5 py-1 text-xs font-medium text-[#25D366] hover:bg-[#25D366] hover:text-white transition"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {/* Direct Delete Button */}
                      <button
                        onClick={() => remove(item.id)}
                        title={isBookings ? "Delete Booking Inquiry" : "Delete Message"}
                        aria-label="Delete entry"
                        className="flex items-center gap-1 rounded border border-[#e7a29b]/30 bg-[#e7a29b]/10 px-2.5 py-1 text-xs font-medium text-[#e7a29b] hover:bg-[#e7a29b] hover:text-white transition"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 text-sm text-white/80 min-w-0">
                    {Boolean(item.email) && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail size={14} className="text-[#c7a66b] shrink-0" />
                        <a href={`mailto:${item.email}`} className="hover:underline break-all [overflow-wrap:anywhere]">{String(item.email)}</a>
                      </div>
                    )}
                    {Boolean(item.phone) && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone size={14} className="text-[#c7a66b] shrink-0" />
                        <a href={`tel:${item.phone}`} className="hover:underline break-all [overflow-wrap:anywhere]">{String(item.phone)}</a>
                      </div>
                    )}
                    {Boolean(item.date) && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar size={14} className="text-[#c7a66b] shrink-0" />
                        <span className="break-words [overflow-wrap:anywhere]">Event Date: <strong>{String(item.date)}</strong></span>
                      </div>
                    )}
                    {Boolean(item.eventType) && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Tag size={14} className="text-[#c7a66b] shrink-0" />
                        <span className="break-words [overflow-wrap:anywhere]">Session Type: <strong>{String(item.eventType)}</strong></span>
                      </div>
                    )}
                  </div>

                  {Boolean(item.message || item.body) && (
                    <div className="mt-2 rounded bg-white/5 p-3 text-sm text-white/70 min-w-0">
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Message Details:</p>
                      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{String(item.message || item.body)}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Content Item (Gallery, Pricing, Services, Testimonials) */
                <div className="flex items-start gap-4 min-w-0">
                  {typeof item.src === "string" && (
                    <img src={item.src} alt={typeof item.alt === "string" ? item.alt : ""} className="h-20 w-20 rounded object-cover border border-white/10 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-white break-words [overflow-wrap:anywhere]">
                      {String(item.title || item.author || (item.src ? "Gallery Image" : "Untitled"))}
                    </p>
                    {isPricing ? (
                      <div className="mt-1 text-sm break-words [overflow-wrap:anywhere]">
                        <span className="font-semibold text-[#c7a66b]">{String(item.price ?? "")}</span>
                        {item.body ? <span className="text-white/60"> — {String(item.body)}</span> : null}
                      </div>
                    ) : isTestimonials ? (
                      <p className="mt-1 text-sm text-white/60 break-words [overflow-wrap:anywhere]">
                        "{String(item.body)}"{item.role ? <span className="text-[#c7a66b]"> — {String(item.role)}</span> : null}
                      </p>
                    ) : isGallery ? (
                      <div className="mt-1 space-y-0.5 text-xs text-white/50">
                        <p><span className="text-[#c7a66b] font-medium">Type:</span> {String(item.category || "General")}</p>
                        <p>Alt: {String(item.alt || "No description")} {item.hidden ? " • [Hidden]" : " • [Published]"}</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-white/60 break-words [overflow-wrap:anywhere]">{String(item.body || "")}</p>
                    )}
                  </div>
                  {!config.readOnly && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() =>
                          isGallery
                            ? setEditingGallery({
                                id: item.id,
                                title: String(item.title ?? ""),
                                alt: String(item.alt ?? ""),
                                category: String(item.category ?? "Wedding Photography"),
                                hidden: Boolean(item.hidden),
                              })
                            : edit(item)
                        }
                        aria-label="Edit item"
                        className="p-2 text-white/40 hover:text-[#c7a66b]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => remove(item.id)} aria-label="Delete item" className="p-2 text-white/40 hover:text-[#e7a29b]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="border border-dashed border-white/15 p-8 text-center text-sm text-white/40">No entries recorded yet.</p>
        )}
      </section>
    </div>
  );
}
