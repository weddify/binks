<script lang="ts">
  import { AlertTriangle, X } from "lucide-svelte";

  let { 
    isOpen = $bindable(false), 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    onConfirm
  } = $props<{ 
    isOpen: boolean; 
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "info" | "success";
    onConfirm: () => void;
  }>();

  function handleConfirm() {
    onConfirm();
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="modal modal-open z-50">
    <div class="modal-box relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={() => isOpen = false}>
        <X class="size-4" />
      </button>
      
      <div class="flex items-start gap-4">
        {#if type === 'danger'}
          <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
             <AlertTriangle class="size-6" />
          </div>
        {:else}
           <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
             <AlertTriangle class="size-6" />
           </div>
        {/if}

        <div>
           <h3 class="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
           <p class="py-2 text-sm text-slate-500 dark:text-slate-400">
             {message}
           </p>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost text-slate-500 dark:text-slate-400" onclick={() => isOpen = false}>
          {cancelText}
        </button>
        <button 
          class="btn {type === 'danger' ? 'btn-error text-white' : 'btn-primary text-white'}" 
          onclick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
    <div class="modal-backdrop bg-slate-900/50 backdrop-blur-sm" onclick={() => isOpen = false} aria-hidden="true"></div>
  </div>
{/if}
