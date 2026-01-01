<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  
  interface Props {
      content: string;
  }
  
  let { content }: Props = $props();

  type FaqItem = {
      question: string;
      answer: string;
  };

  type FaqCategory = {
      title: string;
      items: FaqItem[];
  };

  function parseFaqContent(html: string): FaqCategory[] {
      if (typeof window === 'undefined') return []; // Server-side guard

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const categories: FaqCategory[] = [];
      
      let currentCategory: FaqCategory | null = null;

      // Iterate through direct children
      Array.from(doc.body.children).forEach(node => {
          if (node.tagName === 'H2') {
              // New Category
              if (currentCategory) categories.push(currentCategory);
              currentCategory = {
                  title: node.textContent || 'General',
                  items: []
              };
          } else if (node.tagName === 'P') {
              // Potential Question
              const text = node.innerHTML;
              // Look for Q: pattern roughly
              // Pattern expected: <strong>Q: Question?</strong><br>A: Answer
              // Or just: Q: Question? ... A: Answer
              
              // Simple heuristic: Splitting by <br> or "A:"
              // Let's assume the strict structure from our seed data for now
              // <strong>Q: ...</strong> ...
              
              let question = '';
              let answer = '';

              const strong = node.querySelector('strong');
              if (strong && strong.textContent?.trim().startsWith('Q:')) {
                  question = strong.textContent.replace(/^Q:\s*/, '').trim();
                  
                  // Answer is the text content of the P tag EXCLUDING the strong tag
                  // or properly parsed
                  // Let's rely on breaking the HTML string
                  const parts = node.innerHTML.split(/<br\s*\/?>/i);
                  if (parts.length > 1) {
                      // Answer is usually after the break
                      // Remove "A:" prefix if exists from the second part
                      let ansRaw = parts.slice(1).join('<br>'); // rejoin rest
                      // Clean "A:" prefix
                      ansRaw = ansRaw.replace(/^\s*A:\s*/, '').trim();
                      answer = ansRaw;
                  } else {
                      // Fallback: maybe no <br>, just inline
                       const fullText = node.textContent || '';
                       const aIndex = fullText.indexOf('A:');
                       if (aIndex !== -1) {
                           answer = fullText.substring(aIndex + 2).trim();
                       }
                  }
              }

              if (question && answer && currentCategory) {
                  currentCategory.items.push({ question, answer });
              }
          }
      });

      if (currentCategory) categories.push(currentCategory);
      
      return categories;
  }

  // Parse state
  let parsedCategories = $state<FaqCategory[]>([]);
  let searchQuery = $state('');

  $effect(() => {
     parsedCategories = parseFaqContent(content);
  });

  let filteredCategories = $derived.by(() => {
      if (!searchQuery) return parsedCategories;
      
      const lowerQ = searchQuery.toLowerCase();
      
      return parsedCategories.map(cat => ({
          ...cat,
          items: cat.items.filter(item => 
              item.question.toLowerCase().includes(lowerQ) || 
              item.answer.toLowerCase().includes(lowerQ)
          )
      })).filter(cat => cat.items.length > 0);
  });

  // Accordion State
  let openIndex = $state<string | null>(null);

  function toggle(id: string) {
      if (openIndex === id) {
          openIndex = null;
      } else {
          openIndex = id;
      }
  }
</script>

<div class="max-w-3xl mx-auto space-y-8">
  <!-- Search -->
  <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search class="size-5" />
      </div>
      <input 
          type="text"
          bind:value={searchQuery}
          placeholder="Search for answers..."
          class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
      />
  </div>

  <!-- FAQs -->
  <div class="space-y-8">
      {#each filteredCategories as category}
          <div class="space-y-4">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white px-1">{category.title}</h3>
              
              <div class="space-y-3">
                  {#each category.items as item, i}
                      {@const id = `${category.title}-${i}`}
                      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 {openIndex === id ? 'shadow-md ring-1 ring-slate-200 dark:ring-slate-700' : 'hover:border-slate-300 dark:hover:border-slate-600'}">
                          <button 
                              class="w-full flex items-center justify-between p-4 text-left font-medium text-slate-900 dark:text-slate-100"
                              onclick={() => toggle(id)}
                          >
                              <span class="pr-4">{item.question}</span>
                              <ChevronDown class="size-5 text-slate-400 transition-transform duration-200 {openIndex === id ? 'rotate-180' : ''}" />
                          </button>
                          
                          {#if openIndex === id}
                              <div class="px-4 pb-4 prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-400 animate-in slide-in-from-top-2 duration-200">
                                  <div class="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                      {@html item.answer}
                                  </div>
                              </div>
                          {/if}
                      </div>
                  {/each}
              </div>
          </div>
      {:else}
          {#if searchQuery}
            <div class="text-center py-12">
                <div class="inline-flex items-center justify-center size-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <Search class="size-6 text-slate-400" />
                </div>
                <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No results found</h3>
                <p class="text-slate-500">Try searching for something else.</p>
            </div>
          {/if}
      {/each}
  </div>
</div>
