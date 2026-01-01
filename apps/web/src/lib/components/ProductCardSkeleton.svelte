<script lang="ts">
  import Skeleton from './Skeleton.svelte';
</script>

<div class="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
  <!-- Image Skeleton -->
  <Skeleton class="aspect-[4/3] w-full" />
  
  <div class="p-4 flex flex-col flex-grow gap-3">
     <!-- Badge & Title -->
     <div class="space-y-2">
        <Skeleton class="h-5 w-24 rounded-full" />
        <Skeleton class="h-6 w-3/4" />
     </div>
     
     <!-- Rating & Sold -->
     <div class="flex items-center justify-between">
        <Skeleton class="h-4 w-16" />
        <Skeleton class="h-4 w-20" />
     </div>
     
     <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
        <!-- Price -->
         <div class="space-y-1">
             <Skeleton class="h-3 w-12" />
             <Skeleton class="h-5 w-24" />
         </div>
        
        <!-- Buttons -->
        <Skeleton class="size-10 rounded-xl" />
     </div>
  </div>
</div>
