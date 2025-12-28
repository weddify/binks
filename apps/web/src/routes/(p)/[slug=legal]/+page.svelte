<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  let { data } = $props();
  // Simple markdown parser or just standard replacement for now if marked isn't installed. 
  // Actually, I should use a simple formatter or install marked.
  // Given the complexity constraints, I'll use a simple formatter for the specific markdown I wrote (## and -).
  // Or better, just display it as whitespace-pre-wrap for now, or implement a basic parser.
  
  // Basic markdown parser for headings and lists
  function parseMarkdown(text: string) {
      return text
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">$1</h2>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-600 dark:text-slate-300">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-slate-200">$1</strong>')
        .replace(/\n/g, '<br />');
  }
</script>

<div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
  <Navbar />
  
  <main class="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Header -->
          <div class="border-b border-slate-100 dark:border-slate-800 pb-8 mb-8">
              <h1 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                  {data.page.title}
              </h1>
              <p class="text-slate-500 dark:text-slate-400 text-sm">
                  Last Updated: <span class="font-medium text-slate-700 dark:text-slate-300">{data.page.lastUpdated}</span>
              </p>
          </div>

          <!-- Content -->
          <article class="prose prose-slate dark:prose-invert max-w-none">
              {@html parseMarkdown(data.page.content)}
          </article>
      </div>
  </main>

  <Footer />
</div>
