<script setup lang="ts">
import { computed, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";

defineProps<{ subtitle: string }>();

const emit = defineEmits<{
  (e: "send-text", text: string): void;
  (e: "send-image", url: string, caption?: string): void;
  (e: "sent"): void;
}>();

// rename `textarea` -> `textareaEl` so TS doesn't flag it as unused
const { textarea: textareaEl, input: text } = useTextareaAutosize({
  input: "",
  styleProp: "height",
});

const sending = ref(false);
const canSend = computed(() => text.value.trim().length > 0);

function sendNow() {
  const v = text.value.trim();
  if (!v) return;
  sending.value = true;
  emit("send-text", v);
  text.value = "";
  sending.value = false;
  emit("sent");
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== "Enter") return;
  if (e.shiftKey) return;
  e.preventDefault();
  sendNow();
}

function attachImage() {
  const url = window.prompt("Paste image URL:");
  if (!url || !url.trim()) return;
  const caption = window.prompt("Optional caption (leave empty if none):") ?? undefined;
  emit("send-image", url.trim(), caption?.trim() || undefined);
  emit("sent");
}
</script>

<template>
  <div class="border-t border-neutral-200 bg-white">
    <!-- header strip above composer -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-200 bg-neutral-50">
      <div class="flex items-center gap-2 min-w-0">
        <img
            src="/src/assets/whassup_green_small.png"
            alt="WhatsApp"
            class="w-4 h-4"
            draggable="false"
        />

        <div class="text-xs text-neutral-700 truncate">{{ subtitle }}</div>
      </div>

      <span class="text-[11px] px-2 py-[1px] rounded-full bg-amber-300 border border-black/10">
        2h
      </span>
    </div>

    <!-- textarea on top -->
    <div class="px-3 pt-2">
      <textarea
          ref="textareaEl"
          v-model="text"
          rows="1"
          class="w-full min-h-9 rounded border border-neutral-200 px-3
               text-[13px] leading-[18px] outline-none resize-none
               overflow-hidden py-[9px]"
          placeholder="Type your message here"
          @keydown="onKeyDown"
      />
    </div>

    <div class="px-3 pb-2 pt-2 flex items-center justify-between gap-2">
      <button
          type="button"
          class="w-9 h-9 rounded border border-neutral-200 bg-white text-neutral-600 text-xl leading-none
               flex items-center justify-center"
          @click="attachImage"
          aria-label="Attach image"
      >
        +
      </button>

      <button
          type="button"
          class="h-9 px-6 rounded border border-black/10 text-xs text-white bg-send
               disabled:bg-neutral-200 disabled:text-neutral-400"
          :disabled="!canSend || sending"
          @click="sendNow"
      >
        Send
      </button>
    </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 0;
  height: 0;
}
textarea {
  scrollbar-width: none;
}
</style>