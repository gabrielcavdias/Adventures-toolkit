<script setup lang="ts">
const model = defineModel()
</script>
<template>
  <input
    class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
    v-model="model"
  />
</template>
