import Link from "next/link";
import { Instagram } from "lucide-react";

export function SiteFooter() { return <footer className="border-t border-white/15 px-5 py-8 text-white/45 md:px-10"><div className="mx-auto flex max-w-[1480px] flex-col gap-6 md:flex-row md:items-center md:justify-between"><span className="label">Satish Photography</span><div className="flex gap-5 label"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="w-fit"><Instagram size={17} /></a></div></footer>; }
