<script lang="ts">
  import { Pencil, Trash2, Eye } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';

  // Props
  interface Props {
    onEdit?: () => void;
    editUrl?: string;
    onDelete?: () => void;
    onView?: () => void;
    viewUrl?: string;
    customActions?: {
      icon: ComponentType;
      label: string;
      onClick: () => void;
      color?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'default';
    }[];
    class?: string;
  }

  let { 
    onEdit, 
    editUrl, 
    onDelete, 
    onView, 
    viewUrl, 
    customActions = [], 
    class: className = '' 
  }: Props = $props();

  // Helper to get color classes
  function getColorClasses(color: string = 'default') {
    switch (color) {
      case 'primary': return 'hover:text-primary hover:bg-primary/10';
      case 'danger': return 'hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
      case 'success': return 'hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20';
      case 'warning': return 'hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20';
      case 'info': return 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
      default: return 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700';
    }
  }

  const baseClass = "p-1.5 text-slate-400 rounded-lg transition-colors";
</script>

<div class="flex items-center justify-end gap-1.5 {className}">
  <!-- View Action -->
  {#if viewUrl}
    <a 
      href={viewUrl}
      class="{baseClass} hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
      title="View Details"
    >
      <Eye class="size-4" />
    </a>
  {:else if onView}
    <button 
      class="{baseClass} hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
      onclick={onView}
      title="View Details"
    >
      <Eye class="size-4" />
    </button>
  {/if}

  <!-- Edit Action -->
  {#if editUrl}
    <a 
      href={editUrl}
      class="{baseClass} hover:text-primary hover:bg-primary/10" 
      title="Edit"
    >
      <Pencil class="size-4" />
    </a>
  {:else if onEdit}
    <button 
      class="{baseClass} hover:text-primary hover:bg-primary/10" 
      onclick={onEdit}
      title="Edit"
    >
      <Pencil class="size-4" />
    </button>
  {/if}

  <!-- Custom Actions -->
  {#each customActions as action}
    <button 
      class="{baseClass} {getColorClasses(action.color)}" 
      onclick={action.onClick}
      title={action.label}
    >
      <action.icon class="size-4" />
    </button>
  {/each}

  <!-- Delete Action -->
  {#if onDelete}
    <button 
      class="{baseClass} hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" 
      onclick={onDelete}
      title="Delete"
    >
      <Trash2 class="size-4" />
    </button>
  {/if}
</div>
