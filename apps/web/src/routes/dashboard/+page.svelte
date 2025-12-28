<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { userOrders } from '$lib/data';
  import { User, Package, Settings, LogOut, ChevronRight, Clock, CheckCircle2, XCircle, Search, Library, LifeBuoy, Copy, ChevronDown, ChevronUp, ExternalLink, Download, List } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  let activeTab = 'orders';
  let filterStatus = 'ALL';
  let searchQuery = '';
  let currentPage = 1;
  let itemsPerPage = 5;

  $: filteredOrders = userOrders.filter(o => {
      const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.items.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
  });

  $: totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  $: currentItems = filteredOrders.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  function getStatusColor(status: string) {
     switch(status) {
        case 'PAID': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
        case 'PENDING': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
        default: return 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
     }
  }

  function getStatusIcon(status: string) {
     switch(status) {
        case 'PAID': return CheckCircle2;
        case 'PENDING': return Clock;
        default: return XCircle;
     }
  }

  // Profile State
  let profile = {
    fullname: "Guest User",
    email: "guest@example.com",
    phone: "",
    currentPassword: "",
    newPassword: "",
    notifyOrderUpdates: true,
    notifyPromotions: false
  };

  let isSaving = false;
  let showToast = false;

  async function saveSettings() {
    isSaving = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    isSaving = false;
    showToast = true;
    
    // Hide toast after 3s
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }
</script>

