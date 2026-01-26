<script setup lang="ts">
import { computed } from "vue";
import type { ChatMessage } from "../../types/chat";
import { timeLabel } from "../../utils/dates";
import { messageRegistry } from "./messages/registry";
import DateDivider from "./DateDivider.vue";
import UnreadDivider from "./UnreadDivider.vue";

const props = defineProps<{
  message: ChatMessage;
  showDateDivider: boolean;
  dateLabel: string;
  showUnreadDivider: boolean;
}>();

const component = computed(() => messageRegistry[props.message.type]);

const isOutgoing = computed(() => props.message.direction === "outgoing");

const rowAlign = computed(() =>
    isOutgoing.value ? "items-end" : "items-start"
);

const metaAlign = computed(() =>
    isOutgoing.value ? "justify-end" : "justify-start"
);
</script>

<template>
  <DateDivider v-if="showDateDivider" :label="dateLabel" />
  <UnreadDivider v-if="showUnreadDivider" />

  <div class="flex my-1.5" :class="isOutgoing ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col" :class="rowAlign">
      <!-- Bubble -->
      <component :is="component" :message="message" />

      <!-- Meta (outside bubble) -->
      <div
          class="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-500"
          :class="metaAlign"
      >

        <svg v-if="isOutgoing" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
              d="M12 12.5l2.2 2.2 5.8-5.8"
              stroke="#0aa56d"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.9"
          />
        </svg>


        <span class="opacity-90">WhatsApp</span>
        <span class="opacity-70 font-bold">•</span>
        <span>{{ timeLabel(message.createdAt) }}</span>

        <span
            v-if="isOutgoing"
            class="inline-flex items-center ml-1"
            aria-label="read receipt"
        >

        </span>
      </div>
    </div>
  </div>
</template>