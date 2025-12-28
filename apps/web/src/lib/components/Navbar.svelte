<script lang="ts">
  import { Search, ShoppingCart, ShoppingBag, User, Menu, Bolt, X } from 'lucide-svelte';
  import { siteConfig } from '$lib/config';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<div class="sticky top-0 z-50 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div class="flex justify-center w-full px-4 md:px-8 py-3">
    <div class="flex items-center justify-between w-full max-w-[1200px] gap-4">
      <!-- Brand -->
      <a href="/" class="flex items-center gap-2 text-slate-900 dark:text-white">
        <div class="size-8 text-primary flex items-center justify-center">
          <Bolt class="size-8" />
        </div>
        <h2 class="text-xl font-bold tracking-tight">{siteConfig.siteName}</h2>
      </a>
      
      <!-- Search -->
      <div class="hidden md:flex flex-1 max-w-lg mx-8">
        <label class="relative flex w-full items-center">
          <div class="absolute left-4 text-slate-400 flex items-center pointer-events-none">
            <Search class="size-5" />
          </div>
          <input class="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400" placeholder="Search for accounts, keys, or software..." value=""/>
        </label>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        <a class="hidden sm:block text-sm font-medium hover:text-primary transition-colors" href="/user">My Orders</a>
        <div class="flex gap-2">
          <a href="/cart" class="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative">
            <ShoppingCart class="size-5" />
            <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
          </a>
          
          <a href="/login" class="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/30">
            Login
          </a>
          <a href="/register" class="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
            Register
          </a>
           <!-- Mobile Menu Trigger -->
           <button class="sm:hidden flex items-center justify-center size-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200" onclick={toggleMobileMenu}>
             <Menu class="size-5" />
           </button>
      </div>
    </div>
  </div>
</div>
</div>

<!-- Mobile Menu Overlay - OUTSIDE sticky container -->
{#if isMobileMenuOpen}
  <div class="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm transition-opacity" transition:fade={{ duration: 200 }} onclick={toggleMobileMenu} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && toggleMobileMenu()}></div>

  <div class="fixed inset-y-0 right-0 z-[99999] w-[300px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 gap-6 transition-transform" transition:fly={{ x: 300, duration: 300, opacity: 1 }}>
      <!-- Drawer Header -->
      <div class="flex items-center justify-between">
          <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Menu</span>
          <button class="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onclick={toggleMobileMenu}>
              <X class="size-5 text-slate-500" />
          </button>
      </div>
      
      <!-- Drawer Content -->
      <nav class="flex flex-col gap-2 text-left w-full flex-1">
          <a href="/" class="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onclick={toggleMobileMenu}>
              <Bolt class="size-5" />
              Home
          </a>
          <a href="/user" class="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onclick={toggleMobileMenu}>
              <ShoppingBag class="size-5" />
              My Orders
          </a>
          
          <div class="my-2 border-t border-slate-100 dark:border-slate-800"></div>

          <a href="/login" class="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onclick={toggleMobileMenu}>
              <User class="size-5" />
              Login
          </a>
      </nav>

      <!-- Drawer Footer -->
      <a href="/register" class="w-full py-3 items-center justify-center rounded-lg bg-primary text-white text-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex gap-2" onclick={toggleMobileMenu}>
          Register Account
      </a>
  </div>
{/if}
