"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { defaultSiteSettings, subscribeToSiteSettings } from "@/services/site-settings";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSiteSettings);
  const pathname = usePathname();
  useEffect(() => subscribeToSiteSettings(setSettings), []);

  return (
    <header className={cn("relative z-30 flex items-center justify-between px-5 py-6 md:px-10", dark ? "text-[#f0eee9]" : "text-[#10100f]")}>
      <Link
        href="/"
        className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b]"
      >
        <Image src={settings.logoUrl} alt={settings.studioName} width={100} height={100} className="object-contain drop-shadow-lg" priority />
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
        <Menu size={22} />
      </button>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between border-l border-white/15 bg-[#121210] p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        <div>
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c7a66b]">
              Menu
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links list */}
          <nav aria-label="Mobile menu links" className="mt-6 flex flex-col gap-3.5">
            {[...links, { href: "/faq", label: "FAQs" }].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-1 text-sm font-medium transition",
                    isActive
                      ? "text-[#c7a66b] font-semibold"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-full bg-[#c7a66b] py-3 text-xs font-bold uppercase tracking-wider text-[#10100f] hover:bg-[#d8b77c] transition shadow-md"
          >
            Book a Session
          </Link>
          <div className="text-center text-[11px] text-white/40">
            {settings.phone}
          </div>
        </div>
      </div>
    </header>
  );
}
