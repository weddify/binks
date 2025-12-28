<script lang="ts">
  import { X, ShoppingCart, Minus, Plus, Info, Check, ShieldCheck, FileText, Lock, ArrowRight, Package, TrendingUp, ChevronDown, Heart } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  
  // Internal icon aliases
  const ChevronDownIcon = ChevronDown;
  const HeartIcon = Heart;

  interface Props {
    isOpen?: boolean;
    product: {
      title: string;
      price: number;
      stock: number;
      description: string;
    } | undefined;
    onclose?: () => void;
  }

  let { 
    isOpen = $bindable(false), 
    product,
    onclose
  }: Props = $props();
  
  let activeAccordion = $state('description'); // Default open
  let quantity = $state(1);

  function toggleAccordion(id: string) {
     if (activeAccordion === id) {
        activeAccordion = '';
     } else {
        activeAccordion = id;
     }
  }

  function close() {
    isOpen = false;
    onclose?.();
  }
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  let totalAmount = $derived(product ? product.price * quantity : 0);

  function increment() {
    quantity += 1;
  }

  function decrement() {
    if (quantity > 1) quantity -= 1;
  }

  function handlePayment() {
    // In a real app, we would create an order here.
    // For now, redirect to checkout page with product info in query params or store
    onclose?.();
    goto('/checkout');
  }

  // Prevent body scroll when modal is open
  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

