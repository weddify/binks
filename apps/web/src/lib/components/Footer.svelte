<script lang="ts">
  import { Bolt, Facebook, Twitter, Instagram } from 'lucide-svelte';
  import { siteConfig } from '$lib/config';
</script>

<footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
  <div class="container mx-auto px-4 md:px-8 max-w-[1200px]">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div class="col-span-1 md:col-span-1">
        <div class="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
          <Bolt class="text-primary size-8" />
          <span class="text-xl font-bold">{siteConfig.siteName}</span>
        </div>
        <p class="text-slate-500 text-sm leading-relaxed mb-6">
          {siteConfig.meta.description}
        </p>
        <div class="flex gap-3">
          <a class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook class="size-4" />
          </a>
          <a class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter class="size-4" />
          </a>
          <a class="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram class="size-4" />
          </a>
        </div>
        <div class="mt-6 text-sm text-slate-500">
            <p>{siteConfig.contact.onlineHours}</p>
            <p class="mt-1"><a href="mailto:{siteConfig.contact.email}" class="hover:text-primary">{siteConfig.contact.email}</a></p>
             <p class="mt-1"><a href="{siteConfig.contact.whatsapp}" class="hover:text-primary">WhatsApp Support</a></p>
        </div>
      </div>
      <div class="col-span-1">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">Layanan</h4>
        <ul class="flex flex-col gap-2 text-sm text-slate-500">
          <li><a class="hover:text-primary transition-colors" href="#products">Semua Produk</a></li>
          <li><a class="hover:text-primary transition-colors" href="#products">Streaming</a></li>
          <li><a class="hover:text-primary transition-colors" href="#products">Games</a></li>
          <li><a class="hover:text-primary transition-colors" href="#products">Software</a></li>
        </ul>
      </div>
      <div class="col-span-1">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">Dukungan</h4>
        <ul class="flex flex-col gap-2 text-sm text-slate-500">
          <li><a class="hover:text-primary transition-colors" href="/contact">Hubungi Kami</a></li>
          <li><a class="hover:text-primary transition-colors" href="/terms-of-service">Cara Order</a></li>
          <li><a class="hover:text-primary transition-colors" href="/disclaimer">Disclaimer</a></li>
          <li><a class="hover:text-primary transition-colors" href="/warranty-policy">Kebijakan Garansi</a></li>
        </ul>
      </div>
      <div class="col-span-1">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
         <ul class="flex flex-col gap-2 text-sm text-slate-500">
           <li><a class="hover:text-primary transition-colors" href="/terms-of-service">Syarat & Ketentuan</a></li>
           <li><a class="hover:text-primary transition-colors" href="/privacy-policy">Kebijakan Privasi</a></li>
        </ul>
      </div>
      <div class="col-span-1">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">Metode Pembayaran</h4>
        <div class="flex flex-wrap gap-2">
          <div class="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">BCA</div>
          <div class="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">BRI</div>
          <div class="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">QRIS</div>
          <div class="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">DANA</div>
        </div>
      </div>
    </div>
    <div class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-slate-400">© 2023 {siteConfig.siteName}. All rights reserved.</p>
      <p class="text-sm text-slate-400">Made with 💙 for Gamers</p>
    </div>
  </div>
</footer>
