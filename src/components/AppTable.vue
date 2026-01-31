<script setup lang="ts">
const { headers } = defineProps<{
  headers: string[]
}>()
</script>
<template>
  <div
    class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default"
  >
    <table class="w-full text-sm text-left rtl:text-right text-body">
      <thead
        class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default"
      >
        <tr>
          <th scope="col" class="px-6 py-3 font-medium" v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
        <tr class="bg-neutral-primary border-b border-default">
          <td class="px-6 py-4">Silver</td>
          <td class="px-6 py-4">Laptop</td>
          <td class="px-6 py-4">$2999</td>
          <td class="px-6 py-4">231</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
