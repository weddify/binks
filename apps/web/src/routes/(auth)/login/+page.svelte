<script lang="ts">
  import AuthLayout from '$lib/components/AuthLayout.svelte';
  import FormInput from '$lib/components/FormInput.svelte';
  import { Mail, Lock } from 'lucide-svelte';
  
  let showPassword = false;
  
  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<AuthLayout 
    title="LOGIN" 
    subtitle="Welcome back to your premium digital store."
  >
    <!-- Form Content -->
    <form class="flex flex-col gap-5">
      <!-- Email Field -->
      <FormInput 
         id="email" 
         label="Email Address" 
         type="email" 
         placeholder="name@example.com" 
         icon={Mail} 
      />
      
      <!-- Password Field -->
      <div>
        <FormInput 
           id="password" 
           label="Password" 
           type="password" 
           placeholder="••••••••" 
           icon={Lock} 
           showPasswordToggle={true}
        />
        <div class="flex justify-end mt-1">
          <a class="text-sm font-medium text-primary hover:text-blue-400 transition-colors" href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
      
      <!-- Primary Button -->
      <button class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-2 text-sm" type="submit">
        Login
      </button>
      
      <!-- Divider -->
      <div class="relative flex items-center justify-center my-2">
        <div class="h-px bg-gray-200 dark:bg-gray-700 w-full absolute"></div>
        <span class="bg-white dark:bg-slate-800 px-3 relative z-10 text-xs font-medium text-slate-500 uppercase">Or continue with</span>
      </div>
      
      <!-- Social Login Placeholder -->
      <div class="text-center text-xs text-gray-400">
          Social Login disabled.
      </div>
    </form>
    
    <!-- Footer Links -->
    {#snippet footer()}
      <p class="text-slate-500 dark:text-gray-400 text-sm">
        Don't have an account? 
        <a class="text-primary font-bold hover:underline ml-1" href="/register">Register Now</a>
      </p>
    {/snippet}
  </AuthLayout>
