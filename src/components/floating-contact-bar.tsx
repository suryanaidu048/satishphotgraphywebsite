"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Instagram } from "lucide-react";
import { defaultSiteSettings, subscribeToSiteSettings } from "@/services/site-settings";

export function FloatingContactBar() {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const pathname = usePathname();

  useEffect(() => {
    const unsub = subscribeToSiteSettings(setSettings);
    return unsub;
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const phoneHref = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappHref = `https://wa.me/${cleanWaNumber}`;
  const instagramHref = settings.instagramUrl || "https://www.instagram.com/satish_photography1_";

  return (
    <aside
      aria-label="Contact quick links"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 drop-shadow-2xl"
    >
      <a
        href={phoneHref}
        aria-label={`Call ${settings.studioName} (${settings.phone})`}
        title={`Call ${settings.phone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a66b]/60 bg-[#10100f]/90 text-[#c7a66b] shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#c7a66b] hover:text-[#10100f] focus:outline-none focus:ring-2 focus:ring-[#c7a66b]"
      >
        <Phone size={20} />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp ${settings.studioName}`}
        title="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href={instagramHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow on Instagram"
        title="Follow on Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#dc2743]"
      >
        <Instagram size={20} />
      </a>
    </aside>
  );
}

