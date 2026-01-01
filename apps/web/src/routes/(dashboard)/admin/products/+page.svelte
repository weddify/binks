<script lang="ts">
  import { products } from '$lib/data';
  import Button from '$lib/components/Button.svelte';
  import ActionButtons from '$lib/components/admin/ActionButtons.svelte';
  import { Plus, Search, ListFilter, Package } from 'lucide-svelte';
  import TableLayout from '$lib/components/admin/TableLayout.svelte';
  import Header from '$lib/components/admin/Header.svelte';

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
  <!-- Header -->
  <Header 
      title="Products" 
      subtitle="Manage your digital inventory."
  >
      {#snippet actions()}
         <Button href="/admin/products/new">
            <Plus class="size-4" />
            <span>Add Product</span>
         </Button>
      {/snippet}
  </Header>

  <!-- Filters -->
  <!-- Search & Filter Bar -->
  <!-- Search & Filter Bar -->
  <!-- Table Layout -->
  <TableLayout
      bind:searchQuery={searchQuery}
      placeholder="Search products..."
  >
      {#snippet actions()}
        <Button variant="outline" size="icon">
           <ListFilter class="size-4" />
        </Button>
      {/snippet}

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
                     <ActionButtons 
                        onView={() => {}}
                        editUrl={`/admin/products/${product.slug}`}
                        onDelete={() => {}}
                     />
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
  </TableLayout>
</div>
