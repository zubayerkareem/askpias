// Dummy placeholder thumbnails — swap for real cover images per note.
export const dummyImage = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

export type Note = {
  slug: string;
  category: string;
  date: string;
  featured: boolean;
  locked: boolean;
  commentCount: number;
  title: string;
  excerpt: string;
};

export const notes: Note[] = [
  {
    slug: "ads-budget-questions",
    category: "Strategy",
    date: "12 July 2026",
    featured: true,
    locked: false,
    commentCount: 8,
    title: "5 questions you must answer before spending on ads",
    excerpt:
      "Most businesses start with ads while the real problem sits in the offer and the message. Answer these five questions and you'll waste far less budget.",
  },
  {
    slug: "traffic-no-buyers",
    category: "Conversion",
    date: "28 June 2026",
    featured: false,
    locked: false,
    commentCount: 5,
    title: "Traffic is coming to your landing page but nobody buys — why?",
    excerpt:
      "Low conversion is rarely a design problem. It's usually a lack of clarity and trust. Explained with real examples.",
  },
  {
    slug: "roas-framework",
    category: "Performance marketing",
    date: "14 June 2026",
    featured: true,
    locked: false,
    commentCount: 4,
    title: "A practical framework for increasing ROAS on Meta Ads",
    excerpt:
      "Creative testing, audience structure and budget scaling — the three-step system I use with every client.",
  },
  {
    slug: "positioning-not-logo",
    category: "Branding",
    date: "30 May 2026",
    featured: false,
    locked: true,
    commentCount: 0,
    title: "Brand positioning is not your logo",
    excerpt:
      "Positioning is the space you own in your customer's mind. A simple explanation with real brand examples.",
  },
  {
    slug: "existing-customers",
    category: "Retention",
    date: "18 May 2026",
    featured: false,
    locked: false,
    commentCount: 3,
    title: "Your existing customers are more profitable than new ones",
    excerpt:
      "How to design a repeat purchase system and which metrics actually deserve your attention.",
  },
  {
    slug: "systems-not-tricks",
    category: "Systems",
    date: "2 May 2026",
    featured: false,
    locked: false,
    commentCount: 6,
    title: "Drop the marketing tricks, build a system",
    excerpt:
      "Hacks give you temporary spikes. Systems give you predictable growth. Here's the difference.",
  },
];
