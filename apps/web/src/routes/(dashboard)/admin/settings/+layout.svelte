<script lang="ts">
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import { CircleCheck, Globe, CreditCard, LayoutTemplate } from 'lucide-svelte'; // LayoutTemplate for Hero

  import Header from '$lib/components/admin/Header.svelte';

  let showToast = $state(false);

  // Expose toast trigger to children via context or just use a shared store if needed. 
  // For now, simpler to maybe keep toast logic here or let children handle it.
  // Actually, the original page had a toast. I'll keep the toast UI here in the layout 
  // and maybe expose a store or just let each page handle its own toast for now to avoid complexity 
  // unless I move toast to a global store.
  // The user didn't ask for a complex toast refactor, so I'll let each page handle its saving state/toast for simplicity,
  // OR I can put the toast container here.
  // Let's stick to the requested structural change.

  const tabs = [
    { name: 'General', href: '/admin/settings/general', icon: Globe },
    { name: 'Payment & Features', href: '/admin/settings/payment', icon: CreditCard },
    { name: 'Content Configuration', href: '/admin/settings/content', icon: LayoutTemplate },
  ];

  let { children } = $props();
</script>

<div class="space-y-3">
  <!-- Header -->
  <Header 
      title="Settings" 
      description="Configure your store preferences and integrations."
  />

  <!-- Tabs -->
  <div class="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
    <nav class="flex space-x-8" aria-label="Tabs">
      {#each tabs as tab}
        {@const isActive = $page.url.pathname.startsWith(tab.href)}
        {@const Icon = tab.icon}
        <a 
          href={tab.href}
          class="flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {isActive ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'}"
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon class="size-4" />
          {tab.name}
        </a>
      {/each}
    </nav>
  </div>

  <!-- Content -->
  <div>
    {@render children()}
  </div>
</div>
