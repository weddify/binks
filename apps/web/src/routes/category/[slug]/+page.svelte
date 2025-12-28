<script lang="ts">
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ProductListItem from '$lib/components/ProductListItem.svelte';
  import TopFilterBar from '$lib/components/TopFilterBar.svelte';
  import { Home, ChevronRight, Bolt, ShieldCheck, Headset } from 'lucide-svelte';
  import { database, type CategoryData, type Product, type ProductGroup } from '$lib/data';

  $: slug = $page.params.slug as string;
  $: categoryData = (database[slug] || { title: slug, description: "Category not found", groups: [] }) as CategoryData;

  // --- Filtering Logic ---
  let showOutOfStock = false; 
  let selectedCategory = "";
  let searchTerm = "";

  $: filteredGroups = (categoryData.groups || []).map((group: ProductGroup) => {
    // 1. Filter by Category (Group Title)
    if (selectedCategory && group.groupTitle !== selectedCategory) return null;

    // 2. Filter Products
    const filteredProducts = group.products.filter((p: Product) => {
        // Hide Out of Stock Logic:
        if (showOutOfStock && p.stock === 0) return false;

        // Search Term Logic:
        if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    if (filteredProducts.length === 0) return null;

    return { ...group, products: filteredProducts };
  }).filter(Boolean) as ProductGroup[];

  // Reactive options for top bar
  $: groupTitles = categoryData.groups ? categoryData.groups.map((g: ProductGroup) => g.groupTitle) : [];

</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  
  <main class="flex-grow flex flex-col items-center bg-background-light dark:bg-background-dark">
    <div class="w-full max-w-[1200px] px-4 md:px-2 py-6 md:py-6">
      <!-- Breadcrumbs -->
      <div class="flex items-center flex-wrap gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1" href="/">
          <Home class="size-4" />
          Home
        </a>
        <ChevronRight class="size-4 text-slate-400" />
        <span class="text-slate-900 dark:text-white font-medium capitalize">{categoryData.title}</span>
      </div>
      
      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase mb-1">
            {categoryData.title}
        </h1>
         <p class="text-md text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {categoryData.description}
          </p>
      </div>

      <!-- Filters -->
      <TopFilterBar 
         bind:showOutOfStock 
         bind:selectedCategory 
         bind:searchTerm 
         categories={groupTitles} 
      />
      
      <!-- Product Groups -->
      <div class="space-y-8">
        {#each filteredGroups as group}
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
             <!-- Group Header -->
             <div class="px-6 py-3 bg-primary text-white border-b border-primary-dark">
                <h2 class="text-lg font-bold flex items-center gap-2">
                   <Bolt class="size-5 text-white/80" />
                   {group.groupTitle}
                </h2>
             </div>
             
             <!-- Products List -->
             <div>
                {#each group.products as product}
                   <ProductListItem {...product} />
                {/each}
             </div>
          </div>
        {:else}
           <div class="text-center py-20">
              <p class="text-slate-500">No products found holding current filters.</p>
           </div>
        {/each}
      </div>

       <!-- Trust Badges -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-slate-200 dark:border-slate-800">
        <div class="flex flex-col items-center text-center gap-3 p-4">
          <div class="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Bolt class="size-8" />
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">Instant Delivery</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Get your account details sent to your email immediately after purchase.</p>
        </div>
        <div class="flex flex-col items-center text-center gap-3 p-4">
          <div class="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2">
            <ShieldCheck class="size-8" />
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">Warranty Covered</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">All accounts come with a replacement warranty for your peace of mind.</p>
        </div>
        <div class="flex flex-col items-center text-center gap-3 p-4">
          <div class="size-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-2">
            <Headset class="size-8" />
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">24/7 Support</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Our dedicated support team is always ready to help you with any issues.</p>
        </div>
      </div>

    </div>
  </main>
  
  <Footer />
</div>
