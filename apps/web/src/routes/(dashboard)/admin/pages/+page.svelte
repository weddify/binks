<script lang="ts">
  import { pageStore } from '$lib/stores/pageStore.svelte';
  import Button from '$lib/components/Button.svelte';
  import { Plus, Edit, Trash2, ExternalLink } from 'lucide-svelte';
  import Header from '$lib/components/admin/Header.svelte';
  import { Alert, ConfirmDelete } from '$lib/utils/alert';
  import TableLayout from '$lib/components/admin/TableLayout.svelte';

  let searchQuery = $state('');

  let filteredPages = $derived(
    pageStore.pages.filter(page => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function deletePage(slug: string) {
    Alert.fire(ConfirmDelete).then((result) => {
      if (result.isConfirmed) {
        pageStore.deletePage(slug);
        Alert.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    });
  }
</script>

<div class="space-y-6">
  <Header 
    title="Pages" 
    subtitle="Manage static content pages (FAQ, Terms, etc.)"
  >
    {#snippet actions()}
        <Button href="/admin/pages/new" class="shadow-lg shadow-blue-500/30">
            <Plus class="size-4" />
            Create Page
        </Button>
    {/snippet}
  </Header>

  <TableLayout
      bind:searchQuery={searchQuery}
      placeholder="Search pages..."
  >
      <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
              <tr>
                  <th class="px-6 py-4">Title</th>
                  <th class="px-6 py-4">Slug</th>
                  <th class="px-6 py-4">Last Updated</th>
                  <th class="px-6 py-4 text-center">Status</th>
                  <th class="px-6 py-4 text-right">Actions</th>
              </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              {#each filteredPages as page (page.slug)}
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {page.title}
                      </td>
                      <td class="px-6 py-4 text-slate-500">
                          /{page.slug}
                      </td>
                      <td class="px-6 py-4 text-slate-500">
                          {new Date(page.lastUpdated).toLocaleDateString()}
                      </td>
                      <td class="px-6 py-4 text-center">
                          {#if page.isPublished}
                              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  Published
                              </span>
                          {:else}
                              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                  Draft
                              </span>
                          {/if}
                      </td>
                      <td class="px-6 py-4 flex items-center justify-end gap-2">
                           <a href="/{page.slug}" target="_blank" class="p-2 text-slate-400 hover:text-primary transition-colors" title="View Page">
                              <ExternalLink class="size-4" />
                          </a>
                          <a href="/admin/pages/{page.slug}" class="p-2 text-slate-400 hover:text-primary transition-colors" title="Edit Page">
                              <Edit class="size-4" />
                          </a>
                          <button onclick={() => deletePage(page.slug)} class="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete Page">
                              <Trash2 class="size-4" />
                          </button>
                      </td>
                  </tr>
              {:else}
                  <tr>
                      <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                          No pages found. Create one to get started.
                      </td>
                  </tr>
              {/each}
          </tbody>
      </table>
  </TableLayout>
</div>
