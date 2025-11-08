<script setup lang="ts">
const { size = 'md' } = defineProps<{ size?: 'sm' | 'md' }>()
</script>
<template>
  <button
    :class="[
      'bg-purple-500 hover:bg-purple-700 text-white font-bold rounded',
      {
        'py-1 px-2': size == 'sm',
        'py-2 px-4': size == 'md',
      },
    ]"
  >
    <slot></slot>
  </button>
</template>
