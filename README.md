# FE Chat Assessment (Vue 3 + TS + Pinia + Tailwind) : Margus Engso

## Run locally
npm i  
npm run dev

## What’s implemented
- Multi-chat UI (mocked conversation list + switching)
- Infinite scroll message history: 20 messages per batch (loads older when reaching top)
- Date dividers between different days
- Auto-scroll to bottom on initial load and when sending a message
- Unread marker for the most recent incoming message (clears when user reaches bottom)
- Message types: Text + Image
  - Incoming vs outgoing bubble styles
  - Timestamp
  - Outgoing-only read receipts
  - Image lazy loading + loading skeleton
- Composer:
  - Auto-resizing textarea
  - Enter to send / Shift+Enter new line
  - Trim + prevent empty sends
  - Image attachment via URL prompt
  - Send disabled when input is empty
- Responsive design: sidebar drawer on mobile, split view on desktop

## Technical choices
- Vue 3 Composition API + TypeScript for maintainability and type-safe message modeling.
- Pinia store to manage multi-chat state, per-chat paging cursors, and per-chat unread markers.
- Registry-based message renderer for extensible message types:
  - Add new message types (video/audio/file) by creating a component and registering it.
  - No changes required in the list renderer.
- Tailwind CSS to match design quickly and keep styling consistent.

## Why no extra 3rd-party libraries for scrolling / lazy loading
This project intentionally avoids specialized chat/virtual-scroll libraries to keep the solution:
- **Transparent**: pagination logic (20/batch), scroll anchoring, and unread tracking are easy to audit.
- **Small**: fewer dependencies for a take-home exercise reduces install/setup friction and avoids overfitting.
- **Aligned to requirements**: the requirements are satisfied with native browser primitives.

Concretely:
- **Infinite scroll** uses an `IntersectionObserver` sentinel at the top of the list and a simple cursor in the store.
- **Scroll position anchoring** during “load older” is handled by measuring `scrollHeight` before/after prepend and restoring `scrollTop`.
- **Image lazy loading** uses native `loading="lazy"` plus a lightweight skeleton + timeout fallback to handle unreliable external URLs.

If this were production with very large histories, I would consider adding:
- **Virtualization** (e.g. `vue-virtual-scroller`) once real performance data shows it’s needed.
- A dedicated media loader/caching strategy if images are heavy and frequent.

## Extending message types
1) Extend union type in `src/types/chat.ts`
2) Create a new component in `src/components/chat/messages/`
3) Register it in `registry.ts`  



P.S. Assignment took approximately 3 hours to solve.
