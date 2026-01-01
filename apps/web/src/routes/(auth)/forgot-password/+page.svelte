<script lang="ts">
  import AuthLayout from '$lib/components/AuthLayout.svelte';
  import FormInput from '$lib/components/FormInput.svelte';
  import { Mail, ArrowLeft, LoaderCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  let isLoading = $state(false);
  let email = $state('');
  let isSent = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success state
    isLoading = false;
    isSent = true;
    toast.success('Reset link sent to your email!');
  }
</script>

<AuthLayout 
    title="FORGOT PASSWORD" 
    subtitle="Enter your email to receive password reset instructions."
  >
    {#if isSent}
      <div class="flex flex-col items-center text-center space-y-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div class="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mb-2">
            <Mail class="size-8" />
         </div>
         <h3 class="text-xl font-bold text-slate-900 dark:text-white">Check Your Email</h3>
         <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
            We have sent a password reset link to <span class="font-bold text-slate-900 dark:text-white">{email}</span>. Please check your inbox and spam folder.
         </p>
         
         <div class="w-full pt-4">
            <a href="/login" class="w-full block text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-all">
                Back to Login
            </a>
         </div>
         
         <button onclick={() => isSent = false} class="text-xs text-primary hover:underline font-medium">
            Did not receive the email? Try again
         </button>
      </div>
    {:else}
      <!-- Form Content -->
      <form onsubmit={handleSubmit} class="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Email Field -->
        <FormInput 
           id="email" 
           label="Email Address" 
           type="email" 
           placeholder="name@example.com" 
           icon={Mail} 
           bind:value={email}
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
            Sending...
          {:else}
            Send Reset Link
          {/if}
        </button>
      </form>
    {/if}
    
    <!-- Footer Links -->
    {#snippet footer()}
      {#if !isSent}
        <p class="text-slate-500 dark:text-gray-400 text-sm">
          Remember your password? 
          <a class="text-primary font-bold hover:underline ml-1" href="/login">Login</a>
        </p>
      {/if}
    {/snippet}
  </AuthLayout>
