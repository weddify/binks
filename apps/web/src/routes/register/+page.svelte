<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { User, Mail, Lock, Eye, EyeOff } from 'lucide-svelte';
  
  let showPassword = false;
  let showConfirmPassword = false;
  
  function togglePassword() {
    showPassword = !showPassword;
  }
  
  function toggleConfirmPassword() {
    showConfirmPassword = !showConfirmPassword;
  }
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <!-- Main Content -->
  <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
    <!-- Subtle Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
    
    <!-- Mobile: Transparent/Native feel | Desktop: Card with Shadow -->
    <div class="w-full max-w-[520px] bg-transparent md:bg-white md:dark:bg-slate-800 rounded-none md:rounded-2xl shadow-none md:shadow-xl border-0 md:border md:border-gray-100 md:dark:border-gray-700 overflow-hidden relative z-10 backdrop-blur-sm transition-colors">
      <div class="px-2 pt-2 pb-6 md:px-8 md:pt-8">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">DAFTAR</h1>
          <p class="text-gray-500 dark:text-gray-400 text-base">
            Buat akun baru untuk akses instan ke produk digital premium.
          </p>
        </div>
        
        <!-- Registration Form -->
        <form action="#" class="space-y-5" method="POST">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" for="fullname">Nama Lengkap</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User class="size-5" />
              </div>
              <input class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1d2d] text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" id="fullname" name="fullname" placeholder="John Doe" type="text"/>
            </div>
          </div>
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" for="email">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail class="size-5" />
              </div>
              <input class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1d2d] text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" id="email" name="email" placeholder="nama@email.com" type="email"/>
            </div>
          </div>
          
          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" for="password">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock class="size-5" />
              </div>
              <input 
                class="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1d2d] text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" 
                id="password" 
                name="password" 
                placeholder="******" 
                type={showPassword ? "text" : "password"}
              />
              <button 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" 
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
            
            <!-- Password Strength Indicator -->
            <div class="mt-3">
              <div class="flex gap-1.5 h-1.5 w-full">
                <div class="flex-1 rounded-full bg-emerald-500"></div>
                <div class="flex-1 rounded-full bg-emerald-500"></div>
                <div class="flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div class="flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <p class="text-xs text-emerald-600 mt-1.5 font-medium">Kekuatan Password: Sedang</p>
            </div>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" for="confirm_password">Konfirmasi Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <Lock class="size-5" />
              </div>
              <input 
                class="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1d2d] text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" 
                id="confirm_password" 
                name="confirm_password" 
                placeholder="******" 
                type={showConfirmPassword ? "text" : "password"}
              />
              <button 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" 
                type="button"
                on:click={toggleConfirmPassword}
              >
                {#if showConfirmPassword}
                  <EyeOff class="size-5" />
                {:else}
                  <Eye class="size-5" />
                {/if}
              </button>
            </div>
          </div>
          
          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input class="checkbox checkbox-primary checkbox-sm rounded" id="terms" name="terms" type="checkbox"/>
            </div>
            <div class="ml-3 text-sm">
              <label class="font-medium text-gray-700 dark:text-gray-300" for="terms">Saya setuju dengan <a class="text-primary hover:text-primary-dark hover:underline" href="/">Syarat & Ketentuan</a></label>
            </div>
          </div>
          
          <!-- Submit Button -->
          <button class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98]" type="submit">
            Daftar Sekarang
          </button>
        </form>
        
      </div>
      
      <!-- Card Footer -->
      <div class="bg-transparent md:bg-gray-50 md:dark:bg-[#151925] px-8 py-5 text-center border-t-0 md:border-t md:border-gray-100 md:dark:border-gray-700/50">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Sudah punya akun? 
          <a class="font-bold text-primary hover:text-primary-dark transition-colors" href="/login">Login</a>
        </p>
      </div>
    </div>
  </main>
  
  <Footer />
</div>
