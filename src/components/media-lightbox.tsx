"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export type LightboxItem = {
  src: string;
  title?: string;
  category?: string;
  mediaType?: string;
};

interface MediaLightboxProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function MediaLightbox({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: MediaLightboxProps) {
  const current = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !current) return null;

  const isVideo =
    current.mediaType === "video" ||
    Boolean(String(current.src).match(/\.(mp4|webm|mov)($|\?)/i));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between z-10 py-2 border-b border-white/10">
        <button
          onClick={onClose}
          aria-label="Back to page"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#c7a66b] hover:bg-[#c7a66b] hover:text-[#10100f]"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="text-xs font-medium uppercase tracking-widest text-[#c7a66b]">
          {currentIndex + 1} / {items.length}
        </div>

        <button
          onClick={onClose}
          aria-label="Close viewer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:scale-105"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white transition hover:bg-[#c7a66b] hover:text-[#10100f] hover:scale-110 focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Media Display */}
        <div className="relative max-h-[75vh] max-w-[90vw] h-full w-full flex items-center justify-center">
          {isVideo ? (
            <video
              src={current.src}
              controls
              autoPlay
              playsInline
              className="max-h-[75vh] max-w-full rounded-lg shadow-2xl object-contain"
            />
          ) : (
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={current.src}
                alt={current.title || "Photography showcase"}
                fill
                priority
                sizes="(max-width: 1200px) 90vw, 1200px"
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white transition hover:bg-[#c7a66b] hover:text-[#10100f] hover:scale-110 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Caption */}
      <div className="w-full text-center pb-2 z-10">
        {current.category && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c7a66b]">
            {current.category}
          </p>
        )}
        {current.title && (
          <h3 className="mt-1 text-base sm:text-lg font-medium text-white">
            {current.title}
          </h3>
        )}
      </div>
    </div>
  );
}
