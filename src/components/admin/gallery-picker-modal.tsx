"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeToPublicEntries, type PublicEntry } from "@/services/content";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: { url: string; alt?: string; title?: string }) => void;
};

export function GalleryPickerModal({ isOpen, onClose, onSelect }: Props) {
  const [galleryItems, setGalleryItems] = useState<PublicEntry[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    return subscribeToPublicEntries("gallery", (entries) => setGalleryItems(entries), false);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayableImages = galleryItems.filter((item) => Boolean(item.src));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="gallery-picker-title">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col border border-white/15 bg-[#161614] text-[#f0eee9] shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h3 id="gallery-picker-title" className="text-base font-semibold">Select from uploaded gallery</h3>
            <p className="text-xs text-white/40">Choose an image from your gallery collection to assign to this section.</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white" aria-label="Close modal">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {displayableImages.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {displayableImages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect({
                      url: String(item.src),
                      alt: String(item.alt || item.title || "Selected image"),
                      title: String(item.title || ""),
                    });
                    onClose();
                  }}
                  className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-black hover:border-[#c7a66b]"
                >
                  <img src={String(item.src)} alt={String(item.alt || "")} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#c7a66b]">
                      <Check size={14} /> Select
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/15 p-12 text-center text-sm text-white/40">
              No gallery images found. Upload images to the Gallery Manager first.
            </div>
          )}
        </div>

        <footer className="border-t border-white/10 p-3 text-right">
          <Button onClick={onClose} variant="outline" size="sm">
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  );
}
