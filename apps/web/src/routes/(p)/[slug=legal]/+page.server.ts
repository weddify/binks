import { error } from "@sveltejs/kit";
import { LEGAL_PAGES } from "$lib/data/legal";

export function load({ params }) {
  const page = LEGAL_PAGES.find((p) => p.slug === params.slug);

  if (!page) {
    throw error(404, "Page not found");
  }

  return {
    page,
  };
}
