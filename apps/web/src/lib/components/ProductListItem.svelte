<script lang="ts">
  import { Package, TrendingUp, Info } from 'lucide-svelte';
  import BuyNowModal from '$lib/components/BuyNowModal.svelte';

  export let id: string;
  export let slug: string;
  export let title: string;
  export let description: string;
  export let price: number;
  export let originalPrice:number | undefined = undefined;
  export let stock: number;
  export let sold: number;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  let isModalOpen = false;

  function openModal() {
     if (stock > 0) isModalOpen = true;
  }
</script>

<div data-id={id} class="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors first:rounded-t-xl last:rounded-b-xl last:border-0">
  <!-- Content -->
  <div class="flex-grow flex flex-col justify-center gap-1">
    <div class="flex items-center justify-between">
       <a href="/product/{slug}" class="text-base font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">{title}</a>
       
       <!-- Price Block Mobile (Visible only on small screens) -->
       <div class="sm:hidden text-right">
          {#if originalPrice}
            <span class="text-xs text-slate-400 line-through block">{formatPrice(originalPrice)}</span>
          {/if}
          <span class="text-sm font-bold text-primary">{formatPrice(price)}</span>
       </div>
    </div>
    
    <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">{description}</p>
    
    <!-- Stats Row -->
    <div class="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex items-center gap-1 {stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}">
        <Package class="size-3.5" />
        <span class="font-medium">Stock: {stock}</span>
      </div>
      <div class="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
      <a href="/product/{slug}" class="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors font-medium">
        <Info class="size-3.5" />
        Detail Information
      </a>
      <div class="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
      <div class="flex items-center gap-1">
        <TrendingUp class="size-3.5" />
        <span>Terjual: {sold}</span>
      </div>
    </div>
  </div>

  <!-- Actions & Price Desktop -->
  <div class="flex items-center justify-between sm:justify-end gap-6 sm:w-auto min-w-[200px]">
     <!-- Price -->
     <div class="hidden sm:flex flex-col items-end text-right min-w-[100px]">
        {#if originalPrice}
          <span class="text-xs text-slate-400 line-through">{formatPrice(originalPrice)}</span>
        {/if}
        <span class="text-lg font-bold text-primary">{formatPrice(price)}</span>
     </div>

     <!-- Buttons -->
     <div class="flex items-center gap-2">
       <button 
         class="h-9 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
         disabled={stock === 0}
         on:click={openModal}
       >
         {stock > 0 ? 'Buy Now' : 'Habis'}
       </button>
     </div>
  </div>
</div>

<!-- Buy Now Modal -->
<BuyNowModal 
   isOpen={isModalOpen} 
   product={{ title, price, stock, description }} 
   onclose={() => isModalOpen = false} 
/>
