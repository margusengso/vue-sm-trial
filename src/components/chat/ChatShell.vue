<script setup lang="ts">
import { computed } from "vue";
import { useChatStore } from "../../stores/chat.store";
import MessageList from "./MessageList.vue";
import MessageComposer from "./composer/MessageComposer.vue";

const store = useChatStore();
const title = computed(() => store.activeTitle);


</script>

<template>

  <div
      class="h-full min-h-0 bg-white border border-neutral-200 shadow-card rounded-sm overflow-hidden
           flex flex-col
           w-full max-w-[860px] mx-auto"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-200 shrink-0">
      <div class="text-sm font-semibold text-neutral-700 truncate pr-2">{{ title }}</div>

      <button type="button" class="w-7 h-7 rounded grid place-items-center shrink-0 hover:bg-black/5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
              d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              stroke="#6b7280"
              stroke-width="2"
          />
          <path
              d="M16.5 16.5 21 21"
              stroke="#6b7280"
              stroke-width="2"
              stroke-linecap="round"
          />
        </svg>
      </button>
    </div>


    <div class="flex-1 min-h-0">
      <MessageList
          :chat-id="store.activeChatId"
          :messages="store.activeLoaded"
          :unread-message-id="store.activeUnreadMessageId"
          :has-more-older="store.activeHasMoreOlder"
          :is-loading-older="store.activeIsLoadingOlder"
          :scroll-token="store.activeScrollToken"
          @load-older="store.loadOlderBatch"
          @seen-unread="store.clearUnreadIfNeeded"
      />
    </div>


    <div class="shrink-0">
      <MessageComposer
          :subtitle="store.activeSubtitle"
          @send-text="store.sendText"
          @send-image="store.sendImage"
      />
    </div>
  </div>
</template>