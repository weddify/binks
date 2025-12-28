<script lang="ts">
  import { products } from '$lib/data';
  import Button from '$lib/components/Button.svelte';
  import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-svelte';

  let searchQuery = '';
  // Simple search filter
  $: filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
</script>

<div class="space-y-3">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
     <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Products</h1>
        <p class="text-slate-500 text-xs font-medium">Manage your digital inventory.</p>
     </div>
     <Button href="/admin/products/new">
        <Plus class="size-4" />
        <span>Add Product</span>
     </Button>
  </div>

  <!-- Filters -->
  <!-- Search & Filter Bar -->
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="relative w-full sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
              type="text" 
              bind:value={searchQuery}
              placeholder="Search products..." 
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
      </div>
      <div class="flex gap-2">
         <button class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Filter class="size-4" />
            <span>Filter</span>
         </button>
      </div>
  </div>

  <!-- Products Table -->
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
     <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
           <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 w-20">Image</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Product Name</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Price</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Stock</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Type</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-right">Actions</th>
              </tr>
           </thead>
           <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              {#each filteredProducts as product}
                 <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td class="px-6 py-3">
                       <div class="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                          {#if product.image}
                             <img src={product.image} alt={product.title} class="w-full h-full object-cover" />
                          {:else}
                             <div class="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">IMG</div>
                          {/if}
                       </div>
                    </td>
                    <td class="px-6 py-3">
                       <div class="font-bold text-slate-900 dark:text-white">{product.title}</div>
                       <div class="text-xs text-slate-500 font-mono mt-0.5">{product.slug}</div>
                    </td>
                    <td class="px-6 py-3">
                       <div class="font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</div>
                       {#if product.originalPrice}
                          <div class="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
                       {/if}
                    </td>
                    <td class="px-6 py-3">
                       <div class="flex items-center gap-2">
                          <span class="font-bold {product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}">
                             {product.stock}
                          </span>
                          <span class="text-xs text-slate-400">/ {product.sold} sold</span>
                       </div>
                       {#if product.stock === 0}
                          <span class="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase">Out of Stock</span>
                       {/if}
                    </td>
                    <td class="px-6 py-3">
                       <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          {product.instantDelivery ? 'Instant' : 'Manual'}
                       </span>
                    </td>
                    <td class="px-6 py-3 text-right">
                       <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-blue-600 transition-colors" title="View">
                             <Eye class="size-4" />
                          </button>
                          <a href="/admin/products/{product.slug}" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-amber-600 transition-colors" title="Edit">
                             <Edit class="size-4" />
                          </a>
                          <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-red-600 transition-colors" title="Delete">
                             <Trash2 class="size-4" />
                          </button>
                       </div>
                    </td>
                 </tr>
              {/each}
           </tbody>
        </table>
        
        {#if filteredProducts.length === 0}
           <div class="py-12 text-center text-slate-500">
              <Package class="size-12 mx-auto mb-3 text-slate-300" />
              <p class="font-medium">No products found matching "{searchQuery}"</p>
           </div>
        {/if}
     </div>
  </div>
</div>
