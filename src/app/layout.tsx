import type { Metadata } from "next";
import "./globals.css";
import { FloatingContactBar } from "@/components/floating-contact-bar";

export const metadata: Metadata = { title: "Satish Photography", description: "Turning Moments Into Timeless Memories" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#c7a66b] focus:px-4 focus:py-2 focus:text-[#10100f] focus:font-semibold focus:outline-none"
        >
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
        <FloatingContactBar />
      </body>
    </html>
  );
}
