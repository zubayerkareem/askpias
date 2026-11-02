export type Testimonial = {
  headline: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

/**
 * Fallback used only when the API is unreachable. The real list is managed in
 * the Filament admin (Content → Testimonials).
 */
export const fallbackTestimonials: Testimonial[] = [
  {
    headline: "Sales more than doubled",
    quote:
      "Pias doesn't just run ads — he understands the whole business and builds a system around it. Our sales more than doubled in three months.",
    name: "Sadia Rahman",
    role: "Founder",
    company: "Zarin Lifestyle",
    initials: "SR",
  },
  {
    headline: "No more missed appointments",
    quote:
      "In the very first meeting I realised our problem wasn't marketing, it was follow-up. Since his system went live we don't miss appointments anymore.",
    name: "Dr. Tanvir Hasan",
    role: "Director",
    company: "Dhaka Dental Studio",
    initials: "TH",
  },
  {
    headline: "Our messaging finally clicked",
    quote:
      "Our messaging changed completely. Now prospects tell us on sales calls exactly what we solve.",
    name: "Imran K.",
    role: "Co-founder",
    company: "Ledgerly",
    initials: "IK",
  },
];
