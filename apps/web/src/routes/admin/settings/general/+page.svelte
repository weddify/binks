<script lang="ts">
  import { siteConfig } from '$lib/config';
  import { Save, Globe, MessageCircle, CheckCircle2, MonitorPlay } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  // Local state initialized from config
  let settings = $state({
    name: siteConfig.siteName,
    description: siteConfig.meta.description,
    currency: 'IDR',
    contact: { 
      email: siteConfig.contact.email,
      whatsapp: siteConfig.contact.whatsapp,
      telegram: '' 
    }
  });

  let isSaving = $state(false);
  let showToast = $state(false);

  async function saveSettings() {
    isSaving = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    isSaving = false;
    showToast = true;
    setTimeout(() => showToast = false, 3000);
  }
</script>

<div class="space-y-6 relative">
  <!-- Toast -->
  {#if showToast}
    <div in:slide={{ duration: 300, axis: 'y' }} class="fixed top-24 right-4 z-[60] bg-white dark:bg-slate-800 border-l-4 border-emerald-500 shadow-xl rounded-lg p-4 flex items-start gap-3 max-w-sm">
      <CheckCircle2 class="size-5 text-emerald-500 mt-0.5" />
      <div>
         <h4 class="font-bold text-slate-900 dark:text-white text-sm">Settings Saved</h4>
         <p class="text-xs text-slate-500 mt-1">General configuration has been updated.</p>
      </div>
    </div>
  {/if}

  <!-- Left Column (General & Contact) -->
  <div class="space-y-6 max-w-4xl">
     
     <!-- General Settings -->
     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <Globe class="size-5 text-primary" /> General Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="space-y-1.5">
              <label for="storeName" class="text-xs font-bold text-slate-500 uppercase">Store Name</label>
              <input id="storeName" type="text" bind:value={settings.name} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
           </div>
           <div class="space-y-1.5">
              <label for="currency" class="text-xs font-bold text-slate-500 uppercase">Currency</label>
              <input id="currency" type="text" bind:value={settings.currency} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
           </div>
           <div class="space-y-1.5 md:col-span-2">
              <label for="description" class="text-xs font-bold text-slate-500 uppercase">Description (SEO)</label>
              <textarea id="description" bind:value={settings.description} rows="3" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white resize-none"></textarea>
           </div>
        </div>
     </div>

     <!-- Contact Info -->
     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <MessageCircle class="size-5 text-primary" /> Contact Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="space-y-1.5">
              <label for="whatsapp" class="text-xs font-bold text-slate-500 uppercase">WhatsApp Number</label>
              <input id="whatsapp" type="text" bind:value={settings.contact.whatsapp} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
           </div>
           <div class="space-y-1.5">
              <label for="supportEmail" class="text-xs font-bold text-slate-500 uppercase">Support Email</label>
              <input id="supportEmail" type="email" bind:value={settings.contact.email} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
           </div>
           <div class="space-y-1.5 md:col-span-2">
              <label for="telegram" class="text-xs font-bold text-slate-500 uppercase">Telegram Username</label>
              <input id="telegram" type="text" bind:value={settings.contact.telegram} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
           </div>
        </div>
     </div>



     <!-- Save Button -->
     <button 
        onclick={saveSettings}
        disabled={isSaving}
        class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
     >
        {#if isSaving}
           <div class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           Saving Changes...
        {:else}
           <Save class="size-5" />
           Save Changes
        {/if}
     </button>

  </div>
</div>
