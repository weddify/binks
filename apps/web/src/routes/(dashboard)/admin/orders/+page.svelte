<script lang="ts">
  import { userOrders } from '$lib/data';
  import type { Order } from '$lib/data';
  import Button from '$lib/components/Button.svelte';
  import { Search, Filter, Eye, CheckCircle2, XCircle, MoreHorizontal, ArrowUpRight, X, Calendar, CreditCard, ShoppingBag, User } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  let searchQuery = '';
  let statusFilter = 'ALL'; // ALL, PAID, PENDING, FAILED
  let selectedOrder: Order | null = null;
  let isModalOpen = false;

  $: filteredOrders = userOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.items.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  function openOrderDetails(order: Order) {
    selectedOrder = order;
    isModalOpen = true;
  }

  function closeOrderDetails() {
    isModalOpen = false;
    setTimeout(() => {
      selectedOrder = null;
    }, 200);
  }
</script>

<div class="space-y-3">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
     <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Orders</h1>
        <p class="text-slate-500 text-xs font-medium">Manage and process customer orders.</p>
     </div>
     <div class="flex gap-2">
        <Button variant="outline">
           Export CSV
        </Button>
     </div>
  </div>

  <!-- Search & Filter Bar -->
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
     <div class="relative w-full sm:max-w-xs">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input 
           type="text" 
           bind:value={searchQuery}
           placeholder="Search Order ID, User, or Item..." 
           class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
     </div>
     
     <div class="flex bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
        {#each ['ALL', 'PAID', 'PENDING', 'FAILED'] as status}
           <button 
              class="px-3 py-1.5 rounded-md text-[10px] font-bold transition-all {statusFilter === status ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
              onclick={() => statusFilter = status}
           >
              {status}
           </button>
        {/each}
     </div>
  </div>

  <!-- Orders Table -->
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
     <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
           <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Order ID</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">User</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 hidden xl:table-cell">Items</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 hidden xl:table-cell">Date</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Total</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 hidden xl:table-cell">Payment</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Status</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-right">Actions</th>
              </tr>
           </thead>
           <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              {#each filteredOrders as order}
                 <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="px-6 py-4 text-xs font-mono font-bold text-blue-600">
                       <button 
                         onclick={() => openOrderDetails(order)}
                         class="hover:underline focus:outline-none"
                       >
                         #{order.id}
                       </button>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="size-8 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                {#if order.user?.avatar}
                                    <img src={order.user.avatar} alt={order.user.name} class="w-full h-full object-cover" />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-slate-400">
                                        <User class="size-4" />
                                    </div>
                                {/if}
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{order.user?.name || 'Guest'}</span>
                                <span class="text-[10px] text-slate-500 truncate max-w-[120px]">{order.user?.email || 'No email'}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 hidden xl:table-cell">
                       <div class="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]" title={order.items}>
                          {order.items}
                       </div>
                       {#if order.products && order.products.length > 1}
                          <div class="text-[10px] text-slate-500 font-bold mt-0.5">
                             + {order.products.length - 1} more items
                          </div>
                       {/if}
                    </td>
                    <td class="px-6 py-4 text-xs text-slate-500 hidden xl:table-cell">{order.date}</td>
                    <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-500 hidden xl:table-cell">{order.paymentMethod || '-'}</td>
                    <td class="px-6 py-4">
                       <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          {order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                           order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                           'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                          {order.status}
                       </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                       <div class="flex items-center justify-end gap-2">
                          {#if order.status === 'PENDING'}
                             <button class="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors" title="Approve Payment">
                                <CheckCircle2 class="size-4" />
                             </button>
                             <button class="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors" title="Reject">
                                <XCircle class="size-4" />
                             </button>
                          {/if}
                          <button 
                            onclick={() => openOrderDetails(order)}
                            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                             <ArrowUpRight class="size-4" />
                          </button>
                       </div>
                    </td>
                 </tr>
              {/each}
           </tbody>
        </table>

        {#if filteredOrders.length === 0}
           <div class="py-12 text-center text-slate-500">
              <p class="font-medium">No orders found.</p>
           </div>
        {/if}
     </div>
  </div>
</div>

<!-- Order Details Modal -->
{#if isModalOpen && selectedOrder}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
        class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onclick={closeOrderDetails}
        transition:fade
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Escape' && closeOrderDetails()}
    ></div>

    <!-- Modal Content -->
    <div 
        class="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        transition:scale={{ start: 0.95, duration: 200 }}
    >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
            <div>
                <h2 class="text-xl font-black text-slate-900 dark:text-white">Order Details</h2>
                <div class="flex items-center gap-2 mt-1">
                    <span class="font-mono text-sm font-bold text-blue-600">#{selectedOrder.id}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase
                        {selectedOrder.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                         selectedOrder.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                         'bg-red-100 text-red-700'}">
                        {selectedOrder.status}
                    </span>
                </div>
            </div>
            <button onclick={closeOrderDetails} class="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X class="size-5" />
            </button>
        </div>

        <!-- Scrollable Content -->
        <div class="p-6 overflow-y-auto space-y-6">
            
            <!-- User Info -->
            <div class="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div class="size-10 rounded-full bg-white dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm">
                    {#if selectedOrder.user?.avatar}
                        <img src={selectedOrder.user.avatar} alt={selectedOrder.user.name} class="w-full h-full object-cover" />
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-slate-400">
                            <User class="size-5" />
                        </div>
                    {/if}
                </div>
                <div>
                    <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer</div>
                    <div class="font-bold text-slate-900 dark:text-white">{selectedOrder.user?.name || 'Guest'}</div>
                    <div class="text-sm text-slate-500">{selectedOrder.user?.email || 'No email provided'}</div>
                </div>
            </div>

            <!-- Meta Grid -->
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Calendar class="size-3.5" /> Date
                    </div>
                    <div class="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.date}</div>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <CreditCard class="size-3.5" /> Payment
                    </div>
                    <div class="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.paymentMethod}</div>
                    <div class="text-xs text-slate-500 mt-1">Total: {formatPrice(selectedOrder.total)}</div>
                </div>
            </div>

            <!-- Order Items -->
            <div>
                 <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    <ShoppingBag class="size-3.5" /> Purchased Items
                 </div>
                 <div class="space-y-3">
                    {#if selectedOrder.products}
                        {#each selectedOrder.products as product}
                            <div class="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900/50 transition-colors">
                                <img src={product.image} alt={product.title} class="size-12 rounded-lg object-cover bg-slate-100" />
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-bold text-slate-900 dark:text-white truncate">{product.title}</div>
                                    <div class="text-xs text-slate-500">{product.variant}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</div>
                                    <div class="text-xs text-slate-500">x{product.quantity}</div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="text-sm text-slate-500 italic">Product details not available.</div>
                    {/if}
                 </div>
            </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex gap-3">
            <button onclick={closeOrderDetails} class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Close
            </button>
            {#if selectedOrder.status === 'PENDING'}
                <button class="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                    Approve Order
                </button>
            {/if}
        </div>
    </div>
  </div>
{/if}