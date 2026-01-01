<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Copy, Clock, Download, CircleCheck, ChevronDown, ChevronUp, Package, Receipt, Smartphone, AlertTriangle, Info, ArrowRight, CircleX } from 'lucide-svelte';
  import { slide, fade, scale } from 'svelte/transition';
  import { onDestroy } from 'svelte';
  import { PAYMENT_INSTRUCTIONS, type PaymentInstruction } from '$lib/utils/paymentInstructions';
  import { toast } from 'svelte-sonner';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';

  let orderId = $derived($page.params.orderId);
  
  $effect(() => {
    console.log('Invoice State:', $state.snapshot(invoice));
    console.log('Instructions Object:', PAYMENT_INSTRUCTIONS);
    console.log('Current Method:', invoice.paymentMethod);
    console.log('Current Provider:', invoice.paymentProvider);
  });
  
  // Mock Invoice Data (Simulating a VA Order)
  // Get params from URL to simulate dynamic checkout
  const method = $page.url.searchParams.get('method') || "VA";
  const bankParam = $page.url.searchParams.get('bank') || "BNI";
  // Normalize bank key (strip _va and uppercase) to match paymentInstructions keys
  const bankKey = bankParam.replace(/_va$/i, '').toUpperCase();
  
  let invoice = $state({
     status: "UNPAID",
     amount: 36500,
     expiry: "23:59:59", 
     paymentMethod: method.toUpperCase(), 
     paymentProvider: method === 'qris' ? 'QRIS' : bankKey, 
     vaNumber: "8801234567890", 
     payCode: "888880123456", // Added for retail test
     customer: {
        name: "Guest User",
        email: "user@example.com",
     },
     items: [
        { title: "Netflix Premium (1 Month)", price: 35000, quantity: 1 }
     ],
     fee: 1500
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
       maximumFractionDigits: 0,
    }).format(price);
  };
  
  function copyToClipboard(text: string) {
     navigator.clipboard.writeText(text);
     toast.success("Copied to clipboard!");
  }

  let redirectCountdown = $state(5);
  let redirectInterval: any;
  let instructionsOpen = $state(true);
  let activeVaTab = $state('mobile');
  let paymentLoading = $state(false);

  // Resolve Instructions Dynamically
  let currentInstruction = $derived.by(() => {
      const methodGroup = PAYMENT_INSTRUCTIONS[invoice.paymentMethod];
      if (!methodGroup) return null;
      
      const specific = methodGroup[invoice.paymentProvider] || methodGroup['DEFAULT'];
      return specific as PaymentInstruction;
  });

  $effect(() => {
     if (currentInstruction?.tabs && !currentInstruction.tabs[activeVaTab]) {
        const availableTabs = Object.keys(currentInstruction.tabs);
        if (availableTabs.length > 0) {
           activeVaTab = availableTabs[0];
        }
     }
  });

  function parseStep(step: string) {
      return step
         .replace('{{vaNumber}}', invoice.vaNumber || '')
         .replace('{{payCode}}', invoice.payCode || '');
  }

  function markAsPaid() {
     // Simulate API Call delay
     paymentLoading = true;
     setTimeout(() => {
        paymentLoading = false;
        invoice.status = 'PAID';
        invoice.expiry = '-';
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Start Redirect Countdown
        redirectInterval = setInterval(() => {
           redirectCountdown--;
           if (redirectCountdown <= 0) {
              clearInterval(redirectInterval);
              goto('/'); // Redirect to Home/Profile/Orders
           }
        }, 1000);

     }, 500);
  }

  let showCancelConfirm = $state(false);

  function cancelTransaction() {
     showCancelConfirm = true;
  }

  function processCancellation() {
     paymentLoading = true;
     setTimeout(() => {
        paymentLoading = false;
        invoice.status = 'CANCELLED';
        invoice.expiry = '-';
        window.scrollTo({ top: 0, behavior: 'smooth' });
     }, 500);
  }
  
  onDestroy(() => {
     if (redirectInterval) clearInterval(redirectInterval);
  });
</script>

