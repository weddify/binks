<script lang="ts">
  import { database } from '$lib/data';
  import { Plus, Search, Folder, EllipsisVertical, LayoutGrid, List, X } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  import ActionButtons from '$lib/components/admin/ActionButtons.svelte';
  import Card from '$lib/components/admin/Card.svelte';
  import TableLayout from '$lib/components/admin/TableLayout.svelte';
  import Header from '$lib/components/admin/Header.svelte';
  import { Alert, ConfirmDelete } from '$lib/utils/alert';

  // Transform database object to array for display
  let categories = $state(Object.entries(database).map(([key, data]) => ({
    id: key,
    name: data.title,
    slug: key,
    description: data.description,
    count: data.groups.reduce((acc, group) => acc + group.products.length, 0),
    icon: key === 'gaming' ? 'Gamepad2' : 'MonitorPlay' // Mock icon logic
  })));

  let searchQuery = $state('');
  let viewMode = $state<'list' | 'grid'>('list');

  // Filtering
  let filteredCategories = $derived(
    categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Modal State
  let isModalOpen = $state(false);
  let isEditing = $state(false);
  let currentCategory = $state({ name: '', slug: '', description: '', parent: 'None' });

  function openAddModal() {
    isEditing = false;
    currentCategory = { name: '', slug: '', description: '', parent: 'None' };
    isModalOpen = true;
  }

  function openEditModal(category: any) {
    isEditing = true;
    currentCategory = { ...category, parent: 'None' };
    isModalOpen = true;
  }

  function handleDelete(id: string) {
    Alert.fire(ConfirmDelete).then((result) => {
      if (result.isConfirmed) {
        categories = categories.filter(c => c.id !== id);
        Alert.fire(
          'Deleted!',
          'Category has been deleted.',
          'success'
        )
      }
    });
  }
</script>

<div class="space-y-3">
  <!-- Header -->
  <Header 
      title="Categories" 
      subtitle="Manage your product categories and hierarchy."
  >
      {#snippet actions()}
         <Button variant="primary" size="md" class="shadow-lg shadow-primary/30" onclick={openAddModal}>
            <Plus class="size-4 mr-2" />
            Add Category
         </Button>
      {/snippet}
  </Header>
  <!-- Search & Filter Bar -->
  <!-- Search & Filter Bar -->
  <!-- Table Layout -->
  <TableLayout 
      bind:searchQuery={searchQuery} 
      placeholder="Search categories..."
  >
      {#snippet actions()}
          <div class="flex gap-2">
              <button 
                class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 {viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : ''} transition-colors"
                onclick={() => viewMode = 'list'}
                aria-label="List View"
              >
                  <List class="size-4" />
              </button>
              <button 
                class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 {viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-primary' : ''} transition-colors"
                onclick={() => viewMode = 'grid'}
                 aria-label="Grid View"
              >
                  <LayoutGrid class="size-4" />
              </button>
          </div>
      {/snippet}

      <!-- Content -->
      {#if viewMode === 'list'}
        <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700">
                <tr>
                    <th class="px-6 py-4">Category Name</th>
                    <th class="px-6 py-4">Description</th>
                    <th class="px-6 py-4 text-center">Total Products</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                {#each filteredCategories as category}
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="size-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                                    <Folder class="size-5" />
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold text-slate-900 dark:text-white">{category.name}</span>
                                    <span class="text-xs text-slate-400 font-mono">/{category.slug}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">{category.description}</span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {category.count} items
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <ActionButtons 
                                onEdit={() => openEditModal(category)}
                                onDelete={() => handleDelete(category.id)}
                            />
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        {#if filteredCategories.length === 0}
            <div class="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Folder class="size-12 mb-3 opacity-20" />
                <p class="text-sm font-medium">No categories found matching "{searchQuery}"</p>
            </div>
        {/if}
      {:else}
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50">
          {#each filteredCategories as category}
              <Card class="flex flex-col items-center text-center relative border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                  <ActionButtons 
                      onEdit={() => openEditModal(category)}
                      onDelete={() => handleDelete(category.id)}
                      class="absolute top-4 right-4"
                  />
                  
                  <div class="size-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Folder class="size-8" />
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{category.name}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10">{category.description}</p>
                   <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {category.count} Products
                  </span>
              </Card>
          {/each}
      </div>
      {/if}
  </TableLayout>

</div>

<!-- Simple Modal (Standard HTML/Tailwind for now) -->
{#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Category' : 'Add New Category'}</h3>
                <button onclick={() => isModalOpen = false} class="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                   <X class="size-5" />
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm  text-slate-700 dark:text-slate-300 mb-1.5">
                        Title
                        <input type="text" bind:value={currentCategory.name} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Streaming" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Slug
                        <input type="text" bind:value={currentCategory.slug} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. streaming" />
                    </label>
                </div>
                <div>
                     <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Parent Category
                        <select bind:value={currentCategory.parent} class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                            <option value="None">None (Top Level)</option>
                            {#each categories as c}
                                {#if c.id !== currentCategory.slug} <!-- Prevent self-parenting loop in UI -->
                                    <option value={c.id}>{c.name}</option>
                                {/if}
                            {/each}
                        </select>
                     </label>
                </div>
                 <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Description
                        <textarea bind:value={currentCategory.description} rows="3" class="w-full mt-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Short description..."></textarea>
                    </label>
                </div>
            </div>
            <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-3">
                <Button variant="outline" size="sm" onclick={() => isModalOpen = false}>Cancel</Button>
                <Button variant="primary" size="sm" onclick={() => { isModalOpen = false; /* Logic here */ }}>
                    {isEditing ? 'Save Changes' : 'Create Category'}
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes scale-up {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in {
        animation: fade-in 0.2s ease-out;
    }
    .animate-scale-up {
        animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
</style>
