<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';
  import Link from '@tiptap/extension-link';
  import { Table } from '@tiptap/extension-table';
  import { TableRow } from '@tiptap/extension-table-row';
  import { TableHeader } from '@tiptap/extension-table-header';
  import { TableCell } from '@tiptap/extension-table-cell';
  import TextAlign from '@tiptap/extension-text-align';
  import Underline from '@tiptap/extension-underline';
  import TaskList from '@tiptap/extension-task-list';
  import TaskItem from '@tiptap/extension-task-item';
  
  import { 
    Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, 
    Quote, Code, Minus, Undo, Redo, Strikethrough, Underline as UnderlineIcon,
    Image as ImageIcon, Link as LinkIcon, Table as TableIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    CheckSquare, Split, Merge
  } from 'lucide-svelte';
  import { Alert } from '$lib/utils/alert';
  
  let { content = '', onchange }: { content: string, onchange: (html: string) => void } = $props();

  let element: HTMLElement;
  let editor: Editor | null = $state(null);

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Underline,
        Image.configure({ inline: true, allowBase64: true }),
        Link.configure({ openOnClick: false }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TaskList,
        TaskItem.configure({ nested: true }),
      ],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 prose-li:my-0 prose-ul:my-2 prose-ol:my-2 prose-p:my-0 prose-headings:my-3 prose-img:rounded-xl leading-normal',
        },
      },
      onUpdate: ({ editor }) => {
        onchange(editor.getHTML());
      },
    });
  });

  $effect(() => {
    if (editor && content && editor.getHTML() !== content) {
        editor.commands.setContent(content);
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });



  async function addImage() {
    const { value: url } = await Alert.fire({
        title: 'Enter image URL',
        input: 'url',
        inputPlaceholder: 'https://example.com/image.jpg',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
            return 'You need to write something!'
            }
        }
    });

    if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  async function setLink() {
      const previousUrl = editor?.getAttributes('link').href;
      
      const { value: url } = await Alert.fire({
        title: 'Enter URL',
        input: 'url',
        inputValue: previousUrl,
        inputPlaceholder: 'https://example.com',
        showCancelButton: true
      });
      
      // cancelled
      if (url === undefined) {
        return;
      }

      // empty (user cleared it)
      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

</script>

<style>
 :global(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
 :global(.tiptap table) {
    border-collapse: collapse;
    width: 100%;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
 }
 :global(.tiptap td), :global(.tiptap th) {
   min-width: 1em;
   border: 1px solid #cbd5e1;
   padding: 3px 5px;
   vertical-align: top;
   box-sizing: border-box;
   position: relative;
 }
  :global(.dark .tiptap td), :global(.dark .tiptap th) {
   border-color: #475569;
 }
 :global(.tiptap th) {
    background-color: #f1f5f9;
    font-weight: bold;
    text-align: left;
 }
 :global(.dark .tiptap th) {
    background-color: #1e293b;
 }
 :global(.tiptap .selectedCell:after) {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0; right: 0; top: 0; bottom: 0;
    background: rgba(200, 200, 255, 0.4);
    pointer-events: none;
 }
 :global(ul[data-type="taskList"]) {
    list-style: none;
    padding: 0;
 }
 :global(li[data-type="taskItem"]) {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
 }
 :global(li[data-type="taskItem"] input[type="checkbox"]) {
    margin-top: 0.3rem;
    cursor: pointer;
 }
</style>

<div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
    <!-- Toolbar -->
    <div class="border-b border-slate-200 dark:border-slate-700 p-2 flex gap-1 bg-slate-50 dark:bg-slate-900/50 flex-wrap items-center">
        {#if editor}
            <!-- History -->
            <div class="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-700 pr-2">
                <button type="button" onclick={() => editor?.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 transition-colors" title="Undo">
                    <Undo class="size-4" />
                </button>
                <button type="button" onclick={() => editor?.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 transition-colors" title="Redo">
                    <Redo class="size-4" />
                </button>
            </div>

            <!-- Basics -->
            <button type="button" onclick={() => editor?.chain().focus().toggleBold().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-700 text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}" title="Bold">
                <Bold class="size-4" />
            </button>
            <button type="button" onclick={() => editor?.chain().focus().toggleItalic().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-700 text-primary italic' : 'text-slate-600 dark:text-slate-300'}" title="Italic">
                <Italic class="size-4" />
            </button>
            <button type="button" onclick={() => editor?.chain().focus().toggleUnderline().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('underline') ? 'bg-slate-200 dark:bg-slate-700 text-primary underline' : 'text-slate-600 dark:text-slate-300'}" title="Underline">
                <UnderlineIcon class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().toggleStrike().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('strike') ? 'bg-slate-200 dark:bg-slate-700 text-primary line-through' : 'text-slate-600 dark:text-slate-300'}" title="Strikethrough">
                <Strikethrough class="size-4" />
            </button>
            
            <div class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>

             <!-- Headings -->
            <button type="button" onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Heading 1">
                <Heading1 class="size-4" />
            </button>
            <button type="button" onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Heading 2">
                <Heading2 class="size-4" />
            </button>
            <button type="button" onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Heading 3">
                <Heading3 class="size-4" />
            </button>
            
            <div class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>
            
             <!-- Alignment -->
            <button type="button" onclick={() => editor?.chain().focus().setTextAlign('left').run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Align Left">
                <AlignLeft class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().setTextAlign('center').run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Align Center">
                <AlignCenter class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().setTextAlign('right').run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Align Right">
                <AlignRight class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().setTextAlign('justify').run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Align Justify">
                <AlignJustify class="size-4" />
            </button>

            <div class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>

            <!-- Lists -->
             <button type="button" onclick={() => editor?.chain().focus().toggleBulletList().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Bullet List">
                <List class="size-4" />
            </button>
            <button type="button" onclick={() => editor?.chain().focus().toggleOrderedList().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Ordered List">
                <ListOrdered class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().toggleTaskList().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('taskList') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Task List">
                <CheckSquare class="size-4" />
            </button>
            
            <div class="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>

             <!-- Media -->
             <button type="button" onclick={setLink} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Link">
                <LinkIcon class="size-4" />
            </button>
            <button type="button" onclick={addImage} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300" title="Image">
                <ImageIcon class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300" title="Table">
                <TableIcon class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().toggleBlockquote().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Blockquote">
                <Quote class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().toggleCodeBlock().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors {editor.isActive('codeBlock') ? 'bg-slate-200 dark:bg-slate-700 text-primary' : 'text-slate-600 dark:text-slate-300'}" title="Code Block">
                <Code class="size-4" />
            </button>
             <button type="button" onclick={() => editor?.chain().focus().setHorizontalRule().run()} class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300" title="Horizontal Rule">
                <Minus class="size-4" />
            </button>
        {/if}
    </div>
    
    <!-- Editor Area -->
    <div bind:this={element} class="min-h-[300px] outline-none"></div>
</div>
