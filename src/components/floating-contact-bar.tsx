"use client";

import { Phone, MessageCircle, Instagram } from "lucide-react";

export function FloatingContactBar() {
  return (
    <aside
      aria-label="Contact quick links"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 drop-shadow-2xl"
    >
      <a
        href="tel:+917997634562"
        aria-label="Call Satish Photography (+91 7997634562)"
        title="Call +91 7997634562"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a66b]/60 bg-[#10100f]/90 text-[#c7a66b] shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#c7a66b] hover:text-[#10100f] focus:outline-none focus:ring-2 focus:ring-[#c7a66b]"
      >
        <Phone size={20} />
      </a>
      <a
        href="https://wa.me/917997634562"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp Satish Photography"
        title="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="https://www.instagram.com/satish_photography1_?igsh=NXhwYmFjcGgwdXNt"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram @satish_photography1_"
        title="Follow on Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#dc2743]"
      >
        <Instagram size={20} />
      </a>
    </aside>
  );
}
