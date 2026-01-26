<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { ImageMessage } from "../../../types/chat";
import BubbleBase from "./BubbleBase.vue";
defineProps<{ message: ImageMessage }>();
const emit = defineEmits<{ (e: "loaded"): void }>();

const loaded = ref(false);
const failed = ref(false);

const TIMEOUT_MS = 12000;
let timeoutId: number | null = null;

const showSkeleton = computed(() => !loaded.value && !failed.value);

function clearTimer() {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function startTimer() {
  clearTimer();
  timeoutId = window.setTimeout(() => {
    if (!loaded.value && !failed.value) {
      failed.value = true;
      loaded.value = true;
      emit("loaded");
    }
  }, TIMEOUT_MS);
}

function onLoad() {
  clearTimer();
  loaded.value = true;
  emit("loaded");
}

function onError() {
  clearTimer();
  failed.value = true;
  loaded.value = true;
  emit("loaded");
}

startTimer();
onBeforeUnmount(clearTimer);
</script>

<template>
  <BubbleBase :direction="message.direction">
    <!-- Fixed media box height -->
    <div class="w-full rounded-lg overflow-hidden mb-1.5 bg-black/[0.03] relative h-[180px]">
      <!-- skeleton fills fixed box -->
      <div
          v-if="showSkeleton"
          class="absolute inset-0 animate-pulse bg-gradient-to-r from-black/10 via-black/5 to-black/10"
      />

      <div v-if="failed" class="absolute inset-0 flex items-center justify-center p-4 text-xs text-neutral-500">
        Image failed to load
      </div>


      <img
          v-show="!failed"
          class="w-full h-full object-cover"
          :src="message.url"
          :alt="message.caption || 'attachment'"
          loading="lazy"
          decoding="async"
          @load="onLoad"
          @error="onError"
      />
    </div>

    <div v-if="message.caption" class="text-xs leading-snug whitespace-pre-wrap mb-1">
      {{ message.caption }}
    </div>

    <slot name="meta" />
  </BubbleBase>
</template>