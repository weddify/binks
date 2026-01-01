import { products, database } from "$lib/data";
import { DEFAULT_PAGES } from "$lib/stores/pageStore.svelte";

export async function GET({ url }) {
  const origin = url.origin;

  const staticPages = [
    "",
    "/contact",
    "/login",
    "/register",
    "/forgot-password",
    "/privacy-policy", // Although in CMS, good to track strictly
    "/terms-of-service",
    "/faq",
  ];

  // 1. Static Pages
  const staticSitemap = staticPages
    .map(
      (page) => `
  <url>
    <loc>${origin}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("");

  // 2. Categories
  // Object.values(database) gives us category objects. keys are slugs in our mock but look at data structure
  // In data.ts: export const database: Record<string, CategoryData> = { streaming: ... }
  // So the key 'streaming' is the slug.
  // Wait, looking at `database`, the key IS the slug used in `/category/[slug]`.

  const categorySitemap = Object.keys(database)
    .map(
      (slug) => `
  <url>
    <loc>${origin}/category/${slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  // 3. Products
  const productSitemap = products
    .map(
      (product) => `
  <url>
    <loc>${origin}/product/${product.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join("");

  // 4. CMS Pages (from PageStore)
  // We use DEFAULT_PAGES for now as server can't read user's localStorage edits
  const cmsSitemap = DEFAULT_PAGES.map(
    (page) => `
  <url>
    <loc>${origin}/${page.slug}</loc>
    <lastmod>${page.lastUpdated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticSitemap}
${categorySitemap}
${productSitemap}
${cmsSitemap}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
