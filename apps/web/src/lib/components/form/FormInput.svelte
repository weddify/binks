<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string | number;
  export let type: "text" | "number" | "email" | "password" = "text";
  export let placeholder: string = "";
  export let prefix: string = "";
  export let required: boolean = false;
</script>

<div class="space-y-1.5">
  <label for={id} class="text-xs font-bold text-slate-500 uppercase">
    {label} {#if required}<span class="text-red-500">*</span>{/if}
  </label>
  <div class="relative">
    {#if prefix}
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">{prefix}</span>
    {/if}
    <input 
      {id} 
      {type} 
      bind:value 
      {placeholder} 
      class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white {prefix ? 'pl-10' : ''}"
      {required}
    />
  </div>
</div>
