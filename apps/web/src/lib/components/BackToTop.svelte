<script lang="ts">
  import { ArrowUp } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  let showButton = $state(false);

  function handleScroll() {
    showButton = window.scrollY > 500;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if showButton}
  <button
    onclick={scrollToTop}
    transition:scale
    class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    aria-label="Back to top"
  >
    <ArrowUp class="size-6" />
  </button>
{/if}
