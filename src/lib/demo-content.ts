import type { HomepageSection } from "@/types/content";

// Local visual fixture. Run the forthcoming Firebase seed command before production.
export const demoSections: HomepageSection[] = [
  { id: "hero", type: "hero", order: 0, visible: true, published: true, content: { eyebrow: "Satish Photography · India", title: "Images that keep the feeling in focus.", subtitle: "Wedding, portrait and celebration stories observed with an unhurried eye.", primaryCta: "Plan your story", primaryHref: "#booking", images: [] } },
  { id: "gallery", type: "gallery", order: 1, visible: true, published: true, content: { eyebrow: "Selected work", title: "Made to be returned to.", images: [] } },
  { id: "about", type: "about", order: 2, visible: true, published: true, content: { eyebrow: "The approach", title: "Real moments, artfully held.", body: "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye.", stat: "12 years", statLabel: "of human stories" } },
  { id: "services", type: "services", order: 3, visible: true, published: true, content: { eyebrow: "Ways to work together", title: "One studio, many kinds of story.", items: ["Wedding photography", "Pre-wedding stories", "Portrait sessions"] } },
  { id: "pricing", type: "pricing", order: 4, visible: true, published: true, content: {} },
  { id: "testimonials", type: "testimonials", order: 5, visible: true, published: true, content: {} },
  { id: "booking", type: "booking", order: 6, visible: true, published: true, content: { eyebrow: "Start a conversation", title: "Tell us what you’re dreaming up.", body: "Share a few details and we’ll send availability, collections and next steps." } }
];
