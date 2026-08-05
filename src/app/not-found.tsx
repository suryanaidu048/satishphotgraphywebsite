import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#10100f] px-5 text-center text-[#f0eee9]">
      <p className="label text-[#c7a66b]">404 · Out of frame</p>
      <h1 className="display mt-6 text-6xl tracking-[-.05em] md:text-8xl">This page slipped away.</h1>
      <p className="mt-6 text-sm text-white/55">Let’s take you somewhere more beautiful.</p>
      <Link className="label mt-8 border border-[#c7a66b] px-6 py-3 text-[#c7a66b]" href="/">
        Return home
      </Link>
    </main>
  );
}
