<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    isActive?: boolean;
    class?: string;
    children: Snippet;
    footer?: Snippet;
  }

  let { 
    isActive, 
    class: className = '', 
    children, 
    footer 
  }: Props = $props();
</script>

<div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden group relative hover:border-primary/50 transition-colors {className}">
  {#if isActive !== undefined}
    <div class="absolute left-0 top-0 bottom-0 w-1 {isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>
  {/if}

  <div class="p-6 h-full flex flex-col">
    {@render children()}
  </div>

  {#if footer}
    <div class="bg-slate-50 dark:bg-slate-900/30 px-6 py-3 border-t border-slate-100 dark:border-slate-700">
      {@render footer()}
    </div>
  {/if}
</div>
