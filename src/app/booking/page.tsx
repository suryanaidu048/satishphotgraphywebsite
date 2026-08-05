import { InquiryForm } from "@/components/inquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export default function BookingPage() { return <><SiteHeader /><main className="mx-auto max-w-[1000px] px-5 pb-28 pt-20 md:px-10"><p className="label text-[#c7a66b]">Availability</p><h1 className="display mt-5 text-6xl leading-[.94] tracking-[-.05em] md:text-8xl">Let’s begin with your day.</h1><p className="mt-8 max-w-xl text-sm leading-8 text-white/60">A few details will help us check availability and build the right collection for you.</p><div className="mt-12 border-t border-white/15 pt-8"><InquiryForm kind="bookings" /></div></main><SiteFooter /></>; }
