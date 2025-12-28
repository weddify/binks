import { LEGAL_PAGES } from "$lib/data/legal";

export function match(param) {
  return LEGAL_PAGES.some((page) => page.slug === param);
}
