```
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import { products } from '$lib/data';
  import { ChevronLeft, Plus, X, Upload, CircleCheck, Copy, Trash2, Save, CircleAlert, Calendar, Image as ImageIcon } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import FormInput from '$lib/components/form/FormInput.svelte';
  import FormTextarea from '$lib/components/form/FormTextarea.svelte';
  import FormSelect from '$lib/components/form/FormSelect.svelte';
  import FormCheckbox from '$lib/components/form/FormCheckbox.svelte';

  import FormImageUpload from '$lib/components/form/FormImageUpload.svelte';
  import Editor from '$lib/components/admin/Editor.svelte';

  const routeSlug = $page.params.slug;
  const product = products.find(p => p.slug === routeSlug);

  // Main Tabs (Workflow Split)
  let activeTab = 'details'; // details, stock

  // Form State (Details)
  let title = product?.title || '';
  let slug = product?.slug || routeSlug || '';
  let description = product?.description || '';
  let category = product?.category || 'Streaming';
  let image = product?.image || '';
  let isInstantDelivery = product?.instantDelivery ?? true;
  let stock = product?.stock || 0;
  
  // Pricing State
  let basePrice = product?.originalPrice || product?.price || 0;
  let discountType = product?.discountType || (product?.originalPrice ? 'FIXED' : 'NONE');
  let discountValue = product?.discountValue || (product?.originalPrice ? product.originalPrice - product.price : 0);
  let validUntil = product?.validUntil || '';

  // Rich Text Fields
  let warrantyPolicy = product?.warrantyPolicy || '';
  let instructionsText = product?.instructions?.join('\n') || '';
  let notes = product?.additionalNotes || '';
  let activeInfoTab = 'instructions';

  // Derived State
  $: finalPrice = calculateFinalPrice(basePrice, discountType, discountValue);

  function calculateFinalPrice(price: number, type: string, value: number) {
    if (!price) return 0;
    if (type === 'NONE' || !type) return price;
    if (type === 'FIXED') return Math.max(0, price - Number(value));
    if (type === 'PERCENTAGE') return Math.max(0, price - (price * (Number(value) / 100)));
    return price;
  }

  // Stock State
  let bulkInput = '';
  let parsedCredentials: string[] = [];
  let availableAccounts = [
    'netflix_stock_1@example.com:pass123',
    'netflix_stock_2@example.com:secure456',
    ...Array(stock > 2 ? stock - 2 : 0).fill('mock_account@email.com:password')
  ];

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;
  
  $: totalPages = Math.ceil(availableAccounts.length / itemsPerPage);
  $: paginatedAccounts = availableAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function parseBulkInput() {
    parsedCredentials = bulkInput.split('\n').filter(line => line.trim().length > 0);
  }

  function addToStock() {
    availableAccounts = [...availableAccounts, ...parsedCredentials];
    stock += parsedCredentials.length;
    bulkInput = '';
    parsedCredentials = [];
    currentPage = Math.ceil(availableAccounts.length / itemsPerPage); 
  }

  function removeAccount(index: number) {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    availableAccounts = availableAccounts.filter((_, i) => i !== absoluteIndex);
    stock--;
    if (paginatedAccounts.length === 0 && currentPage > 1) currentPage--;
  }

  $: parseBulkInput(); 
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
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Edit Product</h1>
              <p class="text-slate-500 text-xs font-medium">Manage details for <span class="font-bold text-slate-700 dark:text-slate-300">{title}</span></p>
           </div>
        </div>

        <div class="flex items-center gap-2">
           <Button href="/admin/products" variant="secondary">
              Cancel
           </Button>
           <Button>
              <Save class="size-4" />
              <span>Save Changes</span>
           </Button>
        </div>
     </div>
  </div>

  <!-- Main Tabs Switcher -->
  <div class="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex">
     <button 
        class="px-6 py-2 rounded-lg text-sm font-bold transition-all {activeTab === 'details' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
        on:click={() => activeTab = 'details'}
     >
        Details
     </button>
     <button 
        class="px-6 py-2 rounded-lg text-sm font-bold transition-all {activeTab === 'stock' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}"
        on:click={() => activeTab = 'stock'}
     >
        Stock Management
     </button>
  </div>

  {#if activeTab === 'details'}
     <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" in:slide>
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
                 <FormInput id="title" label="Product Name" bind:value={title} />
                 
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

           <!-- Additional Info (Tabbed) -->
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
                  
                  <div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                     <span class="text-slate-500 text-sm">Total Stock</span>
                     <span class="font-bold text-lg {stock > 0 ? 'text-slate-900 dark:text-white' : 'text-red-500'}">{stock}</span>
                  </div>
                  
                  <FormCheckbox id="instant" label="Instant Delivery" description="Auto-send credentials" bind:checked={isInstantDelivery} />
               </div>
            </div>
        </div>
     </div>

  {:else if activeTab === 'stock'}
     <div class="space-y-6" in:slide>
         <!-- Stock Management -->
         <!-- (Content preserved as is, no changes needed for this card) -->
         <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm overflow-hidden relative">
            <div class="flex items-center justify-between mb-4">
               <h2 class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload class="size-5 text-blue-600" /> Add Stock
               </h2>
               {#if parsedCredentials.length > 0}
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold transition-all" in:slide>
                     {parsedCredentials.length} items detected
                  </span>
               {/if}
            </div>
            <div class="relative">
               <textarea 
                  bind:value={bulkInput}
                  rows="6"
                  placeholder="Paste account credentials here...&#10;user1@email.com:pass123"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary resize-none font-mono text-sm leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400"
               ></textarea>
            </div>
            <div class="flex justify-end pt-4">
               <button 
                  disabled={parsedCredentials.length === 0}
                  on:click={addToStock}
                  class="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
               >
                  <Plus class="size-4" /> Add to Inventory
               </button>
            </div>
         </div>

         <!-- Inventory List -->
         <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
               <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CircleCheck class="size-4 text-emerald-500" /> Available Stock ({availableAccounts.length})
               </h3>
            </div>
            <div>
               {#if availableAccounts.length === 0}
                  <div class="p-8 text-center text-slate-400 text-sm">No stock available. Add some above!</div>
               {:else}
                  <div class="divide-y divide-slate-100 dark:divide-slate-700">
                     {#each paginatedAccounts as account, i}
                        <div class="p-3 px-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 group transition-colors">
                           <code class="text-xs font-mono text-slate-600 dark:text-slate-300 truncate max-w-[300px] select-all">{account}</code>
                           <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button class="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500" title="Copy"><Copy class="size-3.5" /></button>
                              <button on:click={() => removeAccount(i)} class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-500 hover:text-red-600" title="Remove"><Trash2 class="size-3.5" /></button>
                           </div>
                        </div>
                     {/each}
                  </div>
               {/if}
            </div>
         </div>
     </div>
  {/if}
</div>
