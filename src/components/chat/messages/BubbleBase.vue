<script setup lang="ts">
defineProps<{ direction: 'incoming' | 'outgoing' }>()
</script>

<template>
  <div
      class="max-w-[78%] rounded-lg px-3 py-2 text-[13px] leading-[1.35]"
      :class="direction === 'outgoing'
      ? 'bg-outgoing'
      : 'bg-incoming'"
  >
    <slot />
  </div>
</template>