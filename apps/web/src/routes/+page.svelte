<script lang="ts">
  import { products, categories, type Product } from '$lib/data';
  import { siteConfig } from '$lib/config';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import BuyNowModal from '$lib/components/BuyNowModal.svelte';
  import { ArrowRight, ShieldCheck, Bolt, Headset, Star, MonitorPlay, Gamepad2, Grid, Lock } from 'lucide-svelte';

  // Carousel Logic
  let currentSlide = $state(0);
  const heroSlides = [
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9r63uH0kQSTF6CdO8YRXiy3sdlb8gPRpj8cqwRr8--FbYAUI6CsmXzOoLKMfXX21DPFdclKWjKsM-B57X1Bzp3tv19Xc3hOV5zsQ4zCigo68kjHOAhH3-LKyWLrD8OmOOYIhk2xZRcevO5uHj9I1gEgkiuH69QJ8Z6lRJHuzEhRCktB0TK26UBoMDQ-lynRSTfiWYpNQ8USbFcwoIpzyQX4DYpWqrDHCAAffxlO7BYs5vTWg3R1ikWkw5Vs4gdfpgI_ItlpqPWB3z",
        title: 'Buy Premium Accounts <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Instantly</span>',
        description: "Access thousands of premium apps hassle-free. Automatic 24/7 delivery directly to your email in seconds.",
        badge: {
            text: "Instant Delivery",
            style: "bg-blue-500/20 border-blue-500/30",
            dotColor: "bg-blue-400",
            textColor: "text-blue-300"
        }
    },
    {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhDJdyMBdka8n56wwXe1feEkpcfOQU5dgl0uKfzNcM-wmeRG1ewU3e6WYYEat12PldnWCyjeeZOD_JXNUAEb2zj57r7fmhnKMGLs-hp1Ne-_tEH9FJP3A2wi_H0xKSAC3P9j1IlrF3RPShD3wzKNqIeLWSMc-y0b1N38JOBBK4HEiD6Q14ipl3vYEiJegDmiS6H3xwXFll45IA2nTNGfg7jIwsBykvGKRa6AOp_-CR_chxSpxX3zl6NFfVUBDEwbF-eJ2EU5i-HEge",
        title: 'Cheapest Game <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Top Up</span>',
        description: "Valorant, Mobile Legends, Steam Wallet and more. Low prices, lightning fast process, 100% safe guarantee.",
        badge: {
            text: "Popular Games",
            style: "bg-red-500/20 border-red-500/30",
            dotColor: "bg-red-400",
            textColor: "text-red-300"
        }
    }
  ];

  // Modal state
  let isModalOpen = $state(false);
  let selectedProduct: Product | undefined = $state(undefined);

  function openModal(product: Product) {
      selectedProduct = product;
      isModalOpen = true;
  }

  // Auto slide effect
  $effect(() => {
    const timer = setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  
  <main class="flex flex-1 flex-col items-center px-4 md:px-8 pb-10">
    <div class="flex flex-col w-full max-w-[1200px] gap-12">
      
      <!-- Hero Carousel -->
      <section class="mt-8 relative w-full h-[540px] md:h-auto md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-slate-800">
        <!-- Slides -->
        {#each heroSlides as slide, i}
            <div class="absolute inset-0 transition-opacity duration-1000 ease-in-out {currentSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}">
                <!-- Background Image -->
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear {currentSlide === i ? 'scale-110' : 'scale-100'}" style='background-image: url("{slide.image}");'></div>
                
                <!-- Gradient Overlay -->
                <!-- Mobile: Bottom-to-Top (to darken text area at bottom) | Desktop: Left-to-Right (standard hero) -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent md:bg-gradient-to-r md:from-slate-950 md:via-slate-900/80 md:to-slate-900/10"></div>
                
                <!-- Content -->
                <div class="relative h-full flex flex-col justify-end px-6 md:px-16 max-w-3xl pb-12 md:pb-14">
                    <div class="flex flex-col gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100" class:invisible={currentSlide !== i}>
                        {#if slide.badge}
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border w-fit backdrop-blur-md {slide.badge.style}">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 {slide.badge.dotColor}"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 {slide.badge.dotColor}"></span>
                                </span>
                                <span class="text-[10px] md:text-xs font-bold uppercase tracking-wide {slide.badge.textColor}">{slide.badge.text}</span>
                            </div>
                        {/if}
                        
                        <h1 class="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                            {@html slide.title}
                        </h1>
                        
                        <p class="text-base md:text-lg text-slate-100 font-medium leading-relaxed max-w-xl drop-shadow-md">
                            {slide.description}
                        </p>
                    </div>
                    
                    <div class="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200" class:invisible={currentSlide !== i}>
                        <a href="#products" class="h-10 md:h-12 px-6 md:px-8 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm md:text-base font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 no-underline justify-center">
                            View Products
                            <ArrowRight class="size-4 md:size-5" />
                        </a>
                        <a href="#features" class="h-10 md:h-12 px-6 md:px-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-sm md:text-base font-semibold transition-all flex items-center justify-center no-underline">
                            How It Works
                        </a>
                    </div>

                    <!-- Trust Badges (Hidden on mobile to reduce clutter) -->
                    <div class="hidden md:flex items-center gap-6 mt-8 pt-6 border-t border-white/10 w-full max-w-lg animate-in fade-in duration-1000 delay-300" class:invisible={currentSlide !== i}>
                        <div class="flex items-center gap-2">
                           <ShieldCheck class="text-emerald-400 size-5" />
                           <span class="text-sm font-medium text-slate-300">Full Warranty</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <Bolt class="text-yellow-400 size-5" />
                           <span class="text-sm font-medium text-slate-300">1 Second Process</span>
                        </div>
                     </div>
                </div>
            </div>
        {/each}

        <!-- Controls -->
        <div class="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {#each heroSlides as _, i}
                <button 
                    onclick={() => currentSlide = i}
                    class="h-1.5 rounded-full transition-all duration-300 {currentSlide === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white/80'}"
                    aria-label="Go to slide {i + 1}"
                ></button>
            {/each}
        </div>
      </section>
      
      <!-- Why Choose Us -->
      <section>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
               <div class="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <Bolt class="size-8" />
               </div>
               <div>
                  <h3 class="font-bold text-lg mb-1">Instant Delivery</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Automatic system sends your order in just 1 second after payment.</p>
               </div>
           </div>
           <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div class="size-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                 <ShieldCheck class="size-8" />
              </div>
              <div>
                 <h3 class="font-bold text-lg mb-1">Secure Transaction</h3>
                 <p class="text-sm text-slate-500 dark:text-slate-400">Every transaction is protected by SSL encryption and money-back guarantee if failed.</p>
              </div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
             <div class="size-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <Headset class="size-8" />
             </div>
             <div>
                <h3 class="font-bold text-lg mb-1">Layanan 24/7</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">Tim support kami siap membantu kapanpun kamu mengalami kendala.</p>
             </div>
          </div>
        </div>
      </section>
      
      <!-- Categories -->
      <section id="products">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
          <a class="text-primary font-medium text-sm hover:underline" href="/">View All</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
           {#each categories as cat}
             {@const Icon = cat.icon}
             <div class="group cursor-pointer relative overflow-hidden rounded-xl aspect-[4/3] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style='background-image: url("{cat.image}");'></div>
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-4 w-full">
                   <div class="flex items-center gap-2 mb-1">
                      <Icon class="text-white size-4" />
                       {#if cat.title === 'Streaming'}
                         <span class="text-xs font-bold text-green-400 uppercase tracking-wider">Popular</span>
                       {/if}
                   </div>
                   <h3 class="text-white text-lg font-bold">{cat.title}</h3>
                   <p class="text-slate-300 text-xs mt-1">{cat.desc}</p>
                </div>
             </div>
           {/each}
        </div>
      </section>
      
      <!-- Featured Products -->
      <section>
         <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
               <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Produk Pilihan</h2>
               <span class="hidden sm:inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase">Hot Deals</span>
            </div>
         </div>
         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {#each products.slice(0, siteConfig.homepage.featuredProductsLimit) as product}
              <ProductCard 
                 {...product} 
                 image={product.image || ''}
                 on:buy={() => openModal(product)}
              />
            {/each}
         </div>
      </section>
      
      <!-- Testimonials -->
      <section class="py-8 border-t border-slate-200 dark:border-slate-700/50">
         <div class="text-center mb-10">
            <h2 class="text-2xl font-bold mb-2">Apa Kata Mereka?</h2>
            <p class="text-slate-500 dark:text-slate-400">Ribuan pelanggan puas dengan layanan otomatis kami.</p>
         </div>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Testimonial 1 -->
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative">
               <div class="text-yellow-400 flex mb-4 gap-1">
                  {#each Array(5) as _} <Star class="size-4 fill-current" /> {/each}
               </div>
               <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 italic">"This is crazy, accounts sent to email instantly after payment. No need to wait for admin reply. Highly recommended!"</p>
               <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-gray-200 overflow-hidden">
                     <img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWMEpiHGEv5zhY7ork8779hOU_cC7UtKoWZj-hjqV7jxrkuGELb-o6UIhdX34eKPeJ65xxDzynBHGWHWCqlJfK_0eQ-VwGZN63ynVi4pOq8JfGdieF10TLT7exLzjSOdLqV9AKwWupj_SB_xqLZY7BWjC86TpIxkoKDVrvcXVX_LJD9nTEve1SUtSxNfmJxF5SE-Lqa4JSvBd2523jBAY_Zqe4AWkFsF4RIrKdQyH28C83pSHA5iCvV5Z_IpATtFbjffTEEH4DZa_j"/>
                  </div>
                  <div>
                     <p class="font-bold text-sm">Budi Santoso</p>
                     <p class="text-xs text-slate-400">Gamer</p>
                  </div>
               </div>
            </div>
             <!-- Testimonial 2 -->
             <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative">
               <div class="text-yellow-400 flex mb-4 gap-1">
                  {#each Array(5) as _} <Star class="size-4 fill-current" /> {/each}
               </div>
               <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 italic">"Cheapest price compared to other shops, but premium quality. CS is also fast response when I was confused how to redeem."</p>
               <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-gray-200 overflow-hidden">
                     <img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkh-tE-ET4M6zuq2ntmH4ZgsGp1amf0Vbq6535wGo-g-ZW3NzeDJqfb9r2vQYM2ZSJKOQMhKc3o42SCji8T8Zc0wYSyxGiQl6WMcD-MWnbHjlIW6qanRV8Zw2_-den5SA7vnhEUkrjIe3qTm2y3PdsflhcRMYoREPdcoZ1nSH1nmlcfSnD3zQXHVDTDTm_tUzYGHUjmM8YSpqLbSs8TzQDvQPu-q4kziufvTJPMbrYsp-BGMcN87wDu5eUFl1HdVerhoLnveH26T9s"/>
                  </div>
                  <div>
                     <p class="font-bold text-sm">Siti Aminah</p>
                     <p class="text-xs text-slate-400">Mahasiswa</p>
                  </div>
               </div>
            </div>
             <!-- Testimonial 3 -->
             <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative">
               <div class="text-yellow-400 flex mb-4 gap-1">
                  {#each Array(4) as _} <Star class="size-4 fill-current" /> {/each}
                  <Star class="size-4 fill-current text-yellow-400/50" />
               </div>
               <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 italic">"Subscribed Netflix here for 3 months. Safe and secure, anti-hold. Helps save streaming budget."</p>
               <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-gray-200 overflow-hidden">
                     <img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUkycVj8uJpqeKtttmiaBT8yE6DpwV6AVEcOf4XELgc-FPnFrDbfT3R8-1ldu7HPoo2JX1-guRxIDZ_6Z17TK6N0WdvEwAnBS64XgWyxlBZ710-EhdafRs_epDLCdnCGmT2Jg3lOIZ_tPI8G_NVW2E0mPrRv2OJIuYSSLS9MY8VFrPrWWphpaCSrycQLKF_QOYlRxGhNmR4LD9LRZjF0aXbDxqpo_WW88mul7_msK4wDl2fD6mHneE2ontcg24m2azf2JBqO6s37Qo"/>
                  </div>
                  <div>
                     <p class="font-bold text-sm">Kevin Wijaya</p>
                     <p class="text-xs text-slate-400">Freelancer</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  </main>
  
  <Footer />

  <BuyNowModal 
      bind:isOpen={isModalOpen} 
      product={selectedProduct} 
  />
</div>