<div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans relative">
  <!-- Toast Notification -->
  {#if showToast}
    <div in:slide={{ duration: 300, axis: 'y' }} class="fixed top-24 right-4 z-50 bg-white dark:bg-slate-800 border-l-4 border-emerald-500 shadow-xl rounded-lg p-4 flex items-start gap-3 max-w-sm">
      <CheckCircle2 class="size-5 text-emerald-500 mt-0.5" />
      <div>
         <h4 class="font-bold text-slate-900 dark:text-white text-sm">Settings Saved</h4>
         <p class="text-xs text-slate-500 mt-1">Your profile information has been updated successfully.</p>
      </div>
      <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onclick={() => showToast = false}>
         <XCircle class="size-4" />
      </button>
    </div>
  {/if}

  <Navbar />

  <main class="flex-grow container mx-auto px-4 py-8">
     
     <div class="flex flex-col md:flex-row gap-6 max-w-screen-lp mx-auto">
        
         <!-- Sidebar (Desktop) -->
         <div class="hidden md:block w-64 flex-shrink-0 space-y-4">
            <!-- Profile Card -->
            <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
               <div class="size-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-primary">
                  <User class="size-10" />
               </div>
               <h2 class="font-bold text-slate-900 dark:text-white">{profile.fullname}</h2>
               <p class="text-xs text-slate-500 mb-4">Member since Dec 2023</p>
               <div class="flex justify-center gap-2">
                  <div class="text-xs font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">Platinum</div>
               </div>
            </div>

            <!-- Menu -->
            <nav class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
               <button 
                  class="w-full flex items-center gap-3 p-4 text-sm font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors {activeTab === 'orders' ? 'text-primary bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 border-l-4 border-transparent'}"
                  onclick={() => activeTab = 'orders'}
               >
                  <Package class="size-4" /> My Orders
               </button>
               <button 
                  class="w-full flex items-center gap-3 p-4 text-sm font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors {activeTab === 'library' ? 'text-primary bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 border-l-4 border-transparent'}"
                  onclick={() => activeTab = 'library'}
               >
                  <Library class="size-4" /> My Items
               </button>
               <button 
                  class="w-full flex items-center gap-3 p-4 text-sm font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors {activeTab === 'settings' ? 'text-primary bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 border-l-4 border-transparent'}"
                  onclick={() => activeTab = 'settings'}
               >
                  <Settings class="size-4" /> Settings
               </button>
               <button 
                  class="w-full flex items-center gap-3 p-4 text-sm font-bold text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors {activeTab === 'support' ? 'text-primary bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-primary' : 'text-slate-600 dark:text-slate-400 border-l-4 border-transparent'}"
                  onclick={() => activeTab = 'support'}
               >
                  <LifeBuoy class="size-4" /> Help Center
               </button>
               <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
               <button class="w-full flex items-center gap-3 p-4 text-sm font-bold text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut class="size-4" /> Logout
               </button>
            </nav>
         </div>

         <!-- Mobile Tabs & Compact Header -->
         <div class="md:hidden w-full space-y-4">
             <!-- Compact Profile Strip -->
             <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                 <div class="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <User class="size-6" />
                 </div>
                 <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-slate-900 dark:text-white truncate">{profile.fullname}</h2>
                    <div class="flex items-center gap-2">
                       <span class="text-xs text-slate-500">Platinum Member</span>
                    </div>
                 </div>
                 <button class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut class="size-5" />
                 </button>
             </div>

             <!-- Navigation Tabs -->
             <div class="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                <button 
                   class="flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 {activeTab === 'orders' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}"
                   onclick={() => activeTab = 'orders'}
                >
                   <Package class="size-4" /> My Orders
                </button>
                <button 
                   class="flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 {activeTab === 'library' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}"
                   onclick={() => activeTab = 'library'}
                >
                   <Library class="size-4" /> Items
                </button>
                <button 
                   class="flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 {activeTab === 'settings' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}"
                   onclick={() => activeTab = 'settings'}
                >
                   <Settings class="size-4" /> Settings
                </button>
                <button 
                   class="flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 {activeTab === 'support' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}"
                   onclick={() => activeTab = 'support'}
                >
                   <LifeBuoy class="size-4" /> Help
                </button>
             </div>
         </div>

        <!-- Main Content -->
        <div class="flex-1">
           {#if activeTab === 'orders'}
              <div in:slide class="space-y-4">
                 <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">My Orders</h1>
                 
                 <!-- Stats Row -->
                 <div class="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                       <div class="text-xs text-slate-500 font-bold uppercase mb-1">Total Spent</div>
                       <div class="text-lg font-black text-slate-900 dark:text-white">IDR 2.4M</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                       <div class="text-xs text-slate-500 font-bold uppercase mb-1">Orders</div>
                       <div class="text-lg font-black text-slate-900 dark:text-white">12</div>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                       <div class="text-xs text-slate-500 font-bold uppercase mb-1">Points</div>
                       <div class="text-lg font-black text-amber-500">450</div>
                    </div>
                 </div>

                 <div class="space-y-4">
                     <!-- Controls: Filter & Items Per Page -->
                     <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <!-- Filters -->
                        <div class="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg overflow-x-auto max-w-full">
                           {#each ['ALL', 'PAID', 'PENDING', 'EXPIRED'] as status}
                              <button 
                                 class="px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap {filterStatus === status ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
                                 onclick={() => { filterStatus = status; currentPage = 1; }}
                              >
                                 {status === 'ALL' ? 'All Orders' : status}
                              </button>
                           {/each}
                        </div>

                        <!-- Search -->
                        <div class="flex-1 w-full sm:w-auto relative group">
                           <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                           <input 
                              type="text" 
                              placeholder="Search by ID or Item..." 
                              bind:value={searchQuery}
                              class="w-full px-4 pl-9 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                           />
                        </div>
                        
                        <!-- Items Per Page -->
                        <!-- Items Per Page -->
                        <div class="flex items-center gap-3">
                           <span class="text-xs font-bold text-slate-500 whitespace-nowrap">Rows per page:</span>
                           <div class="relative">
                              <select 
                                 bind:value={itemsPerPage} 
                                 onchange={() => currentPage = 1}
                                 class="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                              >
                                 <option value={5}>5</option>
                                 <option value={10}>10</option>
                                 <option value={15}>15</option>
                              </select>
                              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                 <ChevronRight class="size-3.5 rotate-90" />
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Order List -->
                     <div class="space-y-3">
                        {#if currentItems.length > 0}
                           {#each currentItems as order (order.id)}
                              <div transition:slide class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                 <div class="flex items-start justify-between mb-2">
                                    <div>
                                       <div class="flex items-center gap-2 mb-1">
                                           <span class="text-xs font-mono font-bold text-slate-400">#{order.id}</span>
                                           <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                                           <span class="text-xs text-slate-500">{order.date}</span>
                                       </div>
                                       <h3 class="font-bold text-slate-900 dark:text-white text-sm">{order.items}</h3>
                                    </div>
                                    <div class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 {getStatusColor(order.status)}">
                                       <svelte:component this={getStatusIcon(order.status)} class="size-3" />
                                       {order.status}
                                    </div>
                                 </div>
                                 
                                 <div class="flex items-center justify-between mt-4">
                                    <div class="text-sm font-bold text-slate-900 dark:text-white">
                                       {formatPrice(order.total)}
                                    </div>
                                    <div>
                                       {#if order.status === 'PENDING'}
                                          <a href="/invoice/{order.id}" class="inline-flex items-center px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                                             Pay Now <ChevronRight class="size-3 ml-1" />
                                          </a>
                                       {:else}
                                          <a href="/order/{order.id}" class="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                             View Details
                                          </a>
                                       {/if}
                                    </div>
                                 </div>
                              </div>
                           {/each}
                        {:else}
                           <div class="py-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                              <Package class="size-10 text-slate-300 mx-auto mb-3" />
                              <p class="text-slate-500 text-sm">No orders found.</p>
                           </div>
                        {/if}
                     </div>

                     <!-- Pagination -->
                     {#if totalPages > 1}
                        <div class="flex justify-center items-center gap-2 pt-2">
                           <button 
                              class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={currentPage === 1}
                              onclick={() => currentPage--}
                           >
                              <ChevronRight class="size-4 rotate-180" />
                           </button>
                           
                           <span class="text-xs font-bold text-slate-500">
                              Page {currentPage} of {totalPages}
                           </span>

                           <button 
                              class="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={currentPage === totalPages}
                              onclick={() => currentPage++}
                           >
                              <ChevronRight class="size-4" />
                           </button>
                        </div>
                     {/if}
                 </div>
              </div>
           {:else if activeTab === 'library'}
               <!-- MY ITEMS / LIBRARY -->
               <div in:slide class="space-y-6">
                  <div class="flex items-center justify-between">
                      <h1 class="text-2xl font-black text-slate-900 dark:text-white">My Items</h1>
                      <div class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold rounded-full">
                         3 Active
                      </div>
                  </div>

                  <!-- Mock Library Items -->
                  <div class="grid grid-cols-1 gap-4">
                     <!-- Item 1 -->
                     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <div class="flex items-start gap-4">
                           <div class="size-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs">
                              NFLX
                           </div>
                           <div class="flex-1">
                              <h3 class="font-bold text-slate-900 dark:text-white">Netflix Premium (1 Month)</h3>
                              <p class="text-xs text-slate-500 mb-3">Purchased on 24 Dec 2024</p>
                              
                              <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between group">
                                 <code class="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">user:pass | netflix@mail.com:Pass123!</code>
                                 <button class="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-primary" onclick={() => navigator.clipboard.writeText('netflix@mail.com:Pass123!')}>
                                    <Copy class="size-4" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Item 2 -->
                     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <div class="flex items-start gap-4">
                           <div class="size-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs">
                              SPOT
                           </div>
                           <div class="flex-1">
                              <h3 class="font-bold text-slate-900 dark:text-white">Spotify Premium Individual</h3>
                              <p class="text-xs text-slate-500 mb-3">Purchased on 20 Dec 2024</p>
                              
                              <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between group">
                                 <div class="flex flex-col">
                                    <span class="text-[10px] text-slate-400 font-bold uppercase">Invite Link</span>
                                    <code class="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 truncate max-w-[200px]">https://spotify.com/invite/xyz...</code>
                                 </div>
                                 <a href="#" class="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-primary">
                                    <ExternalLink class="size-4" />
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Item 3 (Bulk Example) -->
                     <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <div class="flex items-start gap-4">
                           <div class="size-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                              STM
                           </div>
                           <div class="flex-1">
                              <div class="flex items-start justify-between">
                                 <div>
                                     <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                         Steam Wallet IDR 12.000
                                         <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded-full">x50 Items</span>
                                     </h3>
                                     <p class="text-xs text-slate-500 mb-3">Purchased on 18 Dec 2024</p>
                                 </div>
                              </div>

                              <!-- Bulk Content Accordion -->
                              <details class="group bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                  <summary class="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors list-none">
                                      <div class="flex items-center gap-2">
                                          <List class="size-4 text-slate-400" />
                                          <span class="text-xs font-bold text-slate-600 dark:text-slate-300">View All 50 Codes</span>
                                      </div>
                                      <ChevronDown class="size-4 text-slate-400 group-open:rotate-180 transition-transform" />
                                  </summary>
                                  
                                  <div class="p-0 border-t border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                                      {#each Array(50) as _, i}
                                          <div class="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                              <div class="flex items-center gap-3">
                                                  <span class="text-[10px] text-slate-400 w-6">#{i+1}</span>
                                                  <code class="text-xs font-mono text-slate-700 dark:text-slate-300">ABCD-1234-EFGH-5678</code>
                                              </div>
                                              <button class="p-1 text-slate-300 hover:text-primary transition-colors" title="Copy">
                                                  <Copy class="size-3" />
                                              </button>
                                          </div>
                                      {/each}
                                  </div>
                                  
                                  <div class="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-4">
                                      <button class="text-xs font-bold text-primary hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                                          <Download class="size-3" /> Save as .txt
                                      </button>
                                      <div class="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                                      <button class="text-xs font-bold text-primary hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                                          <Copy class="size-3" /> Copy All
                                      </button>
                                  </div>
                              </details>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

           {:else if activeTab === 'support'}
               <!-- HELP CENTER -->
               <div in:slide class="space-y-6">
                  <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Help Center</h1>
                  
                  <div class="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-6 text-center">
                     <LifeBuoy class="size-12 text-primary mx-auto mb-4" />
                     <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Need help with an order?</h2>
                     <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                        If your product code doesn't work or you haven't received your item, our support team is ready to help 24/7.
                     </p>
                     <button class="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 mx-auto">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="size-5" />
                        Chat on WhatsApp
                     </button>
                  </div>

                  <!-- FAQ Accordion Mock -->
                  <div class="space-y-3">
                     <h3 class="font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
                     {#each [
                        "How do I redeem my Netflix account?",
                        "My Spotify invite link is expired",
                        "Can I get a refund?"
                     ] as question}
                        <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                           <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{question}</span>
                           <ChevronDown class="size-4 text-slate-400" />
                        </div>
                     {/each}
                  </div>
               </div>

           {:else}
              <div in:slide class="space-y-6">
                 <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>

                 <!-- General Information -->
                 <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       <User class="size-5 text-primary" /> General Information
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div class="space-y-1.5">
                          <label for="fullname" class="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                          <input id="fullname" type="text" bind:value={profile.fullname} class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                       </div>
                       <div class="space-y-1.5">
                          <label for="email" class="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                          <input id="email" type="email" bind:value={profile.email} class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed" disabled />
                          <p class="text-[10px] text-slate-400">Email cannot be changed contact support.</p>
                       </div>
                       <div class="space-y-1.5">
                          <label for="phone" class="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                          <input id="phone" type="tel" placeholder="+62" bind:value={profile.phone} class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                       </div>
                    </div>
                 </div>

                 <!-- Security -->
                 <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       <Settings class="size-5 text-primary" /> Security
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div class="space-y-1.5">
                          <label for="current_password" class="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                          <input id="current_password" type="password" placeholder="••••••••" bind:value={profile.currentPassword} class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                       </div>
                       <div class="space-y-1.5">
                          <label for="new_password" class="text-xs font-bold text-slate-500 uppercase">New Password</label>
                          <input id="new_password" type="password" placeholder="Leave empty to keep current" bind:value={profile.newPassword} class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                       </div>
                    </div>
                 </div>

                 <!-- Notification Preferences -->
                 <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                       <CheckCircle2 class="size-5 text-primary" /> Notification Preferences
                    </h2>
                    <div class="space-y-3">
                       <label class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                          <input type="checkbox" bind:checked={profile.notifyOrderUpdates} class="checkbox checkbox-primary checkbox-sm" />
                          <div class="flex-1">
                             <div class="font-bold text-slate-900 dark:text-white text-sm">Order Updates</div>
                             <div class="text-xs text-slate-500">Receive emails about your order status</div>
                          </div>
                       </label>
                       <label class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                          <input type="checkbox" bind:checked={profile.notifyPromotions} class="checkbox checkbox-primary checkbox-sm" />
                          <div class="flex-1">
                             <div class="font-bold text-slate-900 dark:text-white text-sm">Promotions</div>
                             <div class="text-xs text-slate-500">Receive emails about new products and deals</div>
                          </div>
                       </label>
                    </div>
                 </div>

                 <!-- Save Actions -->
                 <div class="flex justify-end pt-4">
                    <button 
                       onclick={saveSettings}
                       disabled={isSaving}
                       class="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                       {#if isSaving}
                          <div class="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                       {:else}
                          Save Changes
                       {/if}
                    </button>
                 </div>
              </div>
           {/if}
        </div>

     </div>
  </main>

  <Footer />
</div>
