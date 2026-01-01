<script lang="ts">
  import { Bolt, Facebook, Twitter, Instagram } from 'lucide-svelte';
  import { siteConfig } from '$lib/config';
  import { PAYMENT_CHANNELS } from '$lib/constants/payments';
</script>

<footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 font-sans">
  <div class="container mx-auto px-4 md:px-8 max-w-[1200px]">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
      <!-- Brand Section (4 cols) -->
      <div class="col-span-1 md:col-span-2 lg:col-span-4 lg:pr-8">
        <div class="flex items-center gap-2.5 mb-5 text-slate-900 dark:text-white">
          <div class="bg-primary/10 p-2 rounded-lg">
             <Bolt class="text-primary size-6" />
          </div>
          <span class="text-2xl font-black tracking-tight">{siteConfig.siteName}</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
          {siteConfig.meta.description} We are committed to providing the best digital services with instant delivery and secure warranties.
        </p>
        
        <div class="space-y-4">
             <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span class="font-bold text-slate-900 dark:text-white min-w-[80px]">Support:</span>
                <span>{siteConfig.contact.onlineHours}</span>
             </div>
             <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span class="font-bold text-slate-900 dark:text-white min-w-[80px]">Email:</span>
                <a href="mailto:{siteConfig.contact.email}" class="hover:text-primary transition-colors">{siteConfig.contact.email}</a>
             </div>
        </div>

        <div class="flex gap-3 mt-8">
          {#each [
              { icon: Facebook, href: 'https://facebook.com' },
              { icon: Twitter, href: 'https://twitter.com' },
              { icon: Instagram, href: 'https://instagram.com' }
          ] as social}
            <a class="size-10 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-primary hover:border-primary hover:text-white transition-all hover:-translate-y-1" href={social.href} target="_blank" rel="noopener noreferrer">
               <social.icon class="size-5" />
            </a>
          {/each}
        </div>
      </div>

      <!-- Links (2 cols) -->
      <div class="col-span-1 lg:col-span-2">
        <h4 class="font-bold text-slate-900 dark:text-white mb-6 text-lg">Services</h4>
        <ul class="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/">
              <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
              All Products
          </a></li>
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/category/streaming">
              <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
              Streaming
          </a></li>
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/category/games">
              <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
              Games
          </a></li>
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/category/software">
              <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
              Software
          </a></li>
        </ul>
      </div>

      <!-- Links (2 cols) -->
      <div class="col-span-1 lg:col-span-2">
        <h4 class="font-bold text-slate-900 dark:text-white mb-6 text-lg">Company</h4>
        <ul class="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/faq">
             <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
             Help Center / FAQ
          </a></li>
           <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/contact">
             <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
             Contact Us
          </a></li>
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/terms-of-service">
             <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
             Terms of Service
          </a></li>
          <li><a class="hover:text-primary transition-colors flex items-center gap-2 group" href="/privacy-policy">
             <span class="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-primary transition-colors"></span>
             Privacy Policy
          </a></li>
        </ul>
      </div>

      <!-- Payments (4 cols) -->
      <div class="col-span-1 md:col-span-2 lg:col-span-4">
        <h4 class="font-bold text-slate-900 dark:text-white mb-6 text-lg">Payment Methods</h4>
        
            <div class="grid grid-cols-4 gap-3">
              {#each PAYMENT_CHANNELS as method}
                 <div class="aspect-[3/2] bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary/50 transition-colors" title={method.name}>
                    <img src={method.logo_path} alt={method.name} class="max-w-full max-h-full object-contain filter dark:brightness-100" />
                 </div>
              {/each}
            </div>
       
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} <span class="text-primary font-bold">{siteConfig.siteName}</span>. All rights reserved.
      </p>
      <div class="flex items-center gap-6">
         <p class="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">Sitemap</p>
         
      </div>
    </div>
  </div>
</footer>
