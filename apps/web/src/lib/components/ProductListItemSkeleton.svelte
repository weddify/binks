<script lang="ts">
  import Skeleton from './Skeleton.svelte';
</script>

<div class="flex items-start md:items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
  <!-- Image -->
  <Skeleton class="size-16 md:size-20 rounded-lg flex-shrink-0" />
  
  <div class="flex-grow min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-2 w-full max-w-lg">
          <!-- Title -->
          <Skeleton class="h-6 w-3/4 md:w-1/2" />
          <!-- Description -->
          <Skeleton class="h-4 w-full md:w-3/4" />
          <div class="flex gap-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-4 w-16" />
          </div>
      </div>

      <div class="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-3 md:gap-1">
          <!-- Price -->
          <Skeleton class="h-5 w-24" />
          
          <div class="flex gap-2 w-full md:w-auto">
             <Skeleton class="h-9 w-full md:w-28 rounded-lg" />
             <Skeleton class="h-9 w-full md:w-28 rounded-lg" />
          </div>
      </div>
  </div>
</div>
