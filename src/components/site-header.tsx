"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={cn("relative z-30 flex items-center justify-between px-5 py-6 md:px-10", dark ? "text-[#f0eee9]" : "text-[#10100f]")}>
      <Link
        href="/"
        className="flex items-center gap-3 text-sm font-semibold tracking-[.08em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b]"
      >
        <Camera size={17} className="text-[#c7a66b]" />
        SATISH<span className={dark ? "font-normal text-white/50" : "font-normal text-black/45"}>PHOTOGRAPHY</span>
      </Link>
      <nav aria-label="Main navigation" className="hidden items-center gap-6 label lg:flex">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b]",
                isActive
                  ? "text-[#c7a66b] font-medium border-b border-[#c7a66b] pb-0.5"
                  : dark
                  ? "text-white/65 hover:text-white"
                  : "text-black/60 hover:text-black",
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <Link href="/booking" className="border border-[#c7a66b] px-3 py-2 text-[#c7a66b] transition hover:bg-[#c7a66b] hover:text-[#10100f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b]">
          Book a session
        </Link>
      </nav>
      <button
        aria-label={open ? "Close main menu" : "Open main menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b] lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav
          aria-label="Mobile navigation"
          className={cn(
            "absolute inset-x-0 top-full border-y p-6 shadow-xl lg:hidden",
            dark ? "border-white/15 bg-[#10100f]" : "border-black/10 bg-[#f0eee9]",
          )}
        >
          <div className="grid gap-4 label">
            {[...links, { href: "/booking", label: "Book a session" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 transition hover:text-[#c7a66b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
