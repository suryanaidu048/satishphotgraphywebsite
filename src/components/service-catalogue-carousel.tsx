"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera, Film } from "lucide-react";

export type CatalogueItem = {
  id?: string;
  src: string;
  title?: string;
  mediaType?: string;
};

type Props = {
  items: CatalogueItem[];
  title: string;
  className?: string;
  autoPlayInterval?: number;
};

export function ServiceCatalogueCarousel({ items, title, className = "", autoPlayInterval = 4500 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Filter out any unsplash or invalid links
  const validItems = items.filter(
    (item) => Boolean(item && item.src) && !String(item.src).includes("unsplash.com")
  );

  useEffect(() => {
    if (validItems.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validItems.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [validItems.length, isHovered, autoPlayInterval]);

  if (validItems.length === 0) {
    return (
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-[#c7a66b]/30 bg-[#161614] flex flex-col items-center justify-center p-6 text-center ${className}`}>
        <Camera size={32} className="text-[#c7a66b]/40 mb-2" />
        <p className="text-xs uppercase tracking-widest text-[#c7a66b] font-semibold">{title}</p>
        <p className="mt-1 text-[11px] text-white/40">Upload showcase photos in Admin Gallery</p>
      </div>
    );
  }

  const currentItem = validItems[currentIndex];
  const isVideo =
    currentItem.mediaType === "video" ||
    Boolean(String(currentItem.src).match(/\.(mp4|webm|mov|mkv|m4v)($|\?)/i));

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validItems.length);
  };

  return (
    <div
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black border border-white/10 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media View */}
      {isVideo ? (
        <video
          key={currentItem.src}
          src={currentItem.src}
          controls
          playsInline
          autoPlay
          muted
          loop
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          key={currentItem.src}
          src={currentItem.src}
          alt={currentItem.title || `${title} showcase`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Top Media Tag / Counter Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white/90 border border-white/10">
        {isVideo ? <Film size={12} className="text-[#c7a66b]" /> : <Camera size={12} className="text-[#c7a66b]" />}
        <span>
          {currentIndex + 1} / {validItems.length}
        </span>
      </div>

      {/* Bottom Gradient Overlay with Caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-end justify-between">
        <span className="text-xs font-medium text-white/90 truncate max-w-[70%]">
          {currentItem.title || `${title} Collection`}
        </span>
        {isVideo && (
          <span className="rounded bg-[#c7a66b] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#10100f]">
            Cinematic Film
          </span>
        )}
      </div>

      {/* Arrow Controls */}
      {validItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous media"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition hover:bg-[#c7a66b] hover:text-[#10100f] sm:opacity-75 sm:hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next media"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition hover:bg-[#c7a66b] hover:text-[#10100f] sm:opacity-75 sm:hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {validItems.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-5 bg-[#c7a66b]" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
