<script lang="ts">
  import { Search, Ellipsis, User, Mail, Calendar, Shield } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  import ActionButtons from '$lib/components/admin/ActionButtons.svelte';

  import TableLayout from '$lib/components/admin/TableLayout.svelte';
  import Header from '$lib/components/admin/Header.svelte';

  // Mock Users Data
  let users = [
    { id: 1, name: "Guest User", email: "guest@example.com", role: "CUSTOMER", joined: "Dec 12, 2023", status: "ACTIVE" },
    { id: 2, name: "Admin User", email: "admin@swiftacc.biz.id", role: "ADMIN", joined: "Jan 01, 2023", status: "ACTIVE" },
    { id: 3, name: "John Doe", email: "john@doe.com", role: "CUSTOMER", joined: "Dec 15, 2023", status: "BANNED" },
    { id: 4, name: "Jane Smith", email: "jane@smith.com", role: "CUSTOMER", joined: "Dec 20, 2023", status: "ACTIVE" },
    { id: 5, name: "Robert Johnson", email: "robert@test.com", role: "CUSTOMER", joined: "Dec 22, 2023", status: "ACTIVE" },
  ];

  let searchQuery = '';

  $: filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="space-y-3">
  <!-- Header -->
  <!-- Header -->
  <Header 
      title="Customers" 
      subtitle="Manage user accounts and roles."
  >
      {#snippet actions()}
         <Button variant="outline">
            Export CSV
         </Button>
      {/snippet}
  </Header>

  <!-- Search -->
  <!-- Search Bar -->
  <!-- Search Bar -->
  <!-- Table Layout -->
  <TableLayout 
      bind:searchQuery={searchQuery} 
      placeholder="Search users by name or email..."
  >
      <table class="w-full text-left border-collapse">
         <thead class="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
               <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">User</th>
               <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Role</th>
               <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Joined Date</th>
               <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">Status</th>
               <th class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-right">Actions</th>
            </tr>
         </thead>
         <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            {#each filteredUsers as user}
               <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td class="px-6 py-4">
                     <div class="flex items-center gap-3">
                        <div class="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <div class="font-bold text-slate-900 dark:text-white text-sm">{user.name}</div>
                           <div class="text-xs text-slate-500">{user.email}</div>
                        </div>
                     </div>
                  </td>
                  <td class="px-6 py-4">
                     <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border {user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}">
                        <Shield class="size-3" />
                        {user.role}
                     </span>
                  </td>
                  <td class="px-6 py-4 text-xs font-medium text-slate-500">
                     <div class="flex items-center gap-2">
                        <Calendar class="size-3.5" />
                        {user.joined}
                     </div>
                  </td>
                  <td class="px-6 py-4">
                     <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        {user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}">
                        {user.status}
                     </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                     <ActionButtons 
                        customActions={[
                           { icon: Ellipsis, label: 'Actions', onClick: () => {} }
                        ]}
                     />
                  </td>
               </tr>
            {/each}
         </tbody>
      </table>

      {#if filteredUsers.length === 0}
         <div class="py-12 text-center text-slate-500">
            <p class="font-medium">No users found.</p>
         </div>
      {/if}
  </TableLayout>
</div>
