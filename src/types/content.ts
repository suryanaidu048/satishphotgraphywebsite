export type SectionKind = "hero" | "gallery" | "about" | "services" | "awards" | "pricing" | "testimonials" | "faq" | "booking" | "contact";

export interface HomepageSection { id: string; type: SectionKind; order: number; visible: boolean; published: boolean; content: Record<string, unknown>; }
export interface GalleryImage { id: string; src: string; alt: string; title?: string; category?: string; featured?: boolean; }
export interface HeroContent { eyebrow: string; title: string; subtitle: string; primaryCta: string; primaryHref: string; images: GalleryImage[]; }
