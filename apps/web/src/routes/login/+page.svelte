<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
  
  let showPassword = false;
  
  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  
  <main class="flex-grow flex items-center justify-center p-4 py-12 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
    <!-- Subtle Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
    <!-- Abstract Background Decoration Removed -->

    <div class="w-full max-w-[480px] relative z-10">
      <!-- Login Card -->
      <!-- Mobile: Transparent/Native feel | Desktop: Card with Shadow -->
      <div class="bg-transparent md:bg-white md:dark:bg-slate-800 rounded-none md:rounded-xl shadow-none md:shadow-xl border-0 md:border md:border-gray-100 md:dark:border-gray-700 p-2 md:p-10 transition-colors">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">LOGIN</h1>
          <p class="text-slate-500 dark:text-gray-400 text-base">Welcome back to your premium digital store.</p>
        </div>
        
        <!-- Form -->
        <form class="flex flex-col gap-5">
          <!-- Email Field -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-gray-200" for="email">Email Address</label>
            <div class="relative flex items-center">
              <span class="absolute left-4 text-slate-500">
                <Mail class="size-5" />
              </span>
              <input class="w-full bg-gray-50 dark:bg-[#1a1d2d] border border-gray-200 dark:border-gray-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" id="email" placeholder="name@example.com" type="email"/>
            </div>
          </div>
          
          <!-- Password Field -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-900 dark:text-gray-200" for="password">Password</label>
            <div class="relative flex items-center">
              <span class="absolute left-4 text-slate-500">
                <Lock class="size-5" />
              </span>
              <input 
                 class="w-full bg-gray-50 dark:bg-[#1a1d2d] border border-gray-200 dark:border-gray-700 rounded-lg py-3.5 pl-12 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
                 id="password" 
                 placeholder="••••••••" 
                 type={showPassword ? "text" : "password"}
              />
              <button 
                 class="absolute right-4 text-slate-400 hover:text-primary transition-colors flex items-center justify-center" 
                 type="button"
                 on:click={togglePassword}
              >
                 {#if showPassword}
                   <EyeOff class="size-5" />
                 {:else}
                   <Eye class="size-5" />
                 {/if}
              </button>
            </div>
            <div class="flex justify-end mt-1">
              <a class="text-sm font-medium text-primary hover:text-blue-400 transition-colors" href="/">Lupa Password?</a>
            </div>
          </div>
          
          <!-- Primary Button -->
          <button class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-2" type="submit">
            Login
          </button>
          
          <!-- Divider -->
          <div class="relative flex items-center justify-center my-2">
            <div class="h-px bg-gray-200 dark:bg-gray-700 w-full absolute"></div>
            <span class="bg-white dark:bg-slate-800 px-3 relative z-10 text-xs font-medium text-slate-500 uppercase">Or continue with</span>
          </div>
          
          <!-- Telegram Button -->
           <!-- Disabled as per request -->
          <!-- <button class="w-full bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] border border-[#229ED9]/20 font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-3" type="button">
             ... TG Icon ...
             Login dengan Telegram
          </button> -->
          
          <div class="text-center text-xs text-gray-400">
              Social Login disabled.
          </div>
        </form>
        
        <!-- Footer Links -->
        <div class="mt-8 text-center">
          <p class="text-slate-500 dark:text-gray-400 text-sm">
            Belum punya akun? 
            <a class="text-primary font-bold hover:underline ml-1" href="/register">Daftar Sekarang</a>
          </p>
        </div>
      </div>
      
      <!-- Simple Page Footer -->
      <div class="mt-8 flex justify-center gap-6 text-sm text-slate-500 dark:text-gray-500">
        <a class="hover:text-slate-900 dark:hover:text-gray-300" href="/">Privacy Policy</a>
        <a class="hover:text-slate-900 dark:hover:text-gray-300" href="/">Terms of Service</a>
        <a class="hover:text-slate-900 dark:hover:text-gray-300" href="/">Help Center</a>
      </div>
    </div>
  </main>
  
  <Footer />
</div>
