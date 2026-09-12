"use client";

import { Camera, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WireframePlaceholderProps {
  label?: string;
  sublabel?: string;
  aspectRatio?: "4/3" | "3/4" | "16/9" | "1/1" | "custom";
  className?: string;
  compact?: boolean;
  showGuides?: boolean;
}

export function WireframePlaceholder({
  label = "Cloudinary Image Pending",
  sublabel = "Upload via Admin Panel",
  aspectRatio = "4/3",
  className,
  compact = false,
  showGuides = true,
}: WireframePlaceholderProps) {
  const aspectClasses = {
    "4/3": "aspect-[4/3]",
    "3/4": "aspect-[3/4]",
    "16/9": "aspect-[16/9]",
    "1/1": "aspect-square",
    custom: "",
  }[aspectRatio];

  if (compact) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded border border-dashed border-[#c7a66b]/30 bg-[#161614] text-[#c7a66b]/70",
          className
        )}
      >
        <Camera size={18} className="opacity-60" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#141412] p-6 text-center text-[#f0eee9] transition-all",
        aspectClasses,
        className
      )}
    >
      {/* Subtle photography rule-of-thirds & framing guides */}
      {showGuides && (
        <div className="pointer-events-none absolute inset-0 select-none opacity-20">
          {/* Rule of thirds grid lines */}
          <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-[#c7a66b]" />
          <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-[#c7a66b]" />
          <div className="absolute inset-y-0 left-1/3 border-r border-dashed border-[#c7a66b]" />
          <div className="absolute inset-y-0 left-2/3 border-r border-dashed border-[#c7a66b]" />

          {/* Corner framing brackets */}
          <div className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[#c7a66b]" />
          <div className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-[#c7a66b]" />
          <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#c7a66b]" />
          <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#c7a66b]" />

          {/* Center focal crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full border border-[#c7a66b]/40" />
          </div>
        </div>
      )}

      {/* Center content badge */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a66b]/40 bg-[#c7a66b]/10 text-[#c7a66b] shadow-inner backdrop-blur-sm">
          <Camera size={22} className="opacity-90" />
        </div>

        <div className="space-y-1">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-[#c7a66b]">
            {label}
          </p>
          {sublabel && (
            <p className="text-[11px] font-light text-white/40 tracking-wide">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
