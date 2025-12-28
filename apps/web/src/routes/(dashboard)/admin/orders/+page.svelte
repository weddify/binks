<script lang="ts">
  import { userOrders } from '$lib/data';
  import Button from '$lib/components/Button.svelte';
  import { Search, Filter, Eye, CheckCircle2, XCircle, MoreHorizontal, ArrowUpRight } from 'lucide-svelte';

  let searchQuery = '';
  let statusFilter = 'ALL'; // ALL, PAID, PENDING, FAILED

  $: filteredOrders = userOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    
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
           placeholder="Search by Order ID or Item..." 
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
        <table class="max-w-3xl text-left border-collapse">
           <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Order ID</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Items</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Date</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Total</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Payment</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Status</th>
                 <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-right">Actions</th>
              </tr>
           </thead>
           <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              {#each filteredOrders as order}
                 <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="px-6 py-4 text-xs font-mono font-bold text-blue-600">
                       <a href="/order/{order.id}" class="hover:underline">#{order.id}</a>
                    </td>
                    <td class="px-6 py-4">
                       <div class="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]" title={order.items}>
                          {order.items}
                       </div>
                       {#if order.products && order.products.length > 1}
                          <div class="text-[10px] text-slate-500 font-bold mt-0.5">
                             + {order.products.length - 1} more items
                          </div>
                       {/if}
                    </td>
                    <td class="px-6 py-4 text-xs text-slate-500">{order.date}</td>
                    <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-500">{order.paymentMethod || '-'}</td>
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
                          <a href="/order/{order.id}" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="View Details">
                             <ArrowUpRight class="size-4" />
                          </a>
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