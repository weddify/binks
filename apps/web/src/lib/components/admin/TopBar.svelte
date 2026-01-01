<script lang="ts">
  import { Search, Bell, Menu, User, LogOut, Settings } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';

  let { onMenuClick, isSidebarCollapsed = false } = $props<{ onMenuClick: () => void, isSidebarCollapsed?: boolean }>();

  let isProfileOpen = $state(false);
  let isNotificationsOpen = $state(false);
  
  // Mock User
  const user = {
      name: 'John Doe',
      role: 'Admin',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  };

  function toggleProfile() {
      isProfileOpen = !isProfileOpen;
      if(isProfileOpen) isNotificationsOpen = false;
  }

  function toggleNotifications() {
      isNotificationsOpen = !isNotificationsOpen;
      if(isNotificationsOpen) isProfileOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
        isProfileOpen = false;
        isNotificationsOpen = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<header class="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 fixed top-0 right-0 left-0 {isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'} z-30 px-4 sm:px-6 flex items-center justify-between transition-all duration-300">
    
    <!-- Left: Mobile Menu & Search -->
    <div class="flex items-center gap-4 flex-1">
        <button onclick={onMenuClick} class="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Menu class="size-6" />
        </button>

        <!-- Search (Hidden on small mobile) -->
        <div class="hidden sm:flex items-center max-w-md w-full relative group">
            <Search class="absolute left-3 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder="Search (Ctrl+/)" 
                class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
            <div class="absolute right-3 hidden md:flex gap-1">
                <kbd class="kbd kbd-xs bg-white dark:bg-slate-800 border-b-2">⌘</kbd>
                <kbd class="kbd kbd-xs bg-white dark:bg-slate-800 border-b-2">K</kbd>
            </div>
        </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        
        <!-- Notifications -->
        <div class="relative dropdown-container">
            <button onclick={toggleNotifications} class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors relative">
                <Bell class="size-5" />
                <span class="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            {#if isNotificationsOpen}
                <div class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 class="font-bold text-slate-900 dark:text-white">Notifications</h3>
                        <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">4 New</span>
                    </div>
                    <div class="max-h-[300px] overflow-y-auto">
                        {#each Array(4) as _, i}
                        <div class="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3">
                            <div class="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                <span class="font-bold text-xs">NC</span>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">New customer registered</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2 minutes ago</p>
                            </div>
                        </div>
                        {/each}
                    </div>
                    <div class="p-3 text-center border-t border-slate-100 dark:border-slate-700">
                        <button class="text-xs font-bold text-primary hover:underline">View All Notifications</button>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Profile -->
        <div class="relative dropdown-container">
            <button onclick={toggleProfile} class="flex items-center gap-3 p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <div class="hidden md:flex flex-col items-end mr-1">
                    <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</span>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</span>
                </div>
                <img src={user.avatar} alt="Avatar" class="size-9 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
            </button>

            {#if isProfileOpen}
                <div class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700 md:hidden">
                        <p class="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p class="text-xs text-slate-500">{user.role}</p>
                    </div>
                    <div class="p-2 space-y-1">
                        <a href="/admin/settings" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <User class="size-4" />
                            My Profile
                        </a>
                        <a href="/admin/settings" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <Settings class="size-4" />
                            Settings
                        </a>
                    </div>
                    <div class="p-2 border-t border-slate-100 dark:border-slate-700">
                        <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <LogOut class="size-4" />
                            Logout
                        </button>
                    </div>
                </div>
            {/if}
        </div>

    </div>
</header>
