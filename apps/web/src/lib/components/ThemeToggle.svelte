<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';

  let theme = $state('cupcake');

  function toggleTheme() {
    const newTheme = theme === 'cupcake' ? 'sunset' : 'cupcake';
    applyTheme(newTheme);
  }

  function applyTheme(newTheme: string) {
    theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Toggle 'dark' class for Tailwind dark mode based on theme
    if (newTheme === 'sunset') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (prefersDark) {
      applyTheme('sunset');
    } else {
      applyTheme('cupcake');
    }
  });
</script>

<button 
  onclick={toggleTheme}
  class="btn btn-ghost btn-circle btn-sm"
  aria-label="Toggle Theme"
>
  {#if theme === 'cupcake'}
    <Sun class="size-5 text-orange-400" />
  {:else}
    <Moon class="size-5 text-blue-400" />
  {/if}
</button>
