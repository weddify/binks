<script lang="ts">
  import "../app.css";
  import { siteConfig } from '$lib/config';
  import { Toaster } from 'svelte-sonner';
  import Seo from '$lib/components/Seo.svelte';

  import BackToTop from '$lib/components/BackToTop.svelte';

  let { children } = $props();
</script>

<Seo 
  title={`${siteConfig.siteName} - ${siteConfig.meta.description}`}
  description={siteConfig.meta.description} 
/>

<svelte:head>
  <meta name="keywords" content={siteConfig.meta.keywords} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="min-h-screen bg-background-light dark:bg-background-dark text-[#0d101c] dark:text-[#f8f9fc] font-sans flex flex-col">
  <Toaster position="top-right" richColors />
  {@render children()}
  <BackToTop />
</div>