<div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
  <Navbar />

  <main class="flex-grow flex items-center justify-center p-4">
      
      <!-- Compact Professional Card -->
      <div class="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col-reverse md:flex-row-reverse relative">
         
         <!-- Confetti/Success Effect Layer -->
         {#if invoice.status === 'PAID'}
            <div class="absolute inset-0 pointer-events-none overflow-hidden z-20">
               <!-- Simple CSS particle effects or SVG could go here for polish -->
            </div>
         {/if}

         <!-- LEFT: Context & Instructions (60%) -->
         <div class="flex-1 p-6 md:border-l border-slate-100 dark:border-slate-700 relative z-10">
            
            <!-- Header (Desktop Only) -->
            <div class="hidden md:flex items-center justify-between mb-6">
               <div>
                  <h1 class="font-bold text-xl text-slate-900 dark:text-white">Payment for #{orderId}</h1>
                  {#if invoice.status === 'PAID'}
                     <p class="text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CircleCheck class="size-4" /> Received & Verified
                     </p>
                   {:else if invoice.status === 'CANCELLED'}
                      <p class="text-sm text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                         <CircleX class="size-4" /> Transaction Cancelled
                      </p>
                   {:else}
                     <p class="text-sm text-slate-500">Complete your payment within <span class="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">{invoice.expiry}</span></p>
                  {/if}
               </div>
               <div class="text-right">
                  <div class="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Bill</div>
                  <div class="font-black text-xl text-primary">{formatPrice(invoice.amount)}</div>
               </div>
            </div>

            <div class="space-y-6">
               <!-- Order Summary Table -->
               <div class="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div class="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                     <Receipt class="size-3.5 text-slate-500" />
                     <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Details</span>
                  </div>
                  <div class="p-3 text-sm space-y-2">
                     {#each invoice.items as item}
                        <div class="flex justify-between">
                           <span class="text-slate-600 dark:text-slate-400">{item.title}</span>
                           <span class="font-bold text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                        </div>
                     {/each}
                     <div class="flex justify-between text-xs text-slate-400 pt-2 border-t border-dashed border-slate-100 dark:border-slate-700">
                        <span>Platform Fee</span>
                        <span>{formatPrice(invoice.fee)}</span>
                     </div>
                  </div>
               </div>

               {#if invoice.status !== 'PAID' && currentInstruction}
                  <!-- Compact Instructions Accordion (Only show when Unpaid) -->
                  <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
                     <button 
                        class="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onclick={() => instructionsOpen = !instructionsOpen}
                     >
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           <Info class="size-4 text-blue-500" /> 
                           How to Pay via {currentInstruction.title}
                        </h3>
                        {#if instructionsOpen} <ChevronUp class="size-4 text-slate-400" /> {:else} <ChevronDown class="size-4 text-slate-400" /> {/if}
                     </button>
                     
                     {#if instructionsOpen}
                        <div transition:slide class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                           
                           {#if currentInstruction.tabs}
                              <!-- Tabbed Instructions (Tabs) -->
                              <div class="flex border-b border-slate-100 dark:border-slate-700">
                                 {#each Object.keys(currentInstruction.tabs) as tabKey}
                                    <button 
                                       class="flex-1 py-2 text-xs font-bold text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors uppercase {activeVaTab === tabKey ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}" 
                                       onclick={() => activeVaTab = tabKey}
                                    >
                                       {tabKey}
                                    </button>
                                 {/each}
                              </div>
                              <div class="p-4 space-y-3">
                                 {#if currentInstruction.tabs[activeVaTab]}
                                    <ol class="list-decimal list-outside ml-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                       {#each currentInstruction.tabs[activeVaTab] as step}
                                          <li>{@html parseStep(step).replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-slate-200">$1</strong>')}</li>
                                       {/each}
                                    </ol>
                                 {/if}
                              </div>
                           {:else}
                              <!-- Standard List Instructions -->
                              <div class="p-4 space-y-3">
                                 <ol class="list-decimal list-outside ml-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                    {#each currentInstruction.steps as step}
                                       <li>{@html parseStep(step).replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-slate-200">$1</strong>')}</li>
                                    {/each}
                                 </ol>
                              </div>
                           {/if}

                        </div>
                     {/if}
                  </div>
               {/if}
            </div>
         </div>

         <!-- RIGHT: Action (40%) -->
         <div class="w-full md:w-[360px] bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center relative border-b md:border-b-0 border-slate-100 dark:border-slate-700 transition-colors duration-500 {invoice.status === 'PAID' ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}">
             
             <!-- Mobile Header (Visible only on mobile) -->
             <div class="md:hidden w-full text-left mb-6 pb-6 border-b border-dashed border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-2">
                   <h1 class="font-bold text-lg text-slate-900 dark:text-white">#{orderId}</h1>
                   <div class="font-black text-xl text-primary">{formatPrice(invoice.amount)}</div>
                </div>
                 {#if invoice.status === 'PAID'}
                     <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CircleCheck class="size-3" /> Received & Verified
                     </p>
                 {:else if invoice.status === 'CANCELLED'}
                      <p class="text-xs text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
                         <CircleX class="size-3" /> Transaction Cancelled
                      </p>
                 {:else}
                     <p class="text-xs text-slate-500">Pay within <span class="font-mono font-bold bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">{invoice.expiry}</span></p>
                 {/if}
             </div>
             
             <!-- Corner Status Badge -->
             {#if invoice.status === 'PAID'}
               <div class="hidden md:flex absolute top-4 right-4 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 items-center gap-1">
                   <CircleCheck class="size-3" /> Paid
               </div>
             {:else if invoice.status === 'CANCELLED'}
               <div class="hidden md:flex absolute top-4 right-4 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-800 items-center gap-1">
                   Cancelled
               </div>
             {:else}
               <div class="hidden md:flex absolute top-4 right-4 px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800">
                  Unpaid
               </div>
             {/if}

             {#if invoice.status === 'PAID'}
                  <!-- SUCCESS VIEW -->
                  <div in:scale class="flex flex-col items-center justify-center py-8">
                     <div class="size-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                        <CircleCheck class="size-10 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     
                     <h2 class="text-xl font-black text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
                     <p class="text-sm text-slate-500 mb-6 max-w-[220px]">
                        We've received your payment of <strong class="text-slate-800 dark:text-slate-200">{formatPrice(invoice.amount)}</strong>.
                     </p>
                     
                     <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6 animate-pulse">
                        Redirecting in {redirectCountdown}s...
                     </p>

                     <div class="w-full space-y-3">
                        <a href="/" class="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                           View My Order <ArrowRight class="size-4" />
                        </a>
                        <button class="w-full py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                           <Download class="size-4" /> Download Invoice
                        </button>
                     </div>
                  </div>

             {:else if invoice.status === 'CANCELLED'}
                  <!-- CANCELLED VIEW -->
                  <div in:scale class="flex flex-col items-center justify-center py-8">
                     <div class="size-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50 dark:ring-red-900/10">
                        <CircleX class="size-10 text-red-600 dark:text-red-400" />
                     </div>
                     
                     <h2 class="text-xl font-black text-slate-900 dark:text-white mb-2">Transaction Cancelled</h2>
                     <p class="text-sm text-slate-500 mb-6 max-w-[220px]">
                        This transaction has been cancelled. Please create a new order if you wish to proceed.
                     </p>
                     
                     <a href="/" class="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                        <ArrowRight class="size-4" /> Return to Store
                     </a>
                  </div>

             {:else}
                  <!-- PAYMENT ACTION VIEW -->
                  {#if invoice.paymentMethod === 'VA'}
                     <!-- VA Display -->
                     <div class="mb-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" alt="BCA" class="h-6 object-contain" />
                     </div>
                     <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-6">BCA Virtual Account</h2>
                     
                     <div class="w-full bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 relative">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Virtual Account Number</p>
                        <button class="w-full flex items-center justify-center gap-2 group" onclick={() => copyToClipboard(invoice.vaNumber)}>
                           <span class="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">{invoice.vaNumber}</span>
                           <Copy class="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                        </button>
                     </div>
                  {:else}
                     <!-- QRIS Display -->
                     <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-4">Scan QR Code</h2>
                     <div class="p-3 bg-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-4 relative group">
                        <div class="size-40 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ExamplePayment')] bg-cover opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div class="bg-white/90 p-1 rounded backdrop-blur-sm">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS" class="h-3 object-contain" />
                           </div>
                        </div>
                     </div>
                  {/if}

                  <p class="text-xs text-slate-500 mb-6 max-w-[200px]">
                     Valid for <span class="font-mono text-slate-700 dark:text-slate-300">{invoice.expiry}</span>. Payment is detected automatically.
                  </p>

                  <div class="w-full space-y-2">
                     <button 
                        class="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                        onclick={markAsPaid}
                     >
                        <CircleCheck class="size-4" /> I Have Paid
                     </button>
                     {#if invoice.paymentMethod === 'VA'}
                        <button class="w-full py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2" onclick={() => copyToClipboard(invoice.vaNumber)}>
                           <Copy class="size-4" /> Copy Number
                        </button>
                     {:else}
                        <button class="w-full py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                           <Download class="size-4" /> Download QRIS
                        </button>
                     {/if}

                     <button 
                        class="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2 mt-4"
                        onclick={cancelTransaction}
                     >
                        Cancel Transaction
                     </button>
                  </div>
             {/if}

         </div>

      </div>
      
      <!-- Safe Footer Area -->
      <div class="hidden md:block fixed bottom-4 left-0 right-0 text-center pointer-events-none">
          <p class="text-[10px] text-slate-400">
             Secured by SwiftAcc Payment Systems
          </p>
      </div>

  </main>

  <ConfirmModal 
    bind:isOpen={showCancelConfirm}
    title="Cancel Transaction"
    message="Are you sure you want to cancel this transaction? This action cannot be undone."
    confirmText="Yes, Cancel"
    onConfirm={processCancellation}
  />
</div>
