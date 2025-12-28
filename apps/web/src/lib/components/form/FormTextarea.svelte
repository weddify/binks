<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string;
  export let rows: number = 4;
  export let placeholder: string = "";
  export let required: boolean = false;
</script>

<div class="space-y-1.5">
  <label for={id} class="text-xs font-bold text-slate-500 uppercase">
    {label} {#if required}<span class="text-red-500">*</span>{/if}
  </label>
  <textarea 
    {id} 
    bind:value 
    {rows} 
    {placeholder} 
    class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white resize-none"
    {required}
  ></textarea>
</div>
