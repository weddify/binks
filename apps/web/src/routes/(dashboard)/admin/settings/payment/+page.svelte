<script lang="ts">
  import { CreditCard, Save, CircleCheck } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  // Local state
  let settings = $state({
    features: {
      enableCheckout: true,
      enableQRIS: true,
      enableVA: true,
      maintenanceMode: false
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
      <CircleCheck class="size-5 text-emerald-500 mt-0.5" />
      <div>
         <h4 class="font-bold text-slate-900 dark:text-white text-sm">Settings Saved</h4>
         <p class="text-xs text-slate-500 mt-1">Payment settings have been updated.</p>
      </div>
    </div>
  {/if}

  <!-- Right Column (Features & Payments) -->
  <div class="space-y-6 max-w-4xl">
     
     <!-- Feature Toggles -->
     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <CreditCard class="size-5 text-primary" /> Payment & Features
        </h2>
        <div class="space-y-4">
           
           <label class="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
              <div>
                 <div class="font-bold text-slate-900 dark:text-white text-sm">Enable Checkout</div>
                 <div class="text-xs text-slate-500">Allow customers to place orders</div>
              </div>
              <input type="checkbox" bind:checked={settings.features.enableCheckout} class="toggle toggle-primary toggle-sm" />
           </label>

           <label class="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
              <div>
                 <div class="font-bold text-slate-900 dark:text-white text-sm">Accept QRIS</div>
                 <div class="text-xs text-slate-500">Instant QRIS Payment</div>
              </div>
              <input type="checkbox" bind:checked={settings.features.enableQRIS} class="toggle toggle-primary toggle-sm" />
           </label>

           <label class="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
              <div>
                 <div class="font-bold text-slate-900 dark:text-white text-sm">Accept Virtual Accounts</div>
                 <div class="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</div>
              </div>
              <input type="checkbox" bind:checked={settings.features.enableVA} class="toggle toggle-primary toggle-sm" />
           </label>

           <label class="flex items-center justify-between p-3 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
              <div>
                 <div class="font-bold text-red-700 dark:text-red-400 text-sm">Maintenance Mode</div>
                 <div class="text-xs text-red-500/80">Disable site access for customers</div>
              </div>
              <input type="checkbox" bind:checked={settings.features.maintenanceMode} class="toggle toggle-error toggle-sm" />
           </label>

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
