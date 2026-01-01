<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
      type?: 'button' | 'submit' | 'reset';
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
      href?: string;
      size?: 'sm' | 'md' | 'lg' | 'icon';
      disabled?: boolean;
      loading?: boolean;
      fullWidth?: boolean;
      class?: string;
      children?: Snippet;
      onclick?: (event: MouseEvent) => void;
      [key: string]: any;
  }

  let { 
      type = 'button', 
      variant = 'primary', 
      href, 
      size = 'md', 
      disabled = false, 
      loading = false, 
      fullWidth = false,
      class: className = '',
      children,
      onclick,
      ...rest 
  }: Props = $props();

  // Base styles
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  // Size styles
  const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-4 py-2 text-sm", 
      lg: "px-5 py-2.5 text-base",
      icon: "p-2"
  };

  // Variant styles
  const variantClasses = {
      primary: "bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600",
      secondary: "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
      outline: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
      ghost: "text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
      danger: "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
  };

  // Computed classes
  let classes = $derived([
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth ? 'w-full' : '',
      className
  ].join(' '));

  function handleClick(event: MouseEvent) {
      if (!disabled && !loading && onclick) {
          onclick(event);
      }
  }
</script>

{#if href}
  <a {href} class={classes} {...rest}>
      {#if loading}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      {/if}
      {@render children?.()}
  </a>
{:else}
  <button {type} class={classes} {disabled} onclick={handleClick} {...rest}>
      {#if loading}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      {/if}
      {@render children?.()}
  </button>
{/if}
