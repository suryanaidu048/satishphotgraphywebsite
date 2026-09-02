import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0d0d0b] px-6 pt-14 pb-8 text-white/55 md:px-12">
      <div className="mx-auto max-w-[1480px]">
        {/* ── 4-Column Grid ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Column 1: Logo + tagline + social icons */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-block w-fit">
              <Image
                src="/logo.png"
                alt="Satish Photography"
                width={110}
                height={110}
                className="object-contain"
              />
            </Link>
            <p className="text-[12px] leading-relaxed text-white/40">
              Turning Moments Into Timeless Memories
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/satish_photography1_?igsh=NXhwYmFjcGgwdXNt"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/50 transition hover:border-[#c7a66b] hover:text-[#c7a66b]"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://wa.me/917997634562"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/50 transition hover:border-[#c7a66b] hover:text-[#c7a66b]"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="label text-[11px] font-bold tracking-[.2em] text-white uppercase">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3 text-[13px]">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-[#c7a66b] transition hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Other links */}
          <div className="flex flex-col gap-4">
            <h4 className="label text-[11px] font-bold tracking-[.2em] text-white uppercase">
              Other
            </h4>
            <div className="flex flex-col gap-3 text-[13px]">
              {[
                { href: "/gallery", label: "Gallery" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Term Of Service" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-[#c7a66b] transition hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="flex flex-col gap-4">
            <h4 className="label text-[11px] font-bold tracking-[.2em] text-white uppercase">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3.5 text-[13px]">
              <a href="tel:+917997634562" className="flex items-start gap-3 transition hover:text-white">
                <Phone size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span>+91 7997634562</span>
              </a>
              <a href="mailto:satishphotography16@gmail.com" className="flex items-start gap-3 transition hover:text-white">
                <Mail size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span>satishphotography16@gmail.com</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span className="leading-relaxed">
                  Hyderabad, Telangana, India
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="my-10 h-px bg-white/8" />

        {/* ── Bottom bar ── */}
        <p className="text-center text-[11px] text-white/30">
          Copyright © 2026 surya. Developed With ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/suryatejagajula/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#c7a66b] transition hover:text-white"
          >
            Surya
          </a>
        </p>
      </div>
    </footer>
  );
}
