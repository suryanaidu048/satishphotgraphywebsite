"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import { BarChart3, Briefcase, Calendar, Image as ImageIcon, LayoutPanelTop, LogOut, Mail, MessageSquareQuote, Menu, Settings, Tag } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Homepage Control", icon: LayoutPanelTop },
  { href: "/admin/gallery", label: "Gallery Manager", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/pricing", label: "Pricing Collections", icon: Tag },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ user, children }: { user: { email?: string | null } | User; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    if (auth) await signOut(auth).catch(() => null);
    localStorage.removeItem("satish_admin_session");
    router.replace("/admin/login");
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[#141412] p-5">
      <Link href="/" className="label text-[#c7a66b]">Satish Photography</Link>
      <div className="mt-8 space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href === "/admin" && path === "/admin/homepage");
          return (
            <Link onClick={() => setOpen(false)} href={href} key={href} className={cn("flex items-center gap-3 px-3 py-2.5 text-sm transition", active ? "bg-[#c7a66b] text-[#10100f]" : "text-white/55 hover:bg-white/5 hover:text-white")}>
              <Icon size={16} />{label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto border-t border-white/10 pt-4">
        <p className="truncate px-3 text-xs text-white/45">{user.email}</p>
        <button onClick={logout} className="mt-3 flex w-full items-center gap-3 px-3 py-2 text-sm text-white/55 hover:text-white">
          <LogOut size={16} />Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#10100f] text-[#f0eee9]">
      <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 border border-white/15 bg-[#141412] p-2 lg:hidden">
        <Menu size={18} />
      </button>
      <div className={cn("fixed inset-y-0 left-0 z-50 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>{sidebar}</div>
      {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}
      <section className="min-h-screen lg:pl-72">{children}</section>
    </main>
  );
}
