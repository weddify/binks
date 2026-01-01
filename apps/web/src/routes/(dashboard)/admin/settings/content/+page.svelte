<script lang="ts">
  import { siteSettings } from '$lib/stores/siteSettings.svelte';
  import { siteConfig } from '$lib/config';
  import { Save, CircleCheck, CircleX, MonitorPlay, X } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  let isSaving = $state(false);
  let showToast = $state(false);

  let settings = $state({
      homepage: {
          featuredProductsLimit: siteConfig.homepage.featuredProductsLimit
      }
  });

  // Modal State
  // Modal State
  let isAddSlideOpen = $state(false);
  let newSlide = $state({
      image: '',
      title: '',
      description: '',
      badgeText: '',
      badgeColor: 'blue' // blue, red, green, purple
  });

  async function saveSettings() {
    isSaving = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    isSaving = false;
    showToast = true;
    setTimeout(() => showToast = false, 3000);
  }

  function saveNewSlide() {
      const badge = newSlide.badgeText ? {
          text: newSlide.badgeText,
          style: `bg-${newSlide.badgeColor}-500/20 border-${newSlide.badgeColor}-500/30`,
          dotColor: `bg-${newSlide.badgeColor}-400`,
          textColor: `text-${newSlide.badgeColor}-300`
      } : undefined;

      siteSettings.addSlide({
          image: newSlide.image,
          title: newSlide.title,
          description: newSlide.description,
          badge
      });
      
      isAddSlideOpen = false;
      // Reset form
      newSlide = { image: '', title: '', description: '', badgeText: '', badgeColor: 'blue' };
  }
</script>

<div class="space-y-6 relative">
  <!-- Toast -->
  {#if showToast}
    <div in:slide={{ duration: 300, axis: 'y' }} class="fixed top-24 right-4 z-[60] bg-white dark:bg-slate-800 border-l-4 border-emerald-500 shadow-xl rounded-lg p-4 flex items-start gap-3 max-w-sm">
      <CircleCheck class="size-5 text-emerald-500 mt-0.5" />
      <div>
         <h4 class="font-bold text-slate-900 dark:text-white text-sm">Settings Saved</h4>
         <p class="text-xs text-slate-500 mt-1">Hero slides have been updated.</p>
      </div>
    </div>
  {/if}

  <!-- Content -->
  <div class="space-y-6 max-w-4xl">
       
       <!-- Homepage Settings -->
       <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
             <MonitorPlay class="size-5 text-primary" /> Homepage Settings
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="space-y-1.5">
                <label for="prodLimit" class="text-xs font-bold text-slate-500 uppercase">Featured Products Limit</label>
                <input id="prodLimit" type="number" bind:value={settings.homepage.featuredProductsLimit} min="4" max="20" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                <p class="text-xs text-slate-400">Number of products to show in "Produk Pilihan"</p>
             </div>
          </div>
       </div>

       <!-- Hero Configuration -->
       <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
           <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m15 9 3 3-3 3"/></svg>
               Hero Slides
           </h2>
           
           <div class="space-y-4">
              {#each siteSettings.heroSlides as slide (slide.id)}
                  <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3 bg-slate-50 dark:bg-slate-700/20">
                      <div class="size-12 rounded overflow-hidden flex-shrink-0 bg-slate-200">
                          <img src={slide.image} alt="Slide Preview" class="w-full h-full object-cover">
                      </div>
                      <div class="flex-1 min-w-0">
                          <div class="text-xs font-bold truncate text-slate-900 dark:text-white">
                              {@html slide.title.replace(/<[^>]*>/g, '')}
                          </div>
                           <div class="text-[10px] text-slate-500 truncate">{slide.description}</div>
                      </div>
                      <button class="text-red-500 hover:text-red-700 transition-colors p-1" aria-label="Delete Slide" onclick={() => siteSettings.removeSlide(slide.id)}>
                          <CircleX class="size-4" />
                      </button>
                  </div>
              {/each}

              <button onclick={() => isAddSlideOpen = true} class="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Add New Slide
              </button>
           </div>
       </div>

       <!-- Save Button -->
       <button 
          onclick={saveSettings}
          disabled={isSaving}
          class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
       >
          {#if isSaving}
             <div class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
             Saving Changes...
          {:else}
             <Save class="size-5" />
             Save Changes
          {/if}
       </button>
  </div>

  <!-- Add Slide Modal -->
  {#if isAddSlideOpen}
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity cursor-default w-full h-full border-none" aria-label="Close modal" onclick={() => isAddSlideOpen = false}></button>
          <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 pointer-events-auto">
              <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                  <h3 class="font-bold text-lg">Add New Slide</h3>
                  <button onclick={() => isAddSlideOpen = false} class="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700">
                      <X class="size-5" />
                  </button>
              </div>
              <div class="p-6 space-y-4">
                  <!-- Image URL -->
                  <div class="space-y-1.5">
                      <label for="slideImage" class="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                      <input id="slideImage" type="text" bind:value={newSlide.image} placeholder="https://..." class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm" />
                      {#if newSlide.image}
                        <div class="mt-2 h-32 rounded-lg bg-slate-100 overflow-hidden relative group">
                            <img src={newSlide.image} alt="Preview" class="w-full h-full object-cover" />
                        </div>
                      {/if}
                  </div>

                   <!-- Title -->
                   <div class="space-y-1.5">
                      <label for="slideTitle" class="text-xs font-bold text-slate-500 uppercase">Title (HTML Supported)</label>
                      <input id="slideTitle" type="text" bind:value={newSlide.title} placeholder="Big Text <span class='text-primary'>Highlight</span>" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm" />
                  </div>

                   <!-- Description -->
                   <div class="space-y-1.5">
                      <label for="slideDesc" class="text-xs font-bold text-slate-500 uppercase">Description</label>
                      <textarea id="slideDesc" bind:value={newSlide.description} rows="2" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm resize-none"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                      <!-- Badge Text -->
                      <div class="space-y-1.5">
                          <label for="slideBadgeText" class="text-xs font-bold text-slate-500 uppercase">Badge Text (Optional)</label>
                          <input id="slideBadgeText" type="text" bind:value={newSlide.badgeText} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm" />
                      </div>
                       <!-- Badge Color -->
                       <div class="space-y-1.5">
                          <label for="slideBadgeColor" class="text-xs font-bold text-slate-500 uppercase">Badge Color</label>
                          <select id="slideBadgeColor" bind:value={newSlide.badgeColor} class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white text-sm">
                              <option value="blue">Blue</option>
                              <option value="red">Red</option>
                              <option value="green">Green</option>
                              <option value="purple">Purple</option>
                          </select>
                      </div>
                  </div>
              </div>
              <div class="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                  <button onclick={() => isAddSlideOpen = false} class="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                  <button onclick={saveNewSlide} class="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">Add Slide</button>
              </div>
          </div>
      </div>
  {/if}
</div>
