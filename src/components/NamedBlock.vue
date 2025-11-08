<script setup lang="ts">
const { label, value, tag = 'div' } = defineProps<{ label: string; value: unknown; tag?: string }>()
</script>
<template>
  <component :is="tag" class="text-center rounded outline outline-gray-100 overflow-hidden">
    <span class="block border-b border-gray-100 w-full bg-purple-600">{{ label }}</span>
    <span class="block text-2xl">
      {{ value }}
    </span>
    <span class="flex justify-center gap-1">
      <slot></slot>
    </span>
  </component>
</template>
