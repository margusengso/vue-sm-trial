<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div class="flex items-center gap-2 my-3 text-[11px] text-neutral-500">
    <div class="flex-1 h-px bg-neutral-200"></div>
    <div class="px-2 py-[2px] ">{{ label }}</div>
    <div class="flex-1 h-px bg-neutral-200"></div>
  </div>
</template>