<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Banknote } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { slide } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import { PAYMENT_CHANNELS } from '$lib/constants/payments';

  // Mock Data (would normally come from a store or URL params)
  const order = {
    items: [
      { title: "Netflix Premium", price: 35000, quantity: 1 }
    ],
    total: 35000,
    fee: 1500,
  };

  let selectedMethod = $state("qris");
  let selectedBank = $state(""); // For VA state
  let email = $state("");
  let whatsapp = $state("");
  let isLoading = $state(false);

  const paymentMethods = [
     { id: 'qris', name: 'QRIS (Instant)', icon: QrCode },
     { id: 'va', name: 'Virtual Account', icon: CreditCard },
  ];

  const vaBanks = PAYMENT_CHANNELS.filter(c => c.type === 'va').map(c => ({
      id: c.id,
      name: c.name,
      logo: (c as any).logo_path || (c as any).logo_url || ''
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  async function handleCheckout() {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (selectedMethod === 'va' && !selectedBank) {
        toast.error("Please select a bank for Virtual Account.");
        return;
    }
    
    isLoading = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate random Order ID
    const orderId = "INV-" + Math.floor(100000 + Math.random() * 900000);
    
    // Redirect to Invoice Page with params for mock display
    const params = new URLSearchParams();
    params.set('method', selectedMethod);
    if (selectedMethod === 'va' && selectedBank) {
        params.set('bank', selectedBank);
    }
    
    goto(`/invoice/${orderId}?${params.toString()}`);
  }
</script>

<div class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-sans">
  <Navbar />

  <main class="flex-grow w-full max-w-screen-lp mx-auto px-4 md:px-8 py-12">
    <div class="mb-10 text-center">
       <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Checkout</h1>
       <p class="text-slate-500 dark:text-slate-400">Complete your payment to receive your product instantly.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Left: Payment Methods -->
       <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
             <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div class="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm">1</div>
                Customer Details
             </h2>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                      <input type="email" bind:value={email} placeholder="Masukan email aktif..." class="mt-1 w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-primary" />
                   </label>
                </div>
                <div>
                   <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp (Optional)
                      <input type="text" bind:value={whatsapp} placeholder="0812..." class="mt-1 w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-primary" />
                   </label>
                </div>
             </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
             <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div class="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm">2</div>
                Select Payment Method
             </h2>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each paymentMethods as method}
                   {@const Icon = method.icon}
                   <button 
                      class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left relative {selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}"
                      onclick={() => selectedMethod = method.id}
                   >
                       <div class="size-12 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300">
                          <Icon class="size-6" />
                       </div>
                       <div>
                          <div class="font-bold text-slate-900 dark:text-white">{method.name}</div>
                          <div class="text-xs text-slate-500">Automated Check</div>
                       </div>
                       {#if selectedMethod === method.id}
                          <div class="absolute top-4 right-4 text-primary">
                             <CheckCircle2 class="size-5 fill-primary text-white" />
                          </div>
                       {/if}
                   </button>
                {/each}
             </div>

             <!-- VA Bank Selection (Only if VA is selected) -->
             {#if selectedMethod === 'va'}
                 <div transition:slide class="pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
                     <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-3">Choose Bank</h3>
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {#each vaBanks as bank}
                             <button 
                                 class="flex items-center gap-3 p-3 rounded-lg border transition-all text-left relative {selectedBank === bank.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}"
                                 onclick={() => selectedBank = bank.id}
                             >
                                 <div class="w-12 h-8 bg-white rounded border border-slate-100 flex items-center justify-center p-1">
                                     <img src={bank.logo} alt={bank.name} class="max-w-full max-h-full object-contain" />
                                 </div>
                                 <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{bank.name.replace(' Virtual Account', '')}</span>
                                 {#if selectedBank === bank.id}
                                     <CheckCircle2 class="size-4 text-primary absolute right-3 top-1/2 -translate-y-1/2" />
                                 {/if}
                             </button>
                         {/each}
                     </div>
                 </div>
             {/if}
          </div>
       </div>

       <!-- Right: Order Summary -->
       <div class="lg:col-span-1">
          <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm sticky top-24">
             <h3 class="font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>
             
             <div class="space-y-4 mb-6">
                {#each order.items as item}
                   <div class="flex justify-between items-start">
                      <div class="text-sm">
                         <div class="font-medium text-slate-900 dark:text-white">{item.title}</div>
                         <div class="text-slate-500">x{item.quantity}</div>
                      </div>
                      <div class="font-bold text-slate-700 dark:text-slate-300">{formatPrice(item.price)}</div>
                   </div>
                {/each}
             </div>

             <div class="space-y-2 py-4 border-t border-slate-100 dark:border-slate-700 text-sm">
                <div class="flex justify-between">
                   <span class="text-slate-500">Subtotal</span>
                   <span class="font-medium">{formatPrice(order.total)}</span>
                </div>
                <div class="flex justify-between">
                   <span class="text-slate-500">Service Fee</span>
                   <span class="font-medium">{formatPrice(order.fee)}</span>
                </div>
             </div>

             <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700 mb-6">
                <span class="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                <span class="font-black text-2xl text-primary">{formatPrice(order.total + order.fee)}</span>
             </div>

             <button 
                class="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onclick={handleCheckout}
                disabled={isLoading}
             >
                {#if isLoading}
                   <div class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Processing...
                {:else}
                   Pay Now
                {/if}
             </button>
             
             <div class="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <ShieldCheck class="size-4 text-green-500" />
                <span>Secure SSL Encrypted Payment</span>
             </div>
          </div>
       </div>
    </div>
  </main>

  <Footer />
</div>
