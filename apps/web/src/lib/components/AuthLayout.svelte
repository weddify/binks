<script lang="ts">
  import { fade } from 'svelte/transition';
  
  interface Props {
    title: string;
    subtitle: string;
    children: any;
    footer?: any;
    showSocialFooter?: boolean;
  }

  let { title, subtitle, children, footer, showSocialFooter = true }: Props = $props();
</script>

<div class="flex flex-col w-full h-full flex-grow">
  <div class="flex-grow flex items-center justify-center p-4 py-12 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
    
    <!-- Card Container -->
    <div class="w-full max-w-[480px] relative z-10" in:fade={{ duration: 300 }}>
      <!-- Card -->
      <div class="bg-transparent md:bg-white md:dark:bg-slate-800 rounded-none md:rounded-2xl shadow-none md:shadow-xl border-0 md:border md:border-gray-100 md:dark:border-gray-700 overflow-hidden transition-all duration-300">
        
        <!-- Header & Content Wrapper -->
        <div class="p-2 md:p-8">
          <!-- Heading -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h1>
            <p class="text-slate-500 dark:text-gray-400 text-base">
              {subtitle}
            </p>
          </div>

          <!-- Main Form Slot -->
          {@render children?.()}
        </div>

        <!-- Footer Slot (e.g. "Don't have an account?") -->
        {#if footer}
          <div class="bg-transparent md:bg-gray-50 md:dark:bg-[#151925] px-8 py-5 text-center border-t-0 md:border-t md:border-gray-100 md:dark:border-gray-700/50">
             {@render footer?.()}
          </div>
        {/if}
      </div>

       <!-- Links Footer (Terms, Privacy) -->
       {#if showSocialFooter}
        <div class="mt-8 flex justify-center gap-6 text-sm text-slate-500 dark:text-gray-500">
            <a class="hover:text-slate-900 dark:hover:text-gray-300 transition-colors" href="/privacy-policy">Privacy Policy</a>
            <a class="hover:text-slate-900 dark:hover:text-gray-300 transition-colors" href="/terms-of-service">Terms of Service</a>
            <a class="hover:text-slate-900 dark:hover:text-gray-300 transition-colors" href="/help">Help Center</a>
        </div>
       {/if}
    </div>
  </div>
</div>
