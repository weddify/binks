<script lang="ts">
  import { page } from '$app/stores';
  import { ShieldAlert, Home, Ghost, ArrowLeft } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  let status = $derived($page.status);
  let message = $derived($page.error?.message || 'Something went wrong');

  const errorContent = {
    404: {
      title: 'Page Not Found',
      description: "Oops! Looks like you've wandered into the digital void.",
      icon: Ghost,
      color: 'text-indigo-500'
    },
    500: {
      title: 'Server Error',
      description: "It's not you, it's us. Our servers are having a moment.",
      icon: ShieldAlert,
      color: 'text-red-500'
    },
    default: {
      title: 'An Error Occurred',
      description: 'Something unexpected happened.',
      icon: ShieldAlert,
      color: 'text-orange-500'
    }
  };

  let content = $derived(errorContent[status as keyof typeof errorContent] || errorContent.default);
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
  <div class="max-w-md w-full text-center space-y-6">
    
    <!-- Icon Container -->
    <div class="mx-auto size-24 rounded-3xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center relative overflow-hidden group">
      <div class="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent dark:from-slate-800 opacity-50"></div>
      
      <!-- Animated Icon -->
      <div class="relative z-10">
         <content.icon 
            class="size-16 {content.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" 
            strokeWidth={1.5}
         />
      </div>

      <!-- Decorative Rings -->
      <div class="absolute inset-0 border-4 border-slate-50 dark:border-slate-800/50 rounded-3xl"></div>
      <div class="absolute -inset-1 border border-slate-100 dark:border-slate-700 rounded-[28px] opacity-50"></div>
    </div>

    <!-- Text Content -->
    <div class="space-y-2">
      <h1 class="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">{status}</h1>
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">{content.title}</h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
        {content.description}
        {#if status !== 404 && status !== 500}
           <br/><span class="text-xs font-mono mt-2 block bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded">{message}</span>
        {/if}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
      <Button href="/" variant="primary" size="lg" class="shadow-xl shadow-primary/20">
        <Home class="size-4 mr-2" />
        Back Home
      </Button>
      <button onclick={() => history.back()} class="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
        <ArrowLeft class="size-4 mr-2" />
        Go Back
      </button>
    </div>

    <!-- Footer -->
    <p class="text-xs text-slate-400 font-medium pt-8">
      &copy; {new Date().getFullYear()} SwiftAcc. All rights reserved.
    </p>

  </div>
</div>
