<script lang="ts">
  // Admin Dashboard Logic
  import { userOrders, products } from '$lib/data';
  import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, TrendingUp } from 'lucide-svelte';
  import SalesChart from '$lib/components/admin/SalesChart.svelte';
  import StockWidget from '$lib/components/admin/StockWidget.svelte';

  // Omit CheckCircle import to avoid error if not used, or import if needed
  
  // Mock Simulations
  const totalRevenue = userOrders.reduce((acc, order) => acc + (order.status === 'PAID' ? order.total : 0), 0) + 1500000; // Add baseline
  const totalOrders = userOrders.length + 124;
  const activeProducts = products.length;
  const totalCustomers = 45;

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
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Overview of your store performance.</p>
     </div>
     <div class="flex gap-3">
        <button class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
           Last 30 Days
        </button>
        <button class="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 transition-all transform active:scale-95">
           Download Report
        </button>
     </div>
  </div>

   <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
     <!-- Revenue -->
     <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
        <div class="flex items-start justify-between">
            <div class="flex flex-col min-w-0">
                <span class="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Total Revenue</span>
                <h3 class="text-xl xl:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate" title={formatPrice(totalRevenue)}>{formatPrice(totalRevenue)}</h3>
            </div>
            <div class="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 flex-shrink-0 ml-2">
                 <DollarSign class="size-5" />
            </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
             <span class="text-emerald-700 dark:text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                <ArrowUpRight class="size-3" /> +12.5%
             </span>
             <span class="text-slate-400 ml-2">vs last month</span>
        </div>
     </div>

     <!-- Orders -->
     <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
        <div class="flex items-start justify-between">
            <div class="flex flex-col min-w-0">
                <span class="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Total Orders</span>
                <h3 class="text-xl xl:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{totalOrders}</h3>
            </div>
            <div class="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 flex-shrink-0 ml-2">
                 <ShoppingCart class="size-5" />
            </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
             <span class="text-emerald-700 dark:text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                <ArrowUpRight class="size-3" /> +8.2%
             </span>
             <span class="text-slate-400 ml-2">vs last month</span>
        </div>
     </div>

     <!-- Products -->
     <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
        <div class="flex items-start justify-between">
            <div class="flex flex-col min-w-0">
                <span class="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Active Products</span>
                <h3 class="text-xl xl:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{activeProducts}</h3>
            </div>
            <div class="size-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800/50 flex-shrink-0 ml-2">
                 <Package class="size-5" />
            </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
             <span class="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 rounded font-medium">
                Inventory OK
             </span>
        </div>
     </div>

     <!-- Customers -->
     <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
        <div class="flex items-start justify-between">
            <div class="flex flex-col min-w-0">
                <span class="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Total Customers</span>
                <h3 class="text-xl xl:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{totalCustomers}</h3>
            </div>
            <div class="size-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800/50 flex-shrink-0 ml-2">
                 <Users class="size-5" />
            </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
             <span class="text-emerald-700 dark:text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                <ArrowUpRight class="size-3" /> +24%
             </span>
             <span class="text-slate-400 ml-2">vs last month</span>
        </div>
     </div>
  </div>

  <!-- Analytics & Content Grid -->
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      <!-- Left Column: Sales & Recent Orders -->
      <div class="xl:col-span-2 space-y-6">
          <!-- Sales Chart -->
          <SalesChart />

          <!-- Recent Orders Table -->
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
             <div class="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
                <h5 class="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h5>
                <a href="/admin/orders" class="btn btn-xs btn-ghost text-primary hover:text-primary-focus transition-all">
                    View All
                </a>
             </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left">
                   <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                      <tr>
                         <th class="px-5 py-3 border-none">Order ID</th>
                         <th class="px-5 py-3 border-none">Customer</th>
                         <th class="px-5 py-3 border-none">Items</th>
                         <th class="px-5 py-3 border-none">Total</th>
                         <th class="px-5 py-3 border-none">Status</th>
                         <th class="px-5 py-3 border-none">Date</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {#each userOrders.slice(0, 5) as order}
                         <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                            <td class="px-5 py-3 font-mono text-xs font-bold text-primary">#{order.id}</td>
                            <td class="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">Guest User</td>
                            <td class="px-5 py-3 text-sm text-slate-500">
                               <span class="truncate max-w-[150px] block" title={order.items}>{order.items}</span>
                            </td>
                            <td class="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">{formatPrice(order.total)}</td>
                            <td class="px-5 py-3">
                               <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase
                                  {order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                                   order.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                                  {order.status}
                               </span>
                            </td>
                            <td class="px-5 py-3 text-xs text-slate-400">{order.date}</td>
                         </tr>
                      {/each}
                   </tbody>
                </table>
             </div>
          </div>
      </div>

      <!-- Right Column: Stock Widget -->
      <div class="h-full">
          <StockWidget products={products} />
      </div>

  </div>

</div>
