import { notFound } from "next/navigation";
import { InteriorPage } from "@/components/interior-page";

const validSlugs = ["portfolio", "gallery", "services", "pricing", "about", "testimonials", "awards", "faq", "contact", "privacy-policy", "terms"];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function Page(props: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await props.params;
  const slug = resolvedParams?.slug;
  if (!slug || !validSlugs.includes(slug)) {
    notFound();
  }
  return <InteriorPage slug={slug} />;
}
