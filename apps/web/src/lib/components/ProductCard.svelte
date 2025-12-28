<script lang="ts">
  import { Package, ShoppingBag } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let title: string;
  export let image: string;
  export let price: number;
  export let originalPrice:number | undefined = undefined;
  export let discount: string | undefined = undefined;
  export let stock: number | string = 0;
  export let sold: number | string = 0;
  export let tag: string | undefined = undefined;
  export let tagColor: string = "green"; // green, red, blue
  export let slug: string;

  const dispatch = createEventDispatcher();
  
  // Format price helper
  const formatPrice = (p: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  }
  // Map colors to Tailwind classes to ensure they are purged correctly
  const colorMap: Record<string, { dot: string, ping: string }> = {
    green: { dot: 'bg-green-500', ping: 'bg-green-400' },
    red: { dot: 'bg-red-500', ping: 'bg-red-400' },
    blue: { dot: 'bg-blue-500', ping: 'bg-blue-400' }
  };
  
  $: colors = colorMap[tagColor] || colorMap.green;

  function handleBuy() {
    dispatch('buy');
  }
</script>

<div class="group bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
  <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-900 mb-4">
    <div class="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style='background-image: url("{image}");'></div>
    
    <!-- Live Indicator -->
    <div class="absolute top-2 right-2">
      <span class="flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full {colors.ping} opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 {colors.dot}"></span>
      </span>
    </div>
    
    {#if tag}
        <div class="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
            {tag}
        </div>
    {/if}
  </div>
  
  <div class="flex-1">
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">{title}</h3>
    </div>
    <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
      <div class="flex items-center gap-1">
        <Package class="size-[14px]" />
        {#if stock === 0 || stock === "Habis"}
             <span class="text-red-500">Habis</span>
        {:else}
             <span>{stock} Stok</span>
        {/if}
       
      </div>
      <div class="flex items-center gap-1">
        <ShoppingBag class="size-[14px]" />
        <span>{sold} Terjual</span>
      </div>
    </div>
  </div>
  
  <div class="pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
    <div class="flex items-end justify-between mb-4">
      <div class="flex flex-col">
        {#if originalPrice}
            <span class="text-xs text-slate-400 line-through">{formatPrice(originalPrice)}</span>
        {/if}
        <span class="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(price)}</span>
      </div>
      {#if discount}
        <span class="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">{discount}</span>
      {/if}
    </div>
    
    <div class="grid grid-cols-2 gap-2">
      <a href="/product/{slug}" class="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Detail</a>
      <button 
        onclick={handleBuy}
        class="px-3 py-2 rounded-lg {stock === 0 || stock === 'Habis' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-600 shadow-md shadow-blue-500/20'} text-sm font-bold transition-colors"
        disabled={stock === 0 || stock === 'Habis'}
      >
        {stock === 0 || stock === 'Habis' ? 'Stok Habis' : 'Beli'}
      </button>
    </div>
  </div>
</div>
