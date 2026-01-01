<script lang="ts">
  import { Search } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    searchQuery?: string;
    placeholder?: string;
    class?: string;
    filters?: Snippet;
    actions?: Snippet;
  }

  let { 
    searchQuery = $bindable(''), 
    placeholder = 'Search...', 
    class: className = '', 
    filters, 
    actions 
  }: Props = $props();
</script>

<div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 {className}">
  <!-- Search Section -->
  <div class="relative w-full sm:max-w-xs">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
      <input 
          type="text" 
          bind:value={searchQuery}
          {placeholder}
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />
  </div>

  <!-- Filters & Actions -->
  <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
      <!-- Left-side Filters (pills, dropdowns) -->
      {#if filters}
        <div class="flex items-center gap-2 mr-auto sm:mr-0">
          {@render filters()}
        </div>
      {/if}

      <!-- Right-side Actions (buttons, toggles) -->
      {#if actions}
        <div class="flex items-center gap-2">
          {@render actions()}
        </div>
      {/if}
  </div>
</div>
