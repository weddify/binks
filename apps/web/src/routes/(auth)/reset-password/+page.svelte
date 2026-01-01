<script lang="ts">
  import AuthLayout from '$lib/components/AuthLayout.svelte';
  import FormInput from '$lib/components/FormInput.svelte';
  import { Lock, LoaderCircle, CheckCircle, ArrowLeft } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  let isLoading = $state(false);
  let isSuccess = $state(false);
  let password = $state('');
  let confirmPassword = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
    }

    isLoading = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    isLoading = false;
    isSuccess = true;
    toast.success('Password has been reset successfully!');
    
    // Auto redirect after 2 seconds
    setTimeout(() => {
        goto('/login');
    }, 2000);
  }
</script>

<AuthLayout 
    title="RESET PASSWORD" 
    subtitle="Create a new strong password for your account."
  >
    {#if isSuccess}
      <div class="flex flex-col items-center text-center space-y-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div class="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mb-2">
            <CheckCircle class="size-8" />
         </div>
         <h3 class="text-xl font-bold text-slate-900 dark:text-white">All Done!</h3>
         <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
            Your password has been successfully reset. Redirecting you to login...
         </p>
         
         <div class="w-full pt-4">
            <a href="/login" class="w-full block text-center bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                Login Now
            </a>
         </div>
      </div>
    {:else}
      <!-- Form Content -->
      <form onsubmit={handleSubmit} class="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- New Password -->
        <FormInput 
           id="password" 
           label="New Password" 
           type="password" 
           placeholder="••••••••" 
           icon={Lock} 
           bind:value={password}
           showPasswordToggle={true}
           required
        />
        
        <!-- Confirm Password -->
        <FormInput 
           id="confirm-password" 
           label="Confirm Password" 
           type="password" 
           placeholder="••••••••" 
           icon={Lock} 
           bind:value={confirmPassword}
           showPasswordToggle={true}
           required
        />
        
        <!-- Primary Button -->
        <button 
          class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-2 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
          type="submit"
          disabled={isLoading}
        >
          {#if isLoading}
            <LoaderCircle class="size-4 animate-spin" />
            Resetting...
          {:else}
            Reset Password
          {/if}
        </button>
      </form>
    {/if}

    <!-- Footer Links -->
    {#snippet footer()}
      {#if !isSuccess}
      <p class="text-slate-500 dark:text-gray-400 text-sm">
        <a class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium ml-1 flex items-center justify-center gap-1 transition-colors" href="/login">
            <ArrowLeft class="size-4" />
            Back to Login
        </a>
      </p>
       {/if}
    {/snippet}
 </AuthLayout>
