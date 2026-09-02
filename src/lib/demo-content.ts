import type { HomepageSection } from "@/types/content";
import type { PublicEntry } from "@/services/content";

export const defaultTestimonials: PublicEntry[] = [
  {
    id: "demo-1",
    author: "Priya & Rahul",
    role: "Destination Wedding at City Palace, Udaipur",
    body: "Satish brought such a quiet, effortless presence to our wedding. Looking through the gallery feels like reliving every emotion, every glance, and every unscripted moment.",
    visible: true,
  },
  {
    id: "demo-2",
    author: "Ananya & Vikram",
    role: "Celebration at Alila Fort, Bishangarh",
    body: "The photographs have an extraordinary pulse to them. Friends and family were moved to tears — it's rare to find someone who captures atmosphere so authentically.",
    visible: true,
  },
  {
    id: "demo-3",
    author: "Meera & Dev",
    role: "Intimate Ceremony in Goa",
    body: "From our first call to the final gallery delivery, Satish was incredibly attentive. The images look like stills from a classic film.",
    visible: true,
  },
];

export const defaultPricingPlans: PublicEntry[] = [
  {
    id: "basic",
    title: "Basic",
    price: "₹1,50,000/-",
    features: ["Wedding", "Reception"],
    visible: true,
    order: 1,
  },
  {
    id: "deluxe",
    title: "Deluxe",
    price: "₹2,30,000/-",
    features: ["Engagement", "Prewedding", "Wedding", "Reception"],
    visible: true,
    order: 2,
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹3,00,000/-",
    features: ["Engagement", "Prewedding", "Haldi & Sangeeth", "Wedding", "Reception"],
    visible: true,
    order: 3,
    highlight: true,
  },
];

// Local visual fixture. Run the forthcoming Firebase seed command before production.
export const demoSections: HomepageSection[] = [
  { id: "hero", type: "hero", order: 0, visible: true, published: true, content: { eyebrow: "Satish Photography · India", title: "Turning Moments Into Timeless Memories", subtitle: "Wedding, portrait and celebration stories observed with an unhurried eye.", primaryCta: "Explore Our Work", primaryHref: "#why-choose-us", images: [] } },
  { id: "whyChooseUs", type: "whyChooseUs", order: 1, visible: true, published: true, content: { badge: "Trusted by Happy Couples", title: "WHY COUPLES CHOOSE US?", body: "Every wedding is a once-in-a-lifetime celebration, and we believe every emotion deserves to be captured with care. From the joyful smiles to the heartfelt moments, we create timeless photographs that tell your unique love story with creativity, passion, and attention to every detail.", ctaText: "Explore Our Work →", ctaHref: "/gallery" } },
  { id: "services", type: "services", order: 2, visible: true, published: true, content: { eyebrow: "Our Studio Services", title: "CAPTURING MOMENTS. CREATING MEMORIES.", body: "Every celebration has a story worth telling. We specialize in capturing genuine emotions, timeless moments, and beautiful connections through creative photography and cinematic storytelling." } },
  { id: "gallery", type: "gallery", order: 3, visible: true, published: true, content: { eyebrow: "OUR STORIES", title: "The moments we loved capturing.", subtitle: "From big celebrations to the little moments in between, explore our latest work." } },
  { id: "pricing", type: "pricing", order: 4, visible: true, published: true, content: { title: "PERSONALIZED PACKAGES", subtitle: "Whether you need full-wedding day coverage or a pre-wedding shoot, our plans are designed to make your journey memorable." } },
  { id: "testimonials", type: "testimonials", order: 5, visible: true, published: true, content: { eyebrow: "In Their Words", title: "The feeling stays with them." } },
  { id: "booking", type: "booking", order: 6, visible: true, published: true, content: { eyebrow: "Get In Touch", title: "Start a conversation", subtitle: "Your story deserves to be beautifully remembered.", body: "Reach out to us about your plans, your ideas, or simply to say hello. We’re always happy to connect." } },
  { id: "about", type: "about", order: 7, visible: true, published: true, content: { eyebrow: "Behind The Lens", title: "Real moments, artfully held.", body: "The best photographs do not ask you to perform. We make space for the day to unfold, then preserve its light, movement and tenderness with a considered editorial eye.", stat: "12+ Years", statLabel: "of human stories", image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80" } }
];


