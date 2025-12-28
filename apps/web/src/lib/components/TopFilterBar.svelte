<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';

  export let showOutOfStock: boolean;
  export let selectedCategory: string;
  export let categories: string[]; 
  export let searchTerm: string;

  // Custom "Red Button" styled dropdown component structure
  // Styling based on reference: 
  // - Left thick red border
  // - White background
  // - Right dark red/gradient block for arrow
</script>

<div class="sticky top-16 z-30 mb-8 py-4 -mx-2 px-4 md:px-8 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 transition-all flex flex-col md:flex-row items-center gap-2 shadow-sm">
  
  <!-- 1. Hide Out of Stock -->
  <button 
    class="group relative flex items-center justify-between w-full md:w-auto min-w-[240px] h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:border-primary/50 transition-all outline-none focus:ring-2 focus:ring-primary/20"
    on:click={() => showOutOfStock = !showOutOfStock}
  >
    <div class="flex items-center gap-2">
      <!-- Custom Checkbox Indicator -->
      <div class="size-4 rounded border flex items-center justify-center transition-colors {showOutOfStock ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900'}">
        {#if showOutOfStock}
          <div class="size-2 bg-white rounded-sm"></div>
        {/if}
      </div>
      <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
         Hide Out of Stock
      </span>
    </div>
  </button>

  <!-- 2. Select Category -->
  <div class="relative w-full md:w-auto min-w-[240px] group">
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
      <ChevronDown class="size-4" />
    </div>
    <select 
      bind:value={selectedCategory}
      class="w-full h-10 pl-4 pr-10 appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
    >
      <option value="">All Categories</option>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>

  <!-- 3. Select Product (Search) -->
  <div class="relative w-full md:w-auto flex-1 min-w-[240px]">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
       <Search class="size-4" />
    </div>
    <input 
      type="text"
      bind:value={searchTerm}
      placeholder="Search products..."
      class="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
    />
  </div>

</div>
