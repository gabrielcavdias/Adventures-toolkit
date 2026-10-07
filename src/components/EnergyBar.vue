<script lang="ts" setup>
import { computed } from 'vue'

const {
  current,
  total,
  color = '#fb2d36',
} = defineProps<{
  current: number
  total: number
  color?: string
}>()
const percent = computed(() => (current / total) * 100)
</script>
<template>
  <div class="relative isolate outline-2 rounded-md text-center font-bold overflow-hidden">
    <div
      class="absolute left-0 h-full -z-10"
      :style="{
        width: `${percent}%`,
        backgroundColor: color,
      }"
    ></div>
    {{ current }} / {{ total }}
  </div>
</template>
