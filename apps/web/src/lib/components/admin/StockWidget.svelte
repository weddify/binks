<script lang="ts">
  import { Package, TrendingUp, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-svelte';
  
  interface Product {
      id: string;
      title: string;
      stock: number;
      sold: number;
      price: number;
      image?: string;
  }

  interface Props {
      products: Product[];
  }

  let { products }: Props = $props();

  // Logic to process products
  let lowStockProducts = $derived(
      products
          .filter(p => p.stock < 10)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5)
  );

  let topSellingProducts = $derived(
      [...products]
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5)
  );

  let activeTab = $state('low_stock'); // 'low_stock' | 'top_selling'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
</script>

<div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 h-full flex flex-col">
  <!-- Header with Tabs -->
  <div class="px-0 pt-2 border-b-0 flex">
      <button 
          class="flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all {activeTab === 'low_stock' ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}"
          onclick={() => activeTab = 'low_stock'}
      >
          <AlertTriangle class="size-4" />
          Low Stock
      </button>
      <button 
          class="flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all {activeTab === 'top_selling' ? 'border-primary text-primary dark:text-primary-400 bg-primary/5 dark:bg-primary/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}"
          onclick={() => activeTab = 'top_selling'}
      >
          <TrendingUp class="size-4" />
          Top Selling
      </button>
  </div>

  <!-- Content List -->
  <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {#if activeTab === 'low_stock'}
          <div class="space-y-3">
              {#each lowStockProducts as product}
                  <div class="flex items-center gap-3.5 p-0 hover:bg-transparent transition-colors group">
                      <div class="relative size-10 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                          {#if product.image}
                              <img src={product.image} alt={product.title} class="w-full h-full object-cover" />
                          {:else}
                              <div class="flex items-center justify-center h-full text-slate-400">
                                  <Package class="size-5" />
                              </div>
                          {/if}
                      </div>
                      <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate pr-2 leading-tight">{product.title}</h4>
                          <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatPrice(product.price)}</span>
                      </div>
                      <div class="text-right">
                          <span class="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                             {product.stock} Left
                          </span>
                      </div>
                  </div>
              {/each}
              
              {#if lowStockProducts.length === 0}
                  <div class="flex flex-col items-center justify-center py-10 text-slate-400">
                      <CheckCircle class="size-10 mb-2 opacity-20" />
                      <p class="text-sm">Stock levels look good!</p>
                  </div>
              {/if}
          </div>
      {:else}
          <div class="space-y-3">
              {#each topSellingProducts as product, i}
                  <div class="flex items-center gap-3.5 p-0 hover:bg-transparent transition-colors">
                      <div class="flex items-center justify-center size-6 rounded bg-primary/10 text-primary text-xs font-bold mr-1">
                          #{i + 1}
                      </div>
                      <div class="relative size-10 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                           {#if product.image}
                              <img src={product.image} alt={product.title} class="w-full h-full object-cover" />
                          {:else}
                              <div class="flex items-center justify-center h-full text-slate-400">
                                  <Package class="size-5" />
                              </div>
                          {/if}
                      </div>
                      <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{product.title}</h4>
                      </div>
                      <div class="text-right">
                          <div class="flex items-center gap-1 text-xs font-bold text-primary">
                              {product.sold} <span class="text-slate-400 font-normal">sold</span>
                          </div>
                      </div>
                  </div>
              {/each}
          </div>
      {/if}
  </div>
  
  <div class="p-4 pt-0">
      <a href="/admin/products" class="btn btn-sm w-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 border-none font-semibold transition-all">
         View Inventory
      </a>
  </div>
</div>

<style>
    /* Custom Scrollbar for the list */
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e2e8f0;
        border-radius: 20px;
    }
</style>
