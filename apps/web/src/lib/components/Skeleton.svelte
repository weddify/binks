<script lang="ts">
  import { fade } from 'svelte/transition';
  
  // Props handled via rest props (allows adding width, height, rounded, etc via class)
  let { class: className = '', ...rest } = $props();
</script>

<div 
  class="animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-lg {className}" 
  {...rest}
></div>
