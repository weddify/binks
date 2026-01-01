<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { pageStore } from '$lib/stores/pageStore.svelte';
  import { Save, ArrowLeft, Trash2, Eye, FileText } from 'lucide-svelte';
  import Header from '$lib/components/admin/Header.svelte';
  import Editor from '$lib/components/admin/Editor.svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Alert, ConfirmDelete } from '$lib/utils/alert';

  const slug = $page.params.slug;
  const isNew = slug === 'new';

  let formData = $state({
      title: '',
      slug: '',
      content: '',
      isPublished: true,
      lastUpdated: ''
  });
  
  let isManualSlug = $state(false);
  // showToast state removed in favor of svelte-sonner

  onMount(() => {
      if (!isNew) {
          const existingPage = pageStore.getPage(slug);
          if (existingPage) {
              formData = { ...existingPage };
          } else {
              goto('/admin/pages');
          }
      }
  });

  function savePage() {
      if (!formData.title || !formData.slug) {
          toast.warning('Title and Slug are required');
          return;
      }

      if (isNew) {
          // Check if slug exists
          if (pageStore.getPage(formData.slug)) {
               toast.error('Slug already exists');
               return;
          }
          pageStore.addPage({ 
              ...formData, 
              lastUpdated: new Date().toISOString() 
          });
      } else {
          pageStore.updatePage(slug, formData);
          
          // If slug changed, redirect to new slug
          if (slug !== formData.slug) {
              goto(`/admin/pages/${formData.slug}`, { replaceState: true });
          }
      }
      
      
      toast.success('Saved successfully!');
      
      if (isNew) {
           // wait for toast
           setTimeout(() => {
               goto(`/admin/pages/${formData.slug}`);
           }, 500);
      }
  }

  function deletePage() {
      Alert.fire(ConfirmDelete).then((result) => {
          if (result.isConfirmed) {
              pageStore.deletePage(slug);
              toast.success('Page deleted.');
              goto('/admin/pages');
          }
      });
  }

  function generateSlug() {
      if (isNew && !isManualSlug) {
          formData.slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]+/g, '') // remove incompatible chars
            .trim()
            .replace(/\s+/g, '-'); // spaces to dashes
      }
  }
</script>

<div class="space-y-6 relative">


    <Header 
        title={isNew ? 'Create Page' : 'Edit Page'} 
        subtitle={isNew ? 'Add a new static page' : `Editing /${slug}`}
    >
        {#snippet actions()}
            <div class="flex items-center gap-2">
                <a href="/admin/pages" class="px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowLeft class="size-5" />
                </a>
                <button onclick={savePage} class="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                    <Save class="size-4" />
                    Save Page
                </button>
            </div>
        {/snippet}
    </Header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Title & Slug -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                <div class="space-y-1.5">
                    <label for="title" class="text-xs font-bold text-slate-500 uppercase">Page Title</label>
                    <input 
                    id="title" 
                    type="text" 
                    bind:value={formData.title} 
                    oninput={generateSlug}
                    placeholder="e.g. Frequently Asked Questions" 
                    class="w-full px-4 py-2 text-lg font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white"
                    />
                </div>
                
                <div class="flex items-center gap-2 pl-1">
                    <span class="text-slate-400 text-sm font-medium">Slug:</span>
                    <span class="text-slate-400 text-sm font-medium">/</span>
                    <input 
                    id="slug" 
                    type="text" 
                    bind:value={formData.slug} 
                    oninput={() => isManualSlug = true}
                    disabled={!isNew}
                    placeholder="url-slug"
                    class="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-600 dark:text-slate-400 focus:ring-0 focus:outline-none disabled:opacity-60 placeholder:text-slate-300"
                    />
                </div>
            </div>

            <!-- Editor -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[500px] flex flex-col">
                <label for="content" class="text-xs font-bold text-slate-500 uppercase mb-4">Content</label>
                <div class="flex-1">
                     <Editor content={formData.content} onchange={(html) => formData.content = html} />
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
            <!-- Publish Status -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
                <h3 class="font-bold text-slate-900 dark:text-white">Publishing</h3>
                
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Status</span>
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-bold uppercase {formData.isPublished ? 'text-emerald-600' : 'text-slate-500'}">{formData.isPublished ? 'Published' : 'Draft'}</span>
                        <button 
                            role="switch" 
                            aria-label="Toggle Published Status"
                            aria-checked={formData.isPublished}
                            onclick={() => formData.isPublished = !formData.isPublished}
                            class="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full relative transition-colors {formData.isPublished ? 'bg-emerald-500 dark:bg-emerald-500' : ''}"
                        >
                            <span class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform {formData.isPublished ? 'translate-x-5' : ''} shadow-sm"></span>
                        </button>
                    </div>
                </div>

                {#if !isNew && formData.lastUpdated}
                <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p class="text-xs text-slate-400 mb-1">Last Updated</p>
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {new Date(formData.lastUpdated).toLocaleString()}
                    </p>
                </div>
                {/if}
            </div>

            <!-- Actions -->
            {#if !isNew}
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm">
                <div class="flex flex-col gap-1">
                     <a href="/{formData.slug}" target="_blank" class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-medium text-sm">
                        <Eye class="size-4" />
                        View Live Page
                    </a>
                    <button onclick={deletePage} class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium text-sm w-full text-left">
                        <Trash2 class="size-4" />
                        Delete Page
                    </button>
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>


