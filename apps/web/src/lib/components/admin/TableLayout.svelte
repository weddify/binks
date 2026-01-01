<script lang="ts">
  import { Search } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    searchQuery?: string;
    placeholder?: string;
    class?: string;
    // Slots
    filters?: Snippet;
    actions?: Snippet;
    children?: Snippet; // The table content
  }

  let { 
    searchQuery = $bindable(''), 
    placeholder = 'Search...', 
    class: className = '', 
    filters,
    actions,
    children 
  }: Props = $props();
</script>

<div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm {className}">
  <!-- Integrated Filter Header -->
  <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800">
      
      <!-- Search Input -->
      <div class="relative w-full sm:max-w-xs">
           <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
           <input 
               type="text" 
               bind:value={searchQuery}
               {placeholder}
               class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
           />
      </div>

      <!-- Filters & Actions -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {#if filters}
             <div class="flex items-center gap-2 mr-auto sm:mr-0">
               {@render filters()}
             </div>
          {/if}

          {#if actions}
             <div class="flex items-center gap-2">
               {@render actions()}
             </div>
          {/if}
      </div>
  </div>

  <!-- Table Content -->
  <div class="overflow-x-auto">
      {@render children?.()}
  </div>
</div>
