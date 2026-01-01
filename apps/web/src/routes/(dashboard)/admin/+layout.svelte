<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Store, Menu, Folder, Ticket, ChevronLeft, ChevronRight, FileText } from 'lucide-svelte';
  import { slide, fade } from 'svelte/transition';
  import TopBar from '$lib/components/admin/TopBar.svelte';
  import { siteConfig } from '$lib/config';

  let { children } = $props();
  let isMobileMenuOpen = $state(false);
  let isSidebarCollapsed = $state(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Folder },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function toggleSidebar() {
    isSidebarCollapsed = !isSidebarCollapsed;
  }
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex text-slate-900 dark:text-white">
  
  <!-- Sidebar (Desktop) -->
  <aside 
    class="hidden lg:flex bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out"
    class:w-64={!isSidebarCollapsed}
    class:w-20={isSidebarCollapsed}
  >
     <!-- Logo Area -->
     <div class="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-700" class:justify-center={isSidebarCollapsed}>
        <div class="flex items-center gap-2 font-black text-xl tracking-tight overflow-hidden whitespace-nowrap">
           <div class="size-8 min-w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              B
           </div>
           {#if !isSidebarCollapsed}
             <span transition:fade={{ duration: 100 }}>{siteConfig.siteName}</span>
           {/if}
        </div>
     </div>

     <!-- Navigation -->
     <nav class="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {#if !isSidebarCollapsed}
            <div class="text-xs font-bold text-slate-400 uppercase px-3 mb-2 tracking-wider whitespace-nowrap" transition:fade>Main Menu</div>
        {/if}

        {#each navigation as item}
           {@const isActive = $page.url.pathname === item.href}
           {@const Icon = item.icon}
           <a 
              href={item.href}
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group overflow-hidden whitespace-nowrap {isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'} {isSidebarCollapsed ? 'justify-center' : ''}"
              title={isSidebarCollapsed ? item.name : ''}
           >
              <Icon class="size-5 min-w-5 transition-transform group-hover:scale-110 {isActive ? 'fill-blue-600/20' : ''}" />
              {#if !isSidebarCollapsed}
                  <span transition:fade={{ duration: 100 }}>{item.name}</span>
              {/if}
           </a>
        {/each}
     </nav>

     <!-- Sidebar Toggle -->
     <button 
        onclick={toggleSidebar}
        class="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm z-50 hidden lg:flex"
     >
        {#if isSidebarCollapsed}
            <ChevronRight class="size-3" />
        {:else}
            <ChevronLeft class="size-3" />
        {/if}
     </button>

     <!-- Bottom Actions -->
     <div class="p-3 border-t border-slate-100 dark:border-slate-700 space-y-1 overflow-hidden">
        <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all group whitespace-nowrap {isSidebarCollapsed ? 'justify-center' : ''}" title={isSidebarCollapsed ? 'Back to Store' : ''}>
           <Store class="size-5 min-w-5" />
           {#if !isSidebarCollapsed}
               <span transition:fade={{ duration: 100 }}>Back to Store</span>
           {/if}
        </a>
        <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all whitespace-nowrap {isSidebarCollapsed ? 'justify-center' : ''}" title={isSidebarCollapsed ? 'Logout' : ''}>
           <LogOut class="size-5 min-w-5" />
           {#if !isSidebarCollapsed}
               <span transition:fade={{ duration: 100 }}>Logout</span>
           {/if}
        </button>
     </div>
  </aside>

  <!-- TopBar (Replaces Mobile Header) -->
  <div class="">
    <TopBar onMenuClick={toggleMobileMenu} {isSidebarCollapsed} />
  </div>

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

  <!-- Main Content -->
  <main 
    class="flex-1 flex flex-col min-h-screen pt-16 lg:pt-10 transition-all duration-300 ease-in-out"
    class:lg:pl-64={!isSidebarCollapsed}
    class:lg:pl-20={isSidebarCollapsed}
  >
     <div class="p-6 lg:p-10 max-w-full mx-auto w-full transition-all duration-300">
        {@render children()}
     </div>
  </main>

</div>
