<script lang="ts">
  import AuthLayout from '$lib/components/AuthLayout.svelte';
  import FormInput from '$lib/components/FormInput.svelte';
  import { User, Mail, Lock } from 'lucide-svelte';
</script>

<AuthLayout 
    title="REGISTER" 
    subtitle="Create a new account for instant access to premium digital products."
  >
    <!-- Registration Form -->
    <form action="#" class="space-y-4" method="POST">
      <!-- Full Name -->
      <FormInput 
         id="fullname" 
         label="Full Name" 
         placeholder="John Doe" 
         icon={User} 
      />
      
      <!-- Email -->
      <FormInput 
         id="email" 
         label="Email Address" 
         type="email" 
         placeholder="nama@email.com" 
         icon={Mail} 
      />
      
      <!-- Password -->
      <div>
         <FormInput 
            id="password" 
            label="Password" 
            type="password" 
            placeholder="******" 
            icon={Lock} 
            showPasswordToggle={true}
         />
        
        <!-- Password Strength Indicator -->
        <div class="mt-3">
          <div class="flex gap-1.5 h-1.5 w-full">
            <div class="flex-1 rounded-full bg-emerald-500"></div>
            <div class="flex-1 rounded-full bg-emerald-500"></div>
            <div class="flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <p class="text-xs text-emerald-600 mt-1.5 font-medium">Password Strength: Medium</p>
        </div>
      </div>
      
      <!-- Confirm Password -->
      <FormInput 
         id="confirm_password" 
         label="Confirm Password" 
         type="password" 
         placeholder="******" 
         icon={Lock} 
         showPasswordToggle={true}
      />
      
      <!-- Terms Checkbox -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input class="checkbox checkbox-primary checkbox-sm rounded" id="terms" name="terms" type="checkbox"/>
        </div>
        <div class="ml-3 text-sm">
          <label class="font-medium text-gray-700 dark:text-gray-300" for="terms">I agree to the <a class="text-primary hover:text-primary-dark hover:underline" href="/">Terms & Conditions</a></label>
        </div>
      </div>
      
      <!-- Submit Button -->
      <button class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98]" type="submit">
        Register Now
      </button>
    </form>
    
    <!-- Footer Slot -->
    {#snippet footer()}
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Already have an account? 
        <a class="font-bold text-primary hover:text-primary-dark transition-colors" href="/login">Login</a>
      </p>
    {/snippet}

  </AuthLayout>
