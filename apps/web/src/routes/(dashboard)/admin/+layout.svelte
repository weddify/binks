<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Store, Menu, Folder, Ticket } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import TopBar from '$lib/components/admin/TopBar.svelte';
  import { siteConfig } from '$lib/config';

  let { children } = $props();
  let isMobileMenuOpen = $state(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Folder },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex text-slate-900 dark:text-white">
  
  <!-- Sidebar (Desktop) -->
  <aside class="hidden lg:flex w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col fixed inset-y-0 z-50">
     <!-- Logo Area -->
     <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-2 font-black text-xl tracking-tight">
           <div class="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              B
           </div>
           <span>{siteConfig.siteName}</span>
        </div>
     </div>

     <!-- Navigation -->
     <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <div class="text-xs font-bold text-slate-400 uppercase px-3 mb-2 tracking-wider">Main Menu</div>
        {#each navigation as item}
           {@const isActive = $page.url.pathname === item.href}
           {@const Icon = item.icon}
           <a 
              href={item.href}
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group {isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}"
           >
              <Icon class="size-5 transition-transform group-hover:scale-110 {isActive ? 'fill-blue-600/20' : ''}" />
              <span>{item.name}</span>
           </a>
        {/each}
     </nav>

     <!-- Bottom Actions -->
     <div class="p-4 border-t border-slate-100 dark:border-slate-700 space-y-1">
        <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all group">
           <Store class="size-5" />
           <span>Back to Store</span>
        </a>
        <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
           <LogOut class="size-5" />
           <span>Logout</span>
        </button>
     </div>
  </aside>

  <!-- TopBar (Replaces Mobile Header) -->
  <TopBar onMenuClick={toggleMobileMenu} />

  <!-- Mobile Sidebar Overlay -->
  {#if isMobileMenuOpen}
      <div class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
         <div 
            class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
            role="button" 
            tabindex="0" 
            onclick={toggleMobileMenu} 
            onkeydown={(e) => e.key === 'Escape' && toggleMobileMenu()}
            transition:slide
         ></div>
        <div class="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-slate-800 shadow-xl flex flex-col" transition:slide={{ axis: 'x' }}>
            <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
               <span class="font-black text-xl">Menu</span>
            </div>
            <nav class="flex-1 p-4 space-y-1">
               {#each navigation as item}
                  {@const isActive = $page.url.pathname === item.href}
                  {@const Icon = item.icon}
                  <a 
                     href={item.href}
                     onclick={() => isMobileMenuOpen = false}
                     class="flex items-center gap-3 px-3 py-3 rounded-lg transition-all {isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}"
                  >
                     <Icon class="size-5" />
                     <span>{item.name}</span>
                  </a>
               {/each}
               <div class="my-4 border-t border-slate-100 dark:border-slate-700"></div>
               <a href="/" class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500">
                  <Store class="size-5" />
                  <span>Back to Store</span>
               </a>
            </nav>
        </div>
     </div>
  {/if}

  <!-- Added pt-20 to account for fixed TopBar height + spacing -->
  <main class="flex-1 lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-10 transition-all duration-300">
     <div class="p-6 lg:p-10 max-w-full mx-auto w-full">
        {@render children()}
     </div>
  </main>

</div>
