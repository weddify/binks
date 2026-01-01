<script lang="ts">
  import { ChevronLeft, Plus, X, Calendar, Image as ImageIcon } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';
  import FormInput from '$lib/components/form/FormInput.svelte';
  import FormTextarea from '$lib/components/form/FormTextarea.svelte';
  import FormSelect from '$lib/components/form/FormSelect.svelte';
  import FormCheckbox from '$lib/components/form/FormCheckbox.svelte';
  import FormImageUpload from '$lib/components/form/FormImageUpload.svelte';
  import Editor from '$lib/components/admin/Editor.svelte';
  
  // Form State
  let title = '';
  let slug = '';
  let description = '';
  let category = 'Streaming';
  let image = '';
  let isInstantDelivery = true;
  
  // Pricing State
  let basePrice = 0;
  let discountType = 'NONE'; // NONE, PERCENTAGE, FIXED
  let discountValue = 0;
  let validUntil = '';

  // Rich Text Fields (Tabbed)
  let warrantyPolicy = '';
  let instructionsText = '';
  let notes = '';

  // Tabs for Rich Text
  let activeInfoTab = 'instructions'; 

  // Derived State
  $: finalPrice = calculateFinalPrice(basePrice, discountType, discountValue);

  function calculateFinalPrice(price: number, type: string, value: number) {
    if (!price) return 0;
    if (type === 'NONE') return price;
    if (type === 'FIXED') return Math.max(0, price - value);
    if (type === 'PERCENTAGE') return Math.max(0, price - (price * (value / 100)));
    return price;
  }
</script>

<div class="space-y-6">
  <!-- Sticky Header -->
  <div class="sticky top-16 lg:top-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-6 px-6 -mt-6 mb-6 lg:-mx-10 lg:px-10 lg:-mt-10 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all h-16 flex items-center">
     <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-full mx-auto w-full">
        <div class="flex items-center gap-4">
           <a href="/admin/products" class="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronLeft class="size-6" />
           </a>
           <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Add New Product</h1>
              <p class="text-slate-500 text-xs font-medium">Create a new product listing.</p>
           </div>
        </div>
        
        <div class="flex items-center gap-2">
           <Button href="/admin/products" variant="secondary">
              Cancel
           </Button>
           <Button>
              Save Product
           </Button>
        </div>
     </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
     <!-- Left Column: Main Info -->
     <div class="lg:col-span-2 space-y-6">
        
        <!-- Product Identity Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
           <h2 class="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Product Identity</h2>
           
           <!-- Media (Top) -->
           <div class="w-full">
               <FormImageUpload id="image" label="Cover Image" bind:value={image} />
           </div>

           <!-- Core Inputs -->
           <div class="space-y-4">
               <FormInput id="title" label="Product Name" bind:value={title} placeholder="e.g. Netflix Premium" />
               
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div class="sm:col-span-1">
                      <FormInput id="slug" label="Slug / URL" bind:value={slug} placeholder="e.g. netflix-premium" />
                   </div>
                   <div class="sm:col-span-1">
                      <FormSelect id="category" label="Category" bind:value={category} options={['Streaming', 'Gaming', 'Software', 'Utilities']} />
                   </div>
               </div>
           </div>

            <!-- Description -->
            <div class="pt-2 border-t border-slate-50 dark:border-slate-800/50">
               <div class="space-y-1.5 min-h-[300px]">
                  <label for="description" class="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <Editor content={description} onchange={(html) => description = html} />
               </div>
            </div>
         </div>

        <!-- Additional Information (Tabbed) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
           <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
              <h2 class="font-bold text-lg text-slate-900 dark:text-white">Additional Info</h2>
              <div class="flex gap-4">
                 {#each ['instructions', 'warranty', 'notes'] as tab}
                    <button 
                       class="pb-2 text-sm font-bold border-b-2 transition-colors capitalize {activeInfoTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
                       on:click={() => activeInfoTab = tab}
                    >
                       {tab}
                    </button>
                 {/each}
              </div>
           </div>

            <div class="pt-2">
               {#if activeInfoTab === 'instructions'}
                  <div class="space-y-1.5 min-h-[300px]">
                     <label for="instructions" class="text-xs font-bold text-slate-500 uppercase">Redemption Instructions</label>
                     <Editor content={instructionsText} onchange={(html) => instructionsText = html} />
                  </div>
               {:else if activeInfoTab === 'warranty'}
                  <div class="space-y-1.5 min-h-[300px]">
                     <label for="warranty" class="text-xs font-bold text-slate-500 uppercase">Warranty Policy</label>
                     <Editor content={warrantyPolicy} onchange={(html) => warrantyPolicy = html} />
                  </div>
               {:else if activeInfoTab === 'notes'}
                  <div class="space-y-1.5 min-h-[300px]">
                     <label for="notes" class="text-xs font-bold text-slate-500 uppercase">Additional Notes</label>
                     <Editor content={notes} onchange={(html) => notes = html} />
                  </div>
               {/if}
            </div>
        </div>
     </div>

     <!-- Right Column: Pricing, Publish -->
     <div class="space-y-6">
        
        <!-- 1. Pricing & Discounts -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h2 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Pricing & Discounts</h2>
            
            <div class="space-y-4">
               <FormInput id="basePrice" label="Base Price" type="number" prefix="Rp" bind:value={basePrice} />
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700/50">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="col-span-2 md:col-span-1">
                     <FormSelect 
                        id="discountType" 
                        label="Discount Type" 
                        bind:value={discountType} 
                        options={['NONE', 'PERCENTAGE', 'FIXED']} 
                     />
                  </div>
                  
                  {#if discountType !== 'NONE'}
                     <div class="col-span-2 md:col-span-1">
                        <FormInput 
                           id="discountValue" 
                           label={discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Amount (Rp)'} 
                           type="number" 
                           bind:value={discountValue} 
                        />
                     </div>
                     
                     <div class="col-span-2">
                        <div class="space-y-1.5">
                           <label for="validUntil" class="text-xs font-bold text-slate-500 uppercase">Valid Until</label>
                           <div class="relative">
                              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                              <input 
                                 id="validUntil" 
                                 type="date" 
                                 bind:value={validUntil}
                                 class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white"
                              />
                           </div>
                        </div>
                     </div>
                  {/if}
               </div>

               <div class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span class="text-sm font-bold text-slate-500">Final Selling Price</span>
                  <span class="text-xl font-black text-emerald-600 dark:text-emerald-400">
                     Rp {finalPrice.toLocaleString()}
                  </span>
               </div>
            </div>
         </div>

        <!-- 2. Settings (Formerly Publish) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h2 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Settings</h2>
            <div class="space-y-4">
               <FormCheckbox id="instant" label="Instant Delivery" description="Auto-send credentials" bind:checked={isInstantDelivery} />
            </div>
        </div>
     </div>
  </div>
</div>
