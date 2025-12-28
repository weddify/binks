<script lang="ts">
  import { coupons } from '$lib/data';
  import { Plus, Search, Pencil, Trash2, Tag, Copy, Calendar, CheckCircle, XCircle, X } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';
  import { toast } from 'svelte-sonner';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

  // State
  let allCoupons = $state([...coupons]);
  let searchQuery = $state('');

  // Filtering
  let filteredCoupons = $derived(
    allCoupons.filter(c => 
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Modal State
  let isModalOpen = $state(false);
  let isEditing = $state(false);
  // Default new coupon state
  let currentCoupon = $state({ 
      id: '', 
      code: '', 
      type: 'PERCENTAGE', 
      value: 0, 
      usageLimit: 100, 
      expiryDate: '', 
      isActive: true 
  });

  function formatCurrency(val: number) {
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  function copyCode(code: string) {
      navigator.clipboard.writeText(code);
      toast.success('Copied to clipboard!');
  }

  function openAddModal() {
    isEditing = false;
    currentCoupon = { 
        id: Math.random().toString(36).substr(2, 9), 
        code: '', 
        type: 'PERCENTAGE', 
        value: 0, 
        usageLimit: 100, 
        expiryDate: '', 
        isActive: true 
    };
    isModalOpen = true;
  }

  function openEditModal(coupon: any) {
    isEditing = true;
    currentCoupon = { ...coupon };
    isModalOpen = true;
  }

  let showDeleteConfirm = $state(false);
  let idToDelete = $state('');

  function handleDelete(id: string) {
      idToDelete = id;
      showDeleteConfirm = true;
  }

  function confirmDelete() {
      allCoupons = allCoupons.filter(c => c.id !== idToDelete);
  }

  function toggleStatus(id: string) {
      const idx = allCoupons.findIndex(c => c.id === id);
      if (idx !== -1) {
          // Reactivity trigger using new array ref for simple state usually, 
          // but with runes we can just mutate if it's a deep reactive object or use the updated array
           const updated = [...allCoupons];
           updated[idx].isActive = !updated[idx].isActive;
           allCoupons = updated;
      }
  }
</script>

<div class="space-y-3">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-1">Coupons</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm">Manage discount codes and promotions.</p>
    </div>
    <div class="flex gap-3">
        <Button variant="primary" size="md" class="shadow-lg shadow-primary/30" onclick={openAddModal}>
            <Plus class="size-4 mr-2" />
            Create Coupon
        </Button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="relative w-full sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
              type="text" 
              bind:value={searchQuery}
              placeholder="Search coupon code..." 
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
      </div>
  </div>

  <!-- Coupon List -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {#each filteredCoupons as coupon}
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden group relative hover:border-primary/50 transition-colors">
              <!-- Active Status Strip -->
              <div class="absolute left-0 top-0 bottom-0 w-1 {coupon.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>
              
              <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                      <div class="bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white font-mono font-bold px-3 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center gap-2">
                          <Tag class="size-3.5 text-primary" />
                          {coupon.code}
                          <button class="text-slate-400 hover:text-primary transition-colors ml-1" onclick={() => copyCode(coupon.code)} title="Copy Code">
                              <Copy class="size-3" />
                          </button>
                      </div>
                      <div class="flex items-center gap-1">
                          <button class="p-1.5 text-slate-400 hover:text-primary transition-colors" onclick={() => openEditModal(coupon)}>
                              <Pencil class="size-4" />
                          </button>
                          <button class="p-1.5 text-slate-400 hover:text-red-500 transition-colors" onclick={() => handleDelete(coupon.id)}>
                              <Trash2 class="size-4" />
                          </button>
                      </div>
                  </div>

                  <div class="mb-4">
                       <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-1">
                           {#if coupon.type === 'PERCENTAGE'}
                               {coupon.value}% OFF
                           {:else}
                               {formatCurrency(coupon.value)} OFF
                           {/if}
                       </h3>
                       <p class="text-xs text-slate-500 dark:text-slate-400">
                           {#if coupon.type === 'PERCENTAGE' && coupon.maxDiscount}
                               Max discount {formatCurrency(coupon.maxDiscount)}
                           {:else if coupon.minPurchase}
                               Min. purchase {formatCurrency(coupon.minPurchase)}
                           {:else}
                               Apply to all orders
                           {/if}
                       </p>
                  </div>

                  <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div class="flex items-center gap-1.5">
                          <Calendar class="size-3.5" />
                          <span>Exp: {new Date(coupon.expiryDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div class="flex items-center gap-1.5 font-medium">
                          <span class="{coupon.usedCount >= coupon.usageLimit ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}">
                              {coupon.usedCount} / {coupon.usageLimit}
                          </span>
                          used
                      </div>
                  </div>
              </div>
              
              <!-- Footer Actions -->
              <div class="bg-slate-50 dark:bg-slate-900/30 px-6 py-3 flex items-center justify-between">
                   <span class="text-xs font-bold uppercase tracking-wider {coupon.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}">
                       {coupon.isActive ? 'Active' : 'Inactive'}
                   </span>
                   <button 
                      class="text-xs font-bold hover:underline transition-all {coupon.isActive ? 'text-red-500' : 'text-emerald-500'}"
                      onclick={() => toggleStatus(coupon.id)}
                   >
                       {coupon.isActive ? 'Deactivate' : 'Activate'}
                   </button>
              </div>
          </div>
      {/each}
      
      <!-- Add New Card (Optional visual cue) -->
      <button onclick={openAddModal} class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[200px] group">
          <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
              <Plus class="size-6" />
          </div>
          <span class="font-bold text-sm">Create New Coupon</span>
      </button>
  </div>
</div>

<!-- Modal -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <button onclick={() => isModalOpen = false} class="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X class="size-5" />
                </button>
            </div>
            
            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Coupon Code
                        <div class="relative mt-1">
                            <input type="text" bind:value={currentCoupon.code} class="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. SALE50" />
                            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">CODE</div>
                        </div>
                    </label>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Type
                            <select bind:value={currentCoupon.type} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount (Rp)</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Value
                            <input type="number" bind:value={currentCoupon.value} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
                        </label>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Usage Limit
                            <input type="number" bind:value={currentCoupon.usageLimit} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </label>
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Expiry Date (Time)
                            <input 
                                type="datetime-local" 
                                bind:value={currentCoupon.expiryDate} 
                                onclick={(e) => e.currentTarget.showPicker()}
                                class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer" 
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-3">
                <Button variant="outline" size="sm" onclick={() => isModalOpen = false}>Cancel</Button>
                <Button variant="primary" size="sm" onclick={() => { isModalOpen = false; /* Save Logic */ }}>
                    {isEditing ? 'Save Changes' : 'Create Coupon'}
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes scale-up {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in {
        animation: fade-in 0.2s ease-out;
    }
    .animate-scale-up {
        animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
</style>

<ConfirmModal 
  bind:isOpen={showDeleteConfirm}
  title="Delete Coupon"
  message="Are you sure you want to delete this coupon? This action cannot be undone."
  confirmText="Delete"
  type="danger"
  onConfirm={confirmDelete}
/>
