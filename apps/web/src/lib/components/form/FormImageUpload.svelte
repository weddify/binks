<script lang="ts">
  import { Upload, X } from 'lucide-svelte';

  export let id: string;
  export let label: string;
  export let value: string; // URL
  export let placeholder: string = "https://...";
</script>

<div class="space-y-3">
  <div class="flex items-center gap-4">
     <div class="size-24 rounded-lg bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
        {#if value}
           <img src={value} alt="Preview" class="w-full h-full object-cover" />
           <button class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white" on:click={() => value = ''}>
              <X class="size-6" />
           </button>
        {:else}
           <Upload class="size-8 text-slate-400" />
        {/if}
     </div>
     <div class="flex-1 space-y-1.5">
        <label for={id} class="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <input 
           {id} 
           type="text" 
           bind:value 
           {placeholder} 
           class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm"
        />
     </div>
  </div>
</div>
