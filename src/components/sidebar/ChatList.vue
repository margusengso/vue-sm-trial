<script setup lang="ts">
import type { ChatSummary } from "../../types/chat";
import ChatListItem from "./ChatListItem.vue";

defineProps<{ items: ChatSummary[]; activeId: string }>();

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "close"): void;
}>();
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr]">
    <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-200">
      <div class="text-sm font-semibold text-neutral-700">Chats</div>
      <button class="md:hidden w-7 h-7 rounded border border-neutral-200" @click="emit('close')">✕</button>
    </div>

    <div class="overflow-auto">
      <ChatListItem
          v-for="c in items"
          :key="c.id"
          :item="c"
          :active="c.id === activeId"
          @click="emit('select', c.id)"
      />
    </div>
  </div>
</template>