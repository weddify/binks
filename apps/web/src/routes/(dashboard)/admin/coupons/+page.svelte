<script lang="ts">
  import { coupons } from '$lib/data';
  import { Plus, Search, Tag, Copy, Calendar, CircleCheck, CircleX, X, LayoutGrid, List } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import Button from '$lib/components/Button.svelte';
  import ActionButtons from '$lib/components/admin/ActionButtons.svelte';
  import Card from '$lib/components/admin/Card.svelte';
  import TableLayout from '$lib/components/admin/TableLayout.svelte';
  import Header from '$lib/components/admin/Header.svelte';
  import { toast } from 'svelte-sonner';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

  // State
  let allCoupons = $state([...coupons]);
  let searchQuery = $state('');
  let viewMode = $state<'list' | 'grid'>('grid');

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
      maxDiscount: 0,
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
        maxDiscount: 0,
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
  <!-- Header -->
  <Header 
      title="Coupons" 
      subtitle="Manage discount codes and promotions."
  >
      {#snippet actions()}
         <Button variant="primary" size="md" class="shadow-lg shadow-primary/30" onclick={openAddModal}>
            <Plus class="size-4 mr-2" />
            Create Coupon
         </Button>
      {/snippet}
  </Header>


  <!-- Table Layout -->
  <TableLayout
      bind:searchQuery={searchQuery}
      placeholder="Search coupon code..."
  >
      {#snippet actions()}
          <div class="flex gap-2">
              <button 
                class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 {viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : ''} transition-colors"
                onclick={() => viewMode = 'list'}
                aria-label="List View"
              >
                  <List class="size-4" />
              </button>
              <button 
                class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 {viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : ''} transition-colors"
                onclick={() => viewMode = 'grid'}
                 aria-label="Grid View"
              >
                  <LayoutGrid class="size-4" />
              </button>
          </div>
      {/snippet}

      <!-- Coupon List -->
      {#if viewMode === 'list'}
        <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700">
                <tr>
                    <th class="px-6 py-4">Code</th>
                    <th class="px-6 py-4">Discount</th>
                    <th class="px-6 py-4">Usage</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                {#each filteredCoupons as coupon}
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <div class="bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white font-mono font-bold px-2 py-1 rounded text-xs border border-dashed border-slate-300 dark:border-slate-600 flex items-center gap-1.5">
                                    <Tag class="size-3" />
                                    {coupon.code}
                                </div>
                                <button class="text-slate-400 hover:text-primary transition-colors" onclick={() => copyCode(coupon.code)} title="Copy Code">
                                    <Copy class="size-3" />
                                </button>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-bold text-slate-900 dark:text-white">
                                {#if coupon.type === 'PERCENTAGE'}
                                    {coupon.value}% OFF
                                {:else}
                                    {formatCurrency(coupon.value)} OFF
                                {/if}
                            </div>
                            <div class="text-xs text-slate-500">
                                {#if coupon.type === 'PERCENTAGE' && coupon.maxDiscount}
                                    Max: {formatCurrency(coupon.maxDiscount)}
                                {:else if coupon.minPurchase}
                                    Min: {formatCurrency(coupon.minPurchase)}
                                {/if}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-col text-xs">
                                <span class="font-medium {coupon.usedCount >= coupon.usageLimit ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}">
                                    {coupon.usedCount} / {coupon.usageLimit} used
                                </span>
                                <span class="text-slate-400">Exp: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <button onclick={() => toggleStatus(coupon.id)} class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold {coupon.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}">
                                {coupon.isActive ? 'Active' : 'Inactive'}
                            </button>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <ActionButtons 
                                onEdit={() => openEditModal(coupon)}
                                onDelete={() => handleDelete(coupon.id)}
                            />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
      {:else}
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50">
          {#each filteredCoupons as coupon}
              <Card class="{!coupon.isActive ? 'opacity-75 grayscale' : ''} transition-all duration-300 relative group overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md">
                  <!-- Status Stripe -->
                  <div class="absolute left-0 top-0 bottom-0 w-1 {coupon.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}"></div>
                  
                  <div class="flex justify-between items-start mb-4">
                      <div class="bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-white font-mono font-bold px-3 py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center gap-2">
                          <Tag class="size-3.5 text-primary" />
                          {coupon.code}
                          <button class="text-slate-400 hover:text-primary transition-colors ml-1" onclick={() => copyCode(coupon.code)} title="Copy Code">
                              <Copy class="size-3" />
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

                  {#snippet footer()}
                       <div class="flex items-center justify-between w-full">
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
                  {/snippet}
              </Card>
          {/each}
          
          <!-- Add New Card (Optional visual cue) -->
          <button onclick={openAddModal} class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[200px] group bg-white dark:bg-slate-800">
              <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                  <Plus class="size-6" />
              </div>
              <span class="font-bold text-sm">Create New Coupon</span>
          </button>
      </div>
      {/if}
  </TableLayout>
</div>

<!-- Modal -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{isEditing ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <button onclick={() => isModalOpen = false} class="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X class="size-5" />
                </button>
            </div>
            
            <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Coupon Code
                        <div class="relative mt-1">
                            <input type="text" bind:value={currentCoupon.code} class="w-full pl-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="e.g. SALE50" />
                            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">CODE</div>
                        </div>
                    </label>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Type
                            <select bind:value={currentCoupon.type} class="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount (Rp)</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Value
                            <input type="number" bind:value={currentCoupon.value} class="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="0" />
                        </label>
                    </div>
                </div>

                <!-- Max Discount (Only for Percentage) -->
                {#if currentCoupon.type === 'PERCENTAGE'}
                    <div transition:slide>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Maximum Discount (Optional)
                            <div class="relative mt-1">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                                <input type="number" bind:value={currentCoupon.maxDiscount} class="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="Leave empty for no limit" />
                            </div>
                            <p class="text-[10px] text-slate-500 mt-1">The discount will not exceed this amount, even if the percentage calculation is higher.</p>
                        </label>
                    </div>
                {/if}

                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Usage Limit
                            <input type="number" bind:value={currentCoupon.usageLimit} class="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
                        </label>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Expiry Date (Time)
                            <input 
                                type="datetime-local" 
                                bind:value={currentCoupon.expiryDate} 
                                onclick={(e) => e.currentTarget.showPicker()}
                                class="w-full mt-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer placeholder:text-slate-400" 
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
