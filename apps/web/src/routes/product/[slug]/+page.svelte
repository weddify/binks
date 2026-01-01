<script lang="ts">
  import { page } from '$app/stores';
  import { findProductBySlug } from '$lib/data';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import BuyNowModal from '$lib/components/BuyNowModal.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { Home, ChevronRight, Package, TrendingUp, Info, ShieldCheck, FileText, ShoppingCart, ArrowLeft, Heart, Facebook, Twitter, Linkedin, Instagram } from 'lucide-svelte';

  $: slug = $page.params.slug as string;
  $: product = findProductBySlug(slug);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  let isModalOpen = false;

  function openModal() {
     if (product && product.stock > 0) isModalOpen = true;
  }
</script>

<Seo 
  title={product ? product.title : 'Product Not Found'}
  description={product ? product.description : 'The product you are looking for might have been removed.'}
  image={product?.image}
  type="product"
/>

<div class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-sans">
  <Navbar />

  <main class="flex-grow w-full max-w-screen-lp mx-auto px-4 md:px-8 py-8">
    {#if product}
      <!-- Header Card -->
      <div class="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4">
         <div class="flex flex-col md:flex-row gap-5 md:gap-6">
            <!-- Product Icon/Image -->
            <div class="flex-shrink-0">
               <div class="size-20 md:size-24 rounded-xl bg-gradient-to-br from-primary md:from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg">
                  <Package class="size-10 md:size-12" />
               </div>
            </div>

            <!-- Product Info -->
            <div class="flex-grow">
               <h1 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                  {product.title}
               </h1>

               <!-- Stats List -->
               <div class="space-y-1.5 mb-5 text-sm text-slate-600 dark:text-slate-400">
                  <div class="flex items-center gap-2">
                     <ShoppingCart class="size-4" />
                     <span>Available: <span class="font-bold text-slate-900 dark:text-white">{product.stock}</span></span>
                  </div>
                  <div class="flex items-center gap-2">
                     <TrendingUp class="size-4" />
                     <span>Sold: <span class="font-bold text-slate-900 dark:text-white">{product.sold}</span></span>
                  </div>
               </div>

               <!-- Price -->
               <div class="mb-5">
                  <span class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{formatPrice(product.price)}</span>
                  {#if product.originalPrice}
                      <span class="ml-2 text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                  {/if}
               </div>

               <!-- Short Description -->
               <div class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                  <p>{product.description}</p>
                  <p class="mt-2">After successfully logging in, customers are advised to share their ad account with multiple other Facebook accounts to minimize the risk.</p>
               </div>

               <!-- Share -->
               <div class="flex items-center gap-4 mb-6">
                  <span class="text-sm font-bold text-slate-500">Share:</span>
                  <div class="flex gap-2">
                     <button class="size-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors text-slate-500">
                        <Facebook class="size-4" />
                     </button>
                     <button class="size-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 hover:text-sky-500 flex items-center justify-center transition-colors text-slate-500">
                        <Twitter class="size-4" />
                     </button>
                     <button class="size-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors text-slate-500">
                        <Linkedin class="size-4" />
                     </button>
                     <button class="size-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-pink-100 hover:text-pink-600 flex items-center justify-center transition-colors text-slate-500">
                        <Instagram class="size-4" />
                     </button>
                  </div>
               </div>

               <!-- Action Buttons -->
               <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                     class="py-2.5 px-5 bg-gradient-to-r from-primary to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-sm uppercase rounded shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                     on:click={openModal}
                  >
                     <ShoppingCart class="size-4" />
                     BUY NOW
                  </button>
                  <a href="/" class="py-2.5 px-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold text-sm uppercase rounded flex items-center justify-center gap-2 transition-colors">
                     <ArrowLeft class="size-4" />
                     BACK
                  </a>
               </div>
            </div>
         </div>
      </div>

      <!-- Detail Separator -->
      <div class="flex items-center gap-4 pb-4 max-w-full mx-auto">
          <div class="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          <div class="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold text-sm uppercase tracking-wider">
              <Info class="size-4 fill-red-600 text-white dark:text-slate-900" />
              DETAIL
          </div>
          <div class="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
      </div>

      <!-- Expanded Details (Continuous Block) -->
      <div class="bg-white dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm p-8 space-y-8">
          
          <!-- Description -->
          <div>
              <h3 class="text-sm font-bold text-red-600 dark:text-red-500 mb-2 uppercase tracking-wide">
                  PRODUCT DESCRIPTION
              </h3>
              <div class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-1">
                  <p>- {product.description}</p>
                  <p>- Facebook accounts from a random country.</p>
                  <p>- The advertising spend limit is $250/day (can change the timezone, currency, and country before adding the card).</p>
                  <p>- Account has enabled the Two-factor authentication (2FA) security feature.</p>
                  <p>- You will receive an account registered in 2025. Please consider this before buying!</p>
              </div>
          </div>

          <!-- Warranty -->
          <div>
              <h3 class="text-sm font-bold text-red-600 dark:text-red-500 mb-2 uppercase tracking-wide">
                  WARRANTY POLICY
              </h3>
              <div class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-1">
                  <p class="font-bold text-slate-900 dark:text-white mb-1">Refund to website account or exchange for another account if:</p>
                  <p>- The password is incorrect or the email password is incorrect on the first login (Validity period within the first 30 minutes after purchase).</p>
                  <p>- The account details do not match the detailed description we have provided (Validity period within the first 30 minutes after purchase).</p>
                  <p>- The account has had advertising features disabled or restricted before purchase (Validity period within the first 30 minutes after purchase).</p>
              </div>
          </div>

          <!-- Instructions -->
          <div>
              <h3 class="text-sm font-bold text-red-600 dark:text-red-500 mb-2 uppercase tracking-wide">
                  INSTRUCTION
              </h3>
              <div class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-1">
                  <p>- Log in just like a normal Facebook account.</p>
                  <p>- If you are a newbie and do not know how to log in, please contact the administrator for guidance.</p>
                  <p>- After successfully logging in, customers are advised to share their ad account with multiple other Facebook accounts to minimize the risk.</p>
              </div>
          </div>

          <!-- Notes -->
          <div>
              <h3 class="text-sm font-bold text-red-600 dark:text-red-500 mb-2 uppercase tracking-wide">
                  NOTE
              </h3>
              <div class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm space-y-1">
                  <p>- Please log in and check immediately after purchase to ensure your warranty rights.</p>
                  <p>- Within the first 24 hours after purchase, do not change any account information to make the warranty inspection process easier.</p>
                  <p>- To ensure safety, 2 days from the date of purchase, you need to change Facebook password, Email password and Recovery email (if any).</p>
                  <p>- Absolutely do not use the Forgot Password feature, as using this feature will disable the email checkpoint functionality.</p>
                  <p>- Using a dirty IP (IP blocked) can cause the login process to notify you of an incorrect password.</p>
              </div>
          </div>

      </div>

      <!-- Buy Now Modal Logic -->
      <BuyNowModal 
         isOpen={isModalOpen} 
         product={{ title: product.title, price: product.price, stock: product.stock, description: product.description }} 
         onclose={() => isModalOpen = false} 
      />

    {:else}
      <div class="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 class="text-3xl font-bold mb-4">Product Not Found</h1>
        <p class="text-slate-500 mb-6">The product you are looking for might have been removed.</p>
        <a href="/" class="btn btn-primary">Go Home</a>
      </div>
    {/if}
  </main>

  <Footer />
</div>
