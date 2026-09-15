"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, CalendarCheck, Instagram } from "lucide-react";
import { defaultSiteSettings, subscribeToSiteSettings } from "@/services/site-settings";

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.676-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.101-.201.05-.376-.025-.526-.075-.151-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.518-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.08 2.912 1.23 3.113c.151.201 2.126 3.246 5.15 4.553.72.311 1.282.497 1.72.637.724.23 1.382.198 1.902.12.58-.087 1.78-.727 2.03-1.429.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.35z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.662 1.438 5.177L2.05 22l4.978-1.34A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.17 8.17 0 01-4.223-1.168l-.303-.18-3.13.842.839-3.048-.197-.314A8.167 8.167 0 013.8 12c0-4.529 3.671-8.2 8.2-8.2 4.529 0 8.2 3.671 8.2 8.2 0 4.529-3.671 8.2-8.2 8.2z"
      />
    </svg>
  );
}

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
  const bookingHref = pathname === "/" ? "#booking" : "/booking";

  return (
    <aside
      aria-label="Contact and booking quick access"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 drop-shadow-2xl select-none"
    >
      {/* Quick Booking Button */}
      <a
        href={bookingHref}
        aria-label="Book a Photography Session"
        title="Quick Booking"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#c7a66b] via-[#e5cf9e] to-[#c7a66b] text-[#10100f] shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(199,166,107,0.6)] focus:outline-none focus:ring-2 focus:ring-[#c7a66b]"
      >
        <CalendarCheck size={20} className="stroke-[2.2]" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#10100f]/90 px-2.5 py-1 text-xs font-semibold text-[#c7a66b] border border-[#c7a66b]/40 shadow-lg md:group-hover:block">
          Book Session
        </span>
      </a>

      {/* WhatsApp Official Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp ${settings.studioName}`}
        title="Chat on WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
      >
        <WhatsAppIcon size={22} />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#10100f]/90 px-2.5 py-1 text-xs font-semibold text-[#25D366] border border-[#25D366]/40 shadow-lg md:group-hover:block">
          WhatsApp Us
        </span>
      </a>

      {/* Phone Call Button */}
      <a
        href={phoneHref}
        aria-label={`Call ${settings.studioName} (${settings.phone})`}
        title={`Call ${settings.phone}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a66b]/60 bg-[#10100f]/90 text-[#c7a66b] shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-[#c7a66b] hover:text-[#10100f] focus:outline-none focus:ring-2 focus:ring-[#c7a66b]"
      >
        <Phone size={19} />
      </a>

      {/* Instagram Button */}
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