{#if isOpen && product}
<!-- Backdrop -->
<div 
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity outline-none overflow-hidden" 
  onclick={(e) => { if(e.target === e.currentTarget) close(); }}
  role="button"
  tabindex="0"
  onkeydown={(e) => { if (e.key === 'Escape') close(); }}
>
  
  <!-- Modal Container -->
  <div class="relative w-full max-w-5xl md:h-auto h-[90vh] max-h-[90vh] flex flex-col md:flex-row bg-background-light dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
    
    <!-- Close Button - Z-Index Boost -->
    <button 
      class="absolute top-4 right-4 z-30 p-2 bg-white/10 hover:bg-white/20 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full backdrop-blur-md"
      onclick={close}
    >
      <X class="size-5" />
    </button>

    <!-- LEFT COLUMN: Product Details (Scrollable & Takes Remaining Space) -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-48 md:pb-8">
        
       <!-- Header -->
       <div class="mb-6 pr-12">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
            {product.title}
          </h2>
          <div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
             <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Instant Delivery</span>
             <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Official Warranty</span>
          </div>
       </div>

       <!-- Price Large -->
       <div class="mb-8">
          <h1 class="text-4xl font-extrabold text-primary tracking-tight">
            {formatPrice(product.price)}
          </h1>
       </div>

       <!-- Stats Badges -->
       <div class="flex flex-wrap gap-3 mb-8">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-100 text-emerald-700 dark:text-emerald-400">
             <Package class="size-4" />
             <span class="text-xs font-bold">Stock: {product.stock > 99 ? '99+' : product.stock}</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-700 dark:text-orange-400">
             <TrendingUp class="size-4" />
             <span class="text-xs font-bold">Sold: 1.2k+</span>
          </div>
       </div>

       <!-- Mobile Only: Quantity & Coupon (Moved to Top) -->
       <div class="block md:hidden mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-3">Order Details</h3>
          
          <div class="flex flex-col gap-4">
              <!-- Quantity Mobile -->
              <div class="flex items-center justify-between">
                 <span class="text-slate-700 dark:text-slate-200 font-medium text-sm">Amount</span>
                 <div class="flex items-center bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                    <button class="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" onclick={decrement}>
                       <Minus class="size-4 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div class="w-10 text-center font-bold text-slate-900 dark:text-white text-sm">{quantity}</div>
                    <button class="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" onclick={increment}>
                       <Plus class="size-4 text-slate-600 dark:text-slate-300" />
                    </button>
                 </div>
              </div>

              <!-- Coupon Mobile -->
              <div class="flex items-center justify-between">
                 <span class="text-slate-700 dark:text-slate-200 font-medium text-sm">Coupon</span>
                 <input type="text" placeholder="Enter code" class="w-[140px] px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
              </div>
          </div>
       </div>

       <!-- Accordions -->
       <div class="space-y-3">
          <!-- Description -->
          <div class="group bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <button 
                class="w-full flex cursor-pointer items-center justify-between p-4 font-medium select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                onclick={() => toggleAccordion('description')}
             >
                <div class="flex items-center gap-3 text-slate-900 dark:text-white">
                   <Info class="size-5 text-slate-400 {activeAccordion === 'description' ? 'text-primary' : ''}" />
                   <span>Product Description</span>
                </div>
                <div class="transition-transform duration-200 {activeAccordion === 'description' ? 'rotate-180' : ''} text-slate-400">
                   <ChevronDownIcon />
                </div>
             </button>
             {#if activeAccordion === 'description'}
                <div transition:slide={{ duration: 300, easing: quintOut }} class="px-4 pb-4 pl-12 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
                    <p>{product.description}</p>
                    <p class="mt-2 text-slate-500">Trusted service since 2024. Full warranty included.</p>
                </div>
             {/if}
          </div>

          <!-- Warranty -->
          <div class="group bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <button 
                class="w-full flex cursor-pointer items-center justify-between p-4 font-medium select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                onclick={() => toggleAccordion('warranty')}
             >
                <div class="flex items-center gap-3 text-slate-900 dark:text-white">
                   <ShieldCheck class="size-5 text-slate-400 {activeAccordion === 'warranty' ? 'text-primary' : ''}" />
                   <span>Warranty Policy</span>
                </div>
                <div class="transition-transform duration-200 {activeAccordion === 'warranty' ? 'rotate-180' : ''} text-slate-400">
                   <ChevronDownIcon />
                </div>
             </button>
             {#if activeAccordion === 'warranty'}
                <div transition:slide={{ duration: 300, easing: quintOut }} class="px-4 pb-4 pl-12 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
                    <p>30 Days full warranty coverage. Passwords must not be changed.</p>
                </div>
             {/if}
          </div>
          
           <!-- Instructions -->
          <div class="group bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <button 
                class="w-full flex cursor-pointer items-center justify-between p-4 font-medium select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                onclick={() => toggleAccordion('instructions')}
             >
                <div class="flex items-center gap-3 text-slate-900 dark:text-white">
                   <FileText class="size-5 text-slate-400 {activeAccordion === 'instructions' ? 'text-primary' : ''}" />
                   <span>Instructions</span>
                </div>
                <div class="transition-transform duration-200 {activeAccordion === 'instructions' ? 'rotate-180' : ''} text-slate-400">
                   <ChevronDownIcon />
                </div>
             </button>
             {#if activeAccordion === 'instructions'}
                <div transition:slide={{ duration: 300, easing: quintOut }} class="px-4 pb-4 pl-12 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
                    <p>Credentials sent to email/dashboard instantly after payment.</p>
                </div>
             {/if}
          </div>

          <!-- Additional Notes -->
          <div class="group bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <button 
                class="w-full flex cursor-pointer items-center justify-between p-4 font-medium select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                onclick={() => toggleAccordion('notes')}
             >
                <div class="flex items-center gap-3 text-slate-900 dark:text-white">
                   <Info class="size-5 text-slate-400 {activeAccordion === 'notes' ? 'text-primary' : ''}" />
                   <span>Additional Notes</span>
                </div>
                <div class="transition-transform duration-200 {activeAccordion === 'notes' ? 'rotate-180' : ''} text-slate-400">
                   <ChevronDownIcon />
                </div>
             </button>
             {#if activeAccordion === 'notes'}
                <div transition:slide={{ duration: 300, easing: quintOut }} class="px-4 pb-4 pl-12 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
                    <p class="text-red-500 dark:text-red-400 font-medium">DO NOT CHANGE ACCOUNT EMAIL OR PASSWORD.</p>
                    <p class="mt-1">Changing account details will void the warranty immediately. Please use the profile provided.</p>
                </div>
             {/if}
          </div>

       </div>


    </div>

    <!-- RIGHT COLUMN: Purchase Card (Sticky Footer on Mobile) -->
    <div class="w-full md:w-[400px] bg-white dark:bg-slate-800 flex flex-col md:static absolute bottom-0 left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg md:bg-transparent border-t md:border-t-0 border-slate-200 dark:border-slate-700 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
       <div class="p-4 md:p-8 flex flex-col h-full">
          <h3 class="hidden md:block text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center border-b border-slate-100 dark:border-slate-700 pb-4">
             Purchase Information
          </h3>

          <!-- Quantity (Desktop Only) -->
          <div class="hidden md:flex items-center justify-between mb-6">
             <span class="text-slate-700 dark:text-slate-200 font-medium">Amount: <span class="text-red-500 text-xs align-top">(*)</span></span>
             <div class="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                <button class="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded transition-colors" onclick={decrement}>
                   <Minus class="size-4 text-slate-600 dark:text-slate-300" />
                </button>
                <div class="w-10 text-center font-bold text-slate-900 dark:text-white">{quantity}</div>
                <button class="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded transition-colors" onclick={increment}>
                   <Plus class="size-4 text-slate-600 dark:text-slate-300" />
                </button>
             </div>
          </div>

          <!-- Coupon (Desktop Only) -->
          <div class="hidden md:flex items-center justify-between mb-8">
             <span class="text-slate-700 dark:text-slate-200 font-medium">Coupon:</span>
             <input type="text" placeholder="Enter code" class="w-[140px] px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
          </div>

          <div class="md:flex-grow"></div> <!-- Spacer -->

          <!-- Summary -->
          <div class="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-700 mb-6 hidden md:block">
             <div class="flex justify-between text-sm">
                <span class="text-slate-500">Price:</span>
                <span class="font-bold text-slate-900 dark:text-white">{formatPrice(product.price * quantity)}</span>
             </div>
             <div class="flex justify-between text-sm">
                 <span class="text-slate-500">Discount:</span>
                 <span class="font-bold text-slate-900 dark:text-white">Rp 0</span>
             </div>
             <div class="flex justify-between text-lg pt-2">
                 <span class="font-bold text-slate-900 dark:text-white">Total:</span>
                 <span class="font-bold text-primary">{formatPrice(totalAmount)}</span>
             </div>
          </div>

          <!-- Mobile Only Total Display in Button Bar -->
          <div class="md:hidden flex justify-between items-end mb-3">
             <div class="flex flex-col">
                <span class="text-xs text-slate-500">Total Price</span>
                <span class="text-lg font-bold text-primary">{formatPrice(totalAmount)}</span>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button 
                class="flex-1 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                onclick={handlePayment}
            >
                <ShoppingCart class="size-5" />
                PAY NOW
            </button>
             <button class="md:hidden flex items-center justify-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500">
                <HeartIcon class="size-5" />
             </button>
          </div>
          
          <button class="w-full mt-3 py-2 text-sm text-slate-500 hover:text-primary items-center justify-center gap-2 transition-colors hidden md:flex">
             <HeartIcon class="size-4" />
             Add to favorites
          </button>

       </div>
    </div>
  </div>
</div>
{/if}

<!-- Helper Component for Chevron to avoid multiple imports if not desired, or just SVG -->
<script module>
   // Simple inline SVG components or re-use Lucide
</script>

<style>
    /* Hide scrollbar for Chrome, Safari and Opera */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 20px;
    }
    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #475569;
    }
</style>
