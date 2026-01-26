<script setup lang="ts">
import type { TextMessage } from "../../../types/chat";
import BubbleBase from "./BubbleBase.vue";

defineProps<{ message: TextMessage }>();
</script>

<template>
  <BubbleBase :direction="message.direction">
    <div class="text-[13px] leading-[1.35] whitespace-pre-wrap break-words">
      {{ message.text }}
    </div>
    <slot name="meta" />
  </BubbleBase>
</template>