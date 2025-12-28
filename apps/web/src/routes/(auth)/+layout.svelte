<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  
  <main class="flex-grow flex flex-col">
    {@render children?.()}
  </main>
  
  <Footer />
</div>
