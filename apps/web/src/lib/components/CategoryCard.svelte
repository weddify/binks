<script lang="ts">
  import { ArrowRight, Package } from 'lucide-svelte';

  export let title: string;
  export let description: string;
  export let image: string;
  export let logo: string | undefined = undefined; // URL or text representation if complex
  export let logoBg: string = "bg-black"; // Tailwind class for logo container bg
  export let logoText: string | undefined = undefined; // Text inside logo box if no image
  export let productCount: number;
  export let tag: string | undefined = undefined;
  export let tagColor: string = "bg-white/90 text-slate-900"; // Tailwind classes for tag
  export let href: string = "#";
</script>

<a {href} class="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-primary dark:hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
  <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
    <div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style="background-image: url('{image}');">
    </div>
    
    {#if tag}
      <div class="absolute top-4 right-4 z-20">
        <span class="{tagColor} backdrop-blur-md text-xs font-bold px-2 py-1 rounded-md border border-white/10">
          {tag}
        </span>
      </div>
    {/if}

    <div class="absolute bottom-4 left-4 z-20">
      <div class="size-10 rounded-lg {logoBg} flex items-center justify-center shadow-lg border border-white/10 text-white font-bold text-lg overflow-hidden">
         {#if logo}
            <img src={logo} alt={title} class="w-full h-full object-cover" />
         {:else if logoText}
            {logoText}
         {:else}
            {title.substring(0,2).toUpperCase()}
         {/if}
      </div>
    </div>
  </div>

  <div class="flex flex-col p-5 gap-2">
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
      <ArrowRight class="size-6 text-slate-400 group-hover:translate-x-1 transition-transform" />
    </div>
    
    <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{description}</p>
    
    <div class="mt-2 flex items-center gap-2">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
        <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        {productCount} Products
      </div>
    </div>
  </div>
</a>
