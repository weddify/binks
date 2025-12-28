<script lang="ts">
  export let id: string; // Used for a11y implicitly
  export let label: string;
  export let description: string = "";
  export let checked: boolean = false;
</script>

<label class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
  <input type="checkbox" bind:checked class="checkbox checkbox-primary checkbox-sm" />
  <div class="flex-1">
     <div class="font-bold text-slate-900 dark:text-white text-sm">{label}</div>
     {#if description}
       <div class="text-xs text-slate-500">{description}</div>
     {/if}
  </div>
</label>
