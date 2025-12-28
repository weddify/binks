<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string;
  export let options: string[] = [];
  export let required: boolean = false;
</script>

<div class="space-y-1.5">
  <label for={id} class="text-xs font-bold text-slate-500 uppercase">
    {label} {#if required}<span class="text-red-500">*</span>{/if}
  </label>
  <select 
    {id} 
    bind:value
    class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white"
    {required}
  >
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</div>
