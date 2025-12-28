<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { ShoppingCart } from 'lucide-svelte';
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  
  <main class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900">
      <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-md w-full">
        <div class="size-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
             <ShoppingCart class="size-8" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Cart</h1>
        <p class="text-slate-500 mb-6">This feature is coming soon! You can browse products and checkout directly for now.</p>
        
        <a href="/" class="block w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
            Continue Shopping
        </a>
      </div>
  </main>
  
  <Footer />
</div>
