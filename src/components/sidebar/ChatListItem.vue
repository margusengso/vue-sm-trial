<script setup lang="ts">
import type { ChatSummary } from "../../types/chat";
defineProps<{ item: ChatSummary; active: boolean }>();

function timeShort(ms: number) {
  if (!ms) return "";
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div
      class="px-3 py-2 border-b border-neutral-200 cursor-pointer bg-white hover:bg-neutral-50"
      :class="active ? 'bg-blue-50/60' : ''"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="text-sm font-semibold text-neutral-700">{{ item.title }}</div>
      <div class="text-[11px] text-neutral-500">{{ timeShort(item.lastMessageAt) }}</div>
    </div>

    <div class="flex items-center justify-between gap-2 mt-0.5">
      <div class="text-[11px] text-neutral-500 truncate max-w-[220px]">{{ item.subtitle }}</div>
      <div
          v-if="item.unreadCount"
          class="text-[11px] px-2 py-[1px] rounded-full bg-amber-300 border border-black/10"
      >
        {{ item.unreadCount }}
      </div>
    </div>
  </div>
</template>