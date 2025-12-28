<script lang="ts">
  import { type ComponentType } from 'svelte';
  import { Eye, EyeOff } from 'lucide-svelte';

  interface Props {
    label: string;
    id: string;
    name?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    icon?: ComponentType;
    required?: boolean;
    showPasswordToggle?: boolean;
  }

  let { 
    label, 
    id, 
    name, 
    type = 'text', 
    placeholder = '', 
    value = $bindable(''), 
    icon: Icon, 
    required = false,
    showPasswordToggle = false 
  }: Props = $props();

  let isPasswordVisible = $state(false);

  function togglePassword() {
    isPasswordVisible = !isPasswordVisible;
  }
  
  // Derived state to switch between 'text' and 'password' if toggle is enabled
  let inputType = $derived(showPasswordToggle && isPasswordVisible ? 'text' : type);
</script>

<div class="flex flex-col gap-2">
  <label class="text-sm font-semibold text-slate-900 dark:text-gray-200" for={id}>
    {label}
  </label>
  <div class="relative flex items-center">
    {#if Icon}
      <span class="absolute left-4 text-slate-500 pointer-events-none">
        <Icon class="size-5" />
      </span>
    {/if}
    
    <input 
      class="w-full bg-gray-50 dark:bg-[#1a1d2d] border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm {Icon ? 'pl-11' : 'pl-4'} {showPasswordToggle ? 'pr-11' : 'pr-4'}"
      {id}
      name={name || id}
      type={inputType}
      {placeholder}
      bind:value
      {required}
    />

    {#if showPasswordToggle}
       <button 
          class="absolute right-4 text-slate-400 hover:text-primary transition-colors flex items-center justify-center cursor-pointer" 
          type="button"
          onclick={togglePassword}
          tabindex="-1"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
       >
         {#if isPasswordVisible}
           <EyeOff class="size-5" />
         {:else}
           <Eye class="size-5" />
         {/if}
       </button>
    {/if}
  </div>
</div>
