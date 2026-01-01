<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle: string;
    icon?: any;
    class?: string;
    actions?: Snippet;
  }

  let { 
    title, 
    subtitle,
    icon: Icon, 
    class: className = '', 
    actions 
  }: Props = $props();
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 {className}">
    <div class="flex items-center gap-3">
        {#if Icon}
            <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                <Icon class="size-6" />
            </div>
        {/if}
        <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">{title}</h1>
            <p class="text-slate-500 text-xs font-medium mt-1">{subtitle}</p>
        </div>
    </div>
  
  {#if actions}
    <div class="flex gap-2">
      {@render actions()}
    </div>
  {/if}
</div>
