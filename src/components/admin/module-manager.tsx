"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { Button } from "@/components/ui/button";
import { database } from "@/lib/firebase";
import { createRealtimeItem, removeRealtimeItem, subscribeToCollection, updateRealtimeItem } from "@/services/realtime";
import { persistPublicEntries, readStoredPublicEntries } from "@/lib/content-sync";

const modules: Record<string, { collection: string; title: string; helper: string; readOnly?: boolean }> = {
  gallery: { collection: "gallery", title: "Gallery manager", helper: "Upload images to Cloudinary and save their details to Realtime Database." },
  services: { collection: "services", title: "Services", helper: "Create the services shown across the website." },
  pricing: { collection: "pricingPlans", title: "Pricing", helper: "Manage bespoke collections and visible pricing plans." },
  testimonials: { collection: "testimonials", title: "Testimonials", helper: "Add the notes and names shown on the public site." },
  bookings: { collection: "bookings", title: "Bookings", helper: "New booking requests from the website.", readOnly: true },
  messages: { collection: "messages", title: "Messages", helper: "Contact messages received from the website.", readOnly: true },
  analytics: { collection: "analytics", title: "Analytics", helper: "Connect your preferred analytics collection to view reported figures.", readOnly: true },
  settings: { collection: "websiteSettings", title: "Settings", helper: "Store site-wide settings in Firestore." },
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
  // BUG-10 fixed: dedicated gallery item edit state (alt text + hidden flag)
  const [editingGallery, setEditingGallery] = useState<{ id: string; alt: string; hidden: boolean } | null>(null);
  const [notice, setNotice] = useState("");

  const isPricing = module === "pricing";
  const isTestimonials = module === "testimonials";
  const isGallery = module === "gallery";

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
    // BUG-19 fixed: show a visible notice instead of silently returning on missing title.
    if (!title.trim() && !isPricing && !isTestimonials) {
      setNotice("A title is required before adding an item.");
      return;
    }

    const payload = isPricing
      ? { title: title.trim(), body: body.trim(), price: price.trim(), features: features.split(",").map((f) => f.trim()).filter(Boolean), visible }
      : isTestimonials
        ? { author: author.trim(), role: role.trim(), body: body.trim(), visible }
        : { title: title.trim(), body: body.trim(), visible };

    try {
      if (!database && (isPricing || isTestimonials)) {
        // Realtime Database is unavailable; no browser copy is created.
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
      setNotice("Couldn't save. Confirm this account has admin Firestore permissions.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;

    // Never delete from a browser-only fallback.
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
      else setNotice("Cannot delete: Firestore is not configured.");
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

  // BUG-10 fixed: save gallery item alt text and hidden flag.
  async function saveGalleryItem() {
    if (!editingGallery) return;
    const { id, alt, hidden } = editingGallery;
    try {
      if (database) {
        await updateRealtimeItem("gallery", id, { alt, hidden });
      } else {
        const stored = readStoredPublicEntries("gallery", []);
        const next = stored.map((item) => item.id === id ? { ...item, alt, hidden } : item);
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
    if (database) {
      try {
        const id = await createRealtimeItem("gallery", {
          src: asset.url,
          cloudinaryPublicId: asset.publicId,
          width: asset.width,
          height: asset.height,
          alt: "",
          hidden: false,
        });
        // Optimistically prepend with the real Firestore id (avoids duplicate on next snapshot).
        const newItem = { id, src: asset.url, cloudinaryPublicId: asset.publicId, width: asset.width, height: asset.height, alt: "", hidden: false };
        setItems((current) => [newItem, ...current.filter((i) => i.id !== id)]);
        setNotice("Image uploaded and saved to gallery.");
      } catch {
        setNotice("Image uploaded, but Firestore metadata could not be saved.");
      }
    } else {
      // BUG-15 fixed: assign order so items sort deterministically (0 = newest, push older items down).
      const stored = readStoredPublicEntries("gallery", []);
      const newItem = {
        id: `gallery-${Date.now()}`,
        src: asset.url,
        cloudinaryPublicId: asset.publicId,
        width: asset.width,
        height: asset.height,
        alt: "",
        hidden: false,
        order: 0,
      };
      const nextItems = [newItem, ...stored.map((item, idx) => ({ ...item, order: idx + 1 }))];
      persistPublicEntries("gallery", nextItems);
      setItems(nextItems);
      setNotice("Image uploaded and saved locally for gallery display.");
    }
  }

  return (
    <div className="p-5 pt-20 md:p-8 lg:pt-8">
      <header className="border-b border-white/10 pb-5">
        <p className="label text-[#c7a66b]">Content studio</p>
        <h1 className="mt-2 text-3xl font-semibold">{config.title}</h1>
        <p className="mt-2 text-sm text-white/45">{config.helper}</p>
      </header>

      {notice && (
        <p className="mt-5 border border-[#e7a29b]/30 p-3 text-sm text-[#e7a29b]">
          {notice}
          <button onClick={() => setNotice("")} className="ml-3 underline opacity-60 hover:opacity-100">Dismiss</button>
        </p>
      )}

      {/* Gallery upload */}
      {isGallery && (
        <section className="mt-6 border border-white/10 bg-[#161614] p-5">
          <CloudinaryUpload folder="gallery" onUploaded={uploaded} />
          <p className="mt-3 text-xs leading-5 text-white/40">
            Upload an image here and it will be stored for gallery use on the public site.
          </p>
        </section>
      )}

      {/* BUG-10 fixed: Gallery item edit panel — allows updating alt text and visibility */}
      {isGallery && editingGallery && (
        <section className="mt-4 max-w-xl border border-[#c7a66b]/30 bg-[#161614] p-5">
          <p className="label text-[#c7a66b]">Edit gallery image</p>
          <div className="mt-4 space-y-3">
            <input
              value={editingGallery.alt}
              onChange={(e) => setEditingGallery({ ...editingGallery, alt: e.target.value })}
              placeholder="Alt text — describe the image for accessibility"
              className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]"
            />
            <label className="flex items-center gap-2 text-sm text-white/55">
              <input
                type="checkbox"
                checked={editingGallery.hidden}
                onChange={(e) => setEditingGallery({ ...editingGallery, hidden: e.target.checked })}
              />
              Hide from public gallery
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={saveGalleryItem}><Plus size={15} />Save changes</Button>
            <Button onClick={() => setEditingGallery(null)} variant="outline">Cancel</Button>
          </div>
        </section>
      )}

      {/* Standard add / edit form for non-gallery, non-readonly modules */}
      {!config.readOnly && !isGallery && (
        <section className="mt-6 max-w-2xl border border-white/10 bg-[#161614] p-5">
          <p className="label text-[#c7a66b]">{editingId ? "Edit item" : "Add item"}</p>
          {isPricing ? (
            <div className="mt-4 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Package name" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Description" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Features (comma separated)" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <label className="flex items-center gap-2 text-sm text-white/55">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                Show on public site
              </label>
            </div>
          ) : isTestimonials ? (
            <div className="mt-4 space-y-3">
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role / location" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Testimonial" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <label className="flex items-center gap-2 text-sm text-white/55">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
                Show on public site
              </label>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Short description" rows={3} className="w-full resize-none border border-white/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#c7a66b]" />
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button onClick={saveItem}><Plus size={15} />{editingId ? "Save changes" : "Add item"}</Button>
            {editingId && (
              <Button onClick={resetForm} variant="outline">Cancel</Button>
            )}
          </div>
        </section>
      )}

      {/* Item list */}
      <section className="mt-6 max-w-4xl space-y-2">
        {items.length ? (
          items.map((item) => (
            <article className="flex items-start gap-4 border border-white/10 bg-[#161614] p-4" key={item.id}>
              {typeof item.src === "string" && (
                <img src={item.src} alt={typeof item.alt === "string" ? item.alt : ""} className="h-16 w-16 object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {String(item.title || item.author || item.name || item.email || (item.src ? "Gallery image" : "Untitled"))}
                  {typeof item.email === "string" && item.name ? ` (${item.email})` : ""}
                  {typeof item.phone === "string" && item.phone ? ` · Ph: ${item.phone}` : ""}
                </p>
                {isPricing ? (
                  <p className="mt-1 text-sm text-white/45">
                    {String(item.price ?? "")}{item.body ? ` · ${String(item.body)}` : ""}
                  </p>
                ) : isTestimonials ? (
                  <p className="mt-1 line-clamp-2 text-sm text-white/45">{String(item.body || item.role || "")}</p>
                ) : isGallery ? (
                  <p className="mt-1 text-sm text-white/45">
                    {String(item.alt || "No alt text")}
                    {item.hidden ? " · Hidden" : " · Visible"}
                  </p>
                ) : (
                  <p className="mt-1 line-clamp-2 text-sm text-white/45">
                    {String(item.body || item.message || item.eventType || item.src || "")}
                  </p>
                )}
              </div>
              {!config.readOnly && (
                <div className="flex shrink-0">
                  <button
                    onClick={() =>
                      isGallery
                        ? setEditingGallery({ id: item.id, alt: String(item.alt ?? ""), hidden: Boolean(item.hidden) })
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
            </article>
          ))
        ) : (
          <p className="border border-dashed border-white/15 p-7 text-sm text-white/45">No entries yet.</p>
        )}
      </section>
    </div>
  );
}
