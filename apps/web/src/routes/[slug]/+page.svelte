<script lang="ts">
  import { page } from '$app/stores';
  import { pageStore } from '$lib/stores/pageStore.svelte';
  import { Calendar, ChevronRight, Home } from 'lucide-svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FaqRenderer from '$lib/components/FaqRenderer.svelte';
  import Seo from '$lib/components/Seo.svelte';

  const slug = $page.params.slug;
  const contentPage = $derived(pageStore.getPage(slug));
  const isFaq = $derived(slug === 'faq');
</script>

{#if contentPage}
  <Seo 
     title={contentPage.title} 
     description={`Read our ${contentPage.title} for more information.`}
     type="article"
  />
{/if}

<div class="flex flex-col min-h-screen bg-white dark:bg-slate-900 font-sans">
    <Navbar />

    <main class="flex-1">
        {#if contentPage}
            <!-- Hero Section -->
            <div class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <div class="container mx-auto px-4 py-12 max-w-4xl">
                    <!-- Breadcrumbs -->
                    <nav class="flex items-center text-sm text-slate-500 mb-6">
                        <a href="/" class="hover:text-primary transition-colors flex items-center gap-1">
                            <Home class="size-4" />
                            Home
                        </a>
                        <ChevronRight class="size-4 mx-2 text-slate-300" />
                        <span class="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{contentPage.title}</span>
                    </nav>
    
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                        {contentPage.title}
                    </h1>
                    
                    <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar class="size-4" />
                        <span>Last updated: {new Date(contentPage.lastUpdated).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>
    
            <!-- Content -->
            <div class="container mx-auto px-4 py-12 max-w-4xl">
                {#if isFaq}
                    <FaqRenderer content={contentPage.content} />
                {:else}
                    <article class="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-blue-600">
                        {@html contentPage.content}
                    </article>
                {/if}
            </div>
    
        {:else}
            <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <span class="text-4xl">?</span>
                </div>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h1>
                <p class="text-slate-500 mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <a href="/" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                    Back to Home
                </a>
            </div>
        {/if}
    </main>

    <Footer />
</div>
