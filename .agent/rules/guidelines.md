---
trigger: always_on
---

Binks Web App - AI Coding Guidelines
To ensure consistency in future features or refactors, provide this context to your AI assistant.

1. Technology Stack
   Framework: SvelteKit with Svelte 5 Runes ($state, $derived, $props).
   Styling: TailwindCSS + DaisyUI.
   Icons: lucide-svelte (Import specific icons, e.g., import { User } from 'lucide-svelte').
   State Management:
   .svelte.ts
   files using Svelte 5 reactivity (e.g., pageStore).
2. Design System & UI Rules
   Admin Dashboard Layout
   Tables & Lists:
   MANDATORY: Use the TableLayout component ($lib/components/admin/TableLayout.svelte) for all data views.
Structure: The search bar MUST be visually integrated into the table's card container (preserved by TableLayout).
Avoid: Do not use separate/detached "FilterBar" components.
Headers:
Use the Header component ($lib/components/admin/Header.svelte).
   Style: Minimalist. Do not use the icon={...} prop for section headers properly (Customers, Orders, Coupons, etc.) to maintain a clean look.
   Typography:
   Weight: Use font-medium or font-semibold for headings and important labels. Avoid font-bold unless necessary for status badges.
   Labels: Form labels should be text-sm font-medium.
   Modals:
   Use consistent rounded corners (rounded-2xl).
   Inputs should have focus:ring-2 focus:ring-primary/20.
   Reusable Components
   Actions: Use ActionButtons ($lib/components/admin/ActionButtons.svelte) for table row operations (Edit/Delete).
   Cards: Use consistent bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 styling.
3. Preferred Coding Patterns
   Svelte 5 Syntax: Always use Runes. Avoid legacy export let or $:.
   Imports: Group imports by type (Svelte, Utils, Components, Icons).
   Clean Code: Keep separate logic in lib/utils or stores where possible.
