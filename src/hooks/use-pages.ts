import { queryOptions, useQuery } from "@tanstack/react-query";
import { api, type Item } from "@/lib/api";

export type HeroBlock = {
  type: "hero";
  data: { label?: string | null; heading: string; body?: string | null };
};

export type StoryFact = { value: string; label: string };

export type StoryBlock = {
  type: "story";
  data: {
    heading: string;
    body?: string | null;
    image?: string | null;
    caption_name?: string | null;
    caption_location?: string | null;
    facts?: StoryFact[];
  };
};

export type PracticeItem = {
  image?: string | null;
  title: string;
  body?: string | null;
};

export type PracticeBlock = {
  type: "practice";
  data: { heading: string; items?: PracticeItem[] };
};

export type StatsBlock = {
  type: "stats";
  data: { items?: StoryFact[] };
};

export type CtaBlock = {
  type: "cta";
  data: {
    heading: string;
    body?: string | null;
    primary_label?: string | null;
    primary_url?: string | null;
    secondary_label?: string | null;
    secondary_url?: string | null;
  };
};

export type PageBlock = HeroBlock | StoryBlock | PracticeBlock | StatsBlock | CtaBlock;

export type Page = {
  slug: string;
  title: string;
  meta_description: string | null;
  blocks: PageBlock[];
};

const PAGES_KEY = ["pages"] as const;

export const pageBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...PAGES_KEY, slug],
    queryFn: async () => {
      const response = await api.get<Item<Page>>(`/pages/${slug}`);
      return response.data;
    },
    staleTime: 60_000,
  });

export function usePage(slug: string) {
  return useQuery(pageBySlugQueryOptions(slug));
}
