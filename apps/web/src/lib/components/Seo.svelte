<script lang="ts">
  import { siteConfig } from '$lib/config';

  interface Props {
      title: string;
      description?: string;
      image?: string;
      type?: 'website' | 'article' | 'product';
  }

  let { 
      title, 
      description = siteConfig.meta.description, 
      image,
      type = 'website'
  }: Props = $props();

  // If title already mimics the site name pattern (contains "BINKS"), don't append it again.
  const fullTitle = $derived(title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`);
  // Use a default OG image if none provided, or fall back to site logo
  const shareImage = $derived(image || 'https://placehold.co/1200x630/2563eb/ffffff?font=montserrat&text=SwiftAcc'); 
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={shareImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content={fullTitle} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={shareImage} />
</svelte:head>
