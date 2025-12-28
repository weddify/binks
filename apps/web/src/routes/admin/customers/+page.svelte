<script lang="ts">
  import { Search, MoreHorizontal, User, Mail, Calendar, Shield } from 'lucide-svelte';

  // Mock Users Data
  let users = [
    { id: 1, name: "Guest User", email: "guest@example.com", role: "CUSTOMER", joined: "Dec 12, 2023", status: "ACTIVE" },
    { id: 2, name: "Admin User", email: "admin@binks.com", role: "ADMIN", joined: "Jan 01, 2023", status: "ACTIVE" },
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
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
     <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Customers</h1>
        <p class="text-slate-500 mt-1">Manage user accounts and roles.</p>
     </div>
     <div class="flex gap-2">
        <button class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
           Export CSV
        </button>
     </div>
  </div>

  <!-- Search -->
  <!-- Search Bar -->
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
     <div class="relative w-full sm:max-w-md">
       <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
       <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search users by name or email..." 
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
       />
     </div>
  </div>

  <!-- Users Table -->
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
     <div class="overflow-x-auto">
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
                       <button class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreHorizontal class="size-4" />
                       </button>
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
     </div>
  </div>
</div>
