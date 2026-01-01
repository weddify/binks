<script lang="ts">
  import { page } from '$app/stores';
  import { userOrders } from '$lib/data';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { ShieldCheck, Package, Copy, Check, Lock, ChevronLeft, CircleAlert, Clock, CircleCheck, User, Key, FileText, Receipt, CircleX, ChevronRight } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  $: orderId = $page.params.id;
  $: order = userOrders.find(o => o.id === orderId);

  let copiedField = '';

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    copiedField = field;
    setTimeout(() => copiedField = '', 2000);
  }

  // Redirect if pending
  $: if (order && order.status === 'PENDING') {
      goto(`/invoice/${order.id}`);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
</script>

<div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
  <Navbar />

  <main class="flex-grow container mx-auto px-4 py-8">
     <div class="max-w-[1200px] mx-auto">
        
        <!-- Back Button -->
        <a href="/dashboard" class="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 text-sm font-bold">
           <ChevronLeft class="size-4" /> Back to Dashboard
        </a>

        {#if order}
           <div class="space-y-8">
              
              <!-- Header -->
              <div class="flex items-center justify-between">
                 <div>
                    <h1 class="text-2xl font-black text-slate-900 dark:text-white">Order Details</h1>
                    <div class="flex items-center gap-2 text-sm text-slate-500 mt-1">
                       <span class="font-mono">#{order.id}</span>
                       <span>•</span>
                       <span>{order.date}</span>
                    </div>
                 </div>
                 {#if order.status === 'PAID'}
                    <div class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-lg uppercase tracking-wider flex items-center gap-2">
                       <CircleCheck class="size-4" /> Paid
                    </div>
                 {:else if order.status === 'EXPIRED'}
                    <div class="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs rounded-lg uppercase tracking-wider flex items-center gap-2">
                       <CircleX class="size-4" /> Expired
                    </div>
                 {/if}
              </div>

              <!-- Main Layout Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                 
                 <!-- Left Column: Products & Credentials -->
                 <div class="lg:col-span-2 space-y-6">
                    

                    <!-- 2. Account Credentials (Below Products) -->
                    {#if order.status === 'PAID' && order.credentials}
                        {@const credentialList = (Array.isArray(order.credentials) ? order.credentials : [order.credentials]) as any[]}
                        
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm overflow-hidden flex flex-col">
                           <!-- Header -->
                           <div class="bg-blue-50/50 dark:bg-blue-900/10 px-6 py-4 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between flex-shrink-0">
                              <div class="flex items-center gap-3">
                                 <Lock class="size-5 text-blue-600 dark:text-blue-400" />
                                 <h3 class="font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wide text-sm">
                                     Account Credentials ({credentialList.length})
                                 </h3>
                              </div>
                              <div class="flex items-center gap-3">
                                 {#if credentialList.length > 1}
                                     <button 
                                        class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 bg-blue-100/50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/50"
                                        on:click={() => {
                                            const text = credentialList.map(c => `Email: ${c.email}\nPassword: ${c.password}${c.pin ? `\nPIN: ${c.pin}` : ''}`).join('\n\n');
                                            copyToClipboard(text, 'all');
                                        }}
                                     >
                                        {#if copiedField === 'all'}
                                            <Check class="size-3.5" /> Copied All
                                        {:else}
                                            <Copy class="size-3.5" /> Copy All
                                        {/if}
                                     </button>
                                 {/if}
                                 <div class="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase rounded border border-blue-200 dark:border-blue-800">
                                    Private Access
                                 </div>
                              </div>
                           </div>
                           
                           <!-- Content -->
                           {#if credentialList.length === 1}
                               {@const cred = credentialList[0]}
                               <!-- Single Item View (Card Style) -->
                               <div class="p-6 space-y-6">
                                  <!-- Email -->
                                  <div>
                                     <span class="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Email / Username</span>
                                     <div class="group relative">
                                        <div class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 font-mono text-sm text-slate-800 dark:text-slate-200 break-all transition-colors group-hover:border-blue-300 dark:group-hover:border-blue-700">
                                           {cred.email}
                                        </div>
                                        <button 
                                           class="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                                           on:click={() => copyToClipboard(cred.email, 'email')}
                                           title="Copy Email"
                                        >
                                           {#if copiedField === 'email'}
                                              <Check class="size-4 text-emerald-500" />
                                           {:else}
                                              <Copy class="size-4" />
                                           {/if}
                                        </button>
                                     </div>
                                  </div>

                                  <!-- Password -->
                                  <div>
                                     <span class="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Password</span>
                                     <div class="group relative">
                                        <div class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 font-mono text-sm text-slate-800 dark:text-slate-200 break-all transition-colors group-hover:border-blue-300 dark:group-hover:border-blue-700 tracking-[0.2em]">
                                           {cred.password}
                                        </div>
                                        <button 
                                           class="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                                           on:click={() => copyToClipboard(cred.password, 'password')}
                                           title="Copy Password"
                                        >
                                           {#if copiedField === 'password'}
                                              <Check class="size-4 text-emerald-500" />
                                           {:else}
                                              <Copy class="size-4" />
                                           {/if}
                                        </button>
                                     </div>
                                  </div>

                                  {#if cred.pin}
                                     <!-- PIN/Profile -->
                                     <div>
                                        <span class="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">PIN / Profile</span>
                                        <div class="group relative">
                                           <div class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 font-mono text-sm text-slate-800 dark:text-slate-200 break-all transition-colors group-hover:border-blue-300 dark:group-hover:border-blue-700">
                                              {cred.pin}
                                           </div>
                                           <button 
                                              class="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                                              on:click={() => copyToClipboard(cred.pin, 'pin')}
                                              title="Copy PIN"
                                           >
                                              {#if copiedField === 'pin'}
                                                 <Check class="size-4 text-emerald-500" />
                                              {:else}
                                                 <Copy class="size-4" />
                                              {/if}
                                           </button>
                                        </div>
                                     </div>
                                  {/if}
                               </div>
                           {:else}
                               <!-- Bulk List View (Table Style) -->
                               <div class="max-h-[500px] overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
                                   <table class="w-full text-left border-collapse">
                                       <thead class="bg-slate-50 dark:bg-slate-900/80 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider shadow-sm">
                                           <tr>
                                               <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 w-16 text-center">#</th>
                                               <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Email / ID</th>
                                               <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">Password</th>
                                               {#if credentialList.some(c => c.pin)}
                                                   <th class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">PIN</th>
                                               {/if}
                                           </tr>
                                       </thead>
                                       <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                           {#each credentialList as cred, i}
                                               <tr class="bg-white dark:bg-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                                   <td class="px-6 py-4 text-center text-xs font-bold text-slate-400 font-mono">
                                                       {i + 1}
                                                   </td>
                                                   <td class="px-6 py-4">
                                                       <button 
                                                          class="font-mono text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-left w-full truncate flex items-center gap-2 group-hover:underline decoration-dashed underline-offset-4"
                                                          on:click={() => copyToClipboard(cred.email, `email-${i}`)}
                                                          title="Click to copy"
                                                       >
                                                           {cred.email}
                                                           {#if copiedField === `email-${i}`}
                                                               <Check class="size-3 text-emerald-500 flex-shrink-0" />
                                                           {/if}
                                                       </button>
                                                   </td>
                                                   <td class="px-6 py-4">
                                                       <button 
                                                          class="font-mono text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-left w-full truncate flex items-center gap-2 group-hover:underline decoration-dashed underline-offset-4"
                                                          on:click={() => copyToClipboard(cred.password, `pass-${i}`)}
                                                          title="Click to copy"
                                                       >
                                                           {cred.password}
                                                           {#if copiedField === `pass-${i}`}
                                                               <Check class="size-3 text-emerald-500 flex-shrink-0" />
                                                           {/if}
                                                       </button>
                                                   </td>
                                                   {#if credentialList.some(c => c.pin)}
                                                       <td class="px-6 py-4">
                                                           {#if cred.pin}
                                                               <button 
                                                                  class="font-mono text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-left w-full truncate flex items-center gap-2 group-hover:underline decoration-dashed underline-offset-4"
                                                                  on:click={() => copyToClipboard(cred.pin, `pin-${i}`)}
                                                                  title="Click to copy"
                                                               >
                                                                   {cred.pin}
                                                                   {#if copiedField === `pin-${i}`}
                                                                       <Check class="size-3 text-emerald-500 flex-shrink-0" />
                                                                   {/if}
                                                               </button>
                                                           {:else}
                                                               <span class="text-slate-300">-</span>
                                                           {/if}
                                                       </td>
                                                   {/if}
                                               </tr>
                                           {/each}
                                       </tbody>
                                   </table>
                               </div>
                           {/if}

                           <div class="bg-blue-50/50 dark:bg-blue-900/10 px-6 py-4 flex gap-3 text-xs text-slate-500 leading-relaxed border-t border-blue-100 dark:border-blue-900/30">
                              <div class="flex-shrink-0 mt-0.5">
                                 <ShieldCheck class="size-4 text-blue-500" />
                              </div>
                              <p>Please change the password immediately after logging in to secure your account. If you encounter any issues, contact support within 24 hours.</p>
                           </div>
                        </div>

                    {:else if order.status === 'EXPIRED'}
                        <div class="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-8 text-center">
                           <CircleAlert class="size-12 text-red-400 mx-auto mb-4" />
                           <h3 class="font-bold text-red-900 dark:text-red-400 text-lg mb-2">Order Expired</h3>
                           <p class="text-red-700 dark:text-red-300 p-2">This order has expired and cannot be processed.</p>
                        </div>
                    {:else}
                        <!-- Fallback / No Credentials needed -->
                        <div class="bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center text-slate-400 h-32">
                           <p>No credentials available for this status.</p>
                        </div>
                    {/if}

                 </div>

                 <!-- Right Column: Product Detail, Payment & Actions -->
                <div class="lg:col-span-1 space-y-6 sticky top-24 h-fit">
                    <!-- 1. Items Ordered (Moved to Right) -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                       <!-- Card Header -->
                       <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                          <Package class="size-5 text-blue-600 dark:text-blue-400" />
                          <h2 class="font-bold text-lg text-slate-800 dark:text-white">Items Ordered</h2>
                       </div>

                       <!-- Card Content -->
                       <div class="divide-y divide-slate-100 dark:divide-slate-700">
                           {#if order.products && order.products.length > 0}
                              {#each order.products as product}
                                 <div class="p-4 flex gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <!-- Product Image -->
                                    <div class="size-16 rounded-lg bg-slate-100 dark:bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-800">
                                       {#if product.image}
                                          <img src={product.image} alt={product.title} class="w-full h-full object-cover" />
                                       {:else}
                                          <div class="w-full h-full flex items-center justify-center text-slate-400">
                                             <Package class="size-8" />
                                          </div>
                                       {/if}
                                    </div>
                                    
                                    <!-- Product Details -->
                                    <div class="flex-1 min-w-0 flex flex-col justify-center">
                                       <h3 class="font-bold text-slate-900 dark:text-white text-sm truncate" title={product.title}>{product.title}</h3>
                                       <p class="text-slate-500 text-xs mb-2">{product.variant || 'Standard License'}</p>
                                       <div class="flex items-center gap-3 text-xs text-slate-500">
                                          <div class="flex items-center gap-1">
                                             <Package class="size-3" /> <span>Qty: {product.quantity || 1}</span>
                                          </div>
                                          <div class="flex items-center gap-1">
                                             <Receipt class="size-3" /> <span>{formatPrice(product.price)}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              {/each}
                           {:else}
                               <!-- Fallback for legacy data -->
                               <div class="p-6 flex items-start gap-4">
                                  <div class="size-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-primary">
                                     <Package class="size-8" />
                                  </div>
                                  <div class="py-1">
                                     <div class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Digital Product</div>
                                     <h3 class="font-bold text-slate-900 dark:text-white text-base mb-1">{order.items}</h3>
                                     <div class="text-base font-black text-slate-900 dark:text-white">
                                        {formatPrice(order.total)}
                                     </div>
                                  </div>
                               </div>
                           {/if}
                       </div>
                    </div>

                    <!-- Payment Summary Card -->
                       <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                          <div class="p-5 border-b border-slate-100 dark:border-slate-700">
                             <h3 class="font-bold text-slate-900 dark:text-white text-lg">Payment Summary</h3>
                          </div>
                          
                          <div class="p-5 space-y-3">
                             {#if order.paymentDetails}
                                <div class="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                   <span>Subtotal</span>
                                   <span>{formatPrice(order.paymentDetails.subtotal)}</span>
                                </div>
                                <div class="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                   <span>Service Fees</span>
                                   <span>{formatPrice(order.paymentDetails.serviceFee)}</span>
                                </div>
                                {#if order.paymentDetails.uniqueCode}
                                   <div class="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                      <span>Unique Code</span>
                                      <span class="text-emerald-600 font-bold">-{formatPrice(order.paymentDetails.uniqueCode)}</span>
                                   </div>
                                {/if}
                                <div class="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                   <span>Discount</span>
                                   <span>- Rp 0</span>
                                </div>
                                <div class="pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center text-slate-900 dark:text-white mt-1">
                                   <span class="font-bold">Total Paid</span>
                                   <span class="text-xl font-black text-primary">{formatPrice(order.total)}</span>
                                </div>
                             {:else}
                                <!-- Legacy Total -->
                                <div class="flex justify-between items-center text-slate-900 dark:text-white">
                                   <span class="font-bold">Total Paid</span>
                                   <span class="text-xl font-black text-primary">{formatPrice(order.total)}</span>
                                </div>
                             {/if}
                          </div>

                          <div class="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-t border-slate-100 dark:border-slate-700 text-sm flex justify-between items-center">
                             <span class="text-slate-500">Payment Method</span>
                             <div class="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                <Receipt class="size-4" /> {order.paymentMethod}
                             </div>
                          </div>
                       </div>

                        <!-- Support Card -->
                        <div class="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/30 text-center">
                           <h3 class="font-bold text-base mb-1">Need Help?</h3>
                           <p class="text-blue-100 text-xs mb-3 leading-relaxed">If the account doesn't work or you have other issues, our support team is ready to help 24/7.</p>
                           <button class="w-full py-2 bg-white text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                              <span>💬</span> Chat Support
                           </button>
                        </div>

               </div>
            </div>
            </div>
         {:else}
            <div class="py-20 text-center">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Order Not Found</h1>
              <p class="text-slate-500 mb-6">The order you are looking for does not exist.</p>
              <a href="/dashboard" class="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                 Back to Dashboard
              </a>
           </div>
        {/if}
     </div>
  </main>
  
  <Footer />
</div>
