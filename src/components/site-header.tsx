"use client";

import Link from "next/link";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [{ href: "/portfolio", label: "Portfolio" }, { href: "/services", label: "Services" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }];
export function SiteHeader({ dark = true }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return <header className={cn("relative z-30 flex items-center justify-between px-5 py-6 md:px-10", dark ? "text-[#f0eee9]" : "text-[#10100f]")}><Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[.08em]"><Camera size={17} className="text-[#c7a66b]" />SATISH<span className={dark ? "font-normal text-white/50" : "font-normal text-black/45"}>PHOTOGRAPHY</span></Link><nav className="hidden items-center gap-7 label md:flex">{links.map((link) => <Link key={link.href} href={link.href} className={dark ? "text-white/65 hover:text-white" : "text-black/60 hover:text-black"}>{link.label}</Link>)}<Link href="/booking" className="border border-[#c7a66b] px-3 py-2 text-[#c7a66b]">Book a session</Link></nav><button aria-label="Open navigation" onClick={() => setOpen(!open)} className="p-1 md:hidden">{open ? <X /> : <Menu />}</button>{open && <nav className={cn("absolute inset-x-0 top-full border-y p-5 md:hidden", dark ? "border-white/15 bg-[#10100f]" : "border-black/10 bg-[#f0eee9]")}><div className="grid gap-4 label">{[...links, { href: "/booking", label: "Book a session" }].map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div></nav>}</header>;
}
