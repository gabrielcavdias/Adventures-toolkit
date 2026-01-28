<script lang="ts" setup>
import { computed } from 'vue'

const { current, total } = defineProps<{
  current: number
  total: number
}>()
const percent = computed(() => current / total)
</script>
<template>
  <progress :value="percent"></progress>
</template>
