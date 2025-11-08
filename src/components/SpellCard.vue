<script setup lang="ts">
import { computed } from 'vue'
import type { Spell } from '../helpers/types'
import { capitalize } from '../helpers/functions'

const { spell } = defineProps<{
  spell: Spell | undefined
}>()
const parsedLevel = computed(() => {
  let level = ''
  if (spell?.origins.includes('arcana')) {
    level += `Arcana ${spell.arcane_level}`
  }
  if (spell?.origins.includes('divina')) {
    level += `${level.length !== 0 ? ', ' : ''} Divina ${spell?.divine_level}`
  }
  return level
})
const emit = defineEmits(['close'])
const dictionary = [
  ['Alcance', 'range'],
  ['Alvo', 'target'],
  ['Duração', 'duration'],
  ['Teste de resistência', 'save'],
]
</script>
<template>
  <div
    class="absolute -translate-y-[400px] w-full rounded-xl bg-neutral-800 overflow-y-auto h-[400px] text-gray-100 px-3 pb-5"
    v-if="spell"
  >
    <div class="flex justify-end pt-2 pr-2">
      <button @click="emit('close')" class="p-3">X</button>
    </div>
    <h2 class="font-bold text-3xl">{{ spell.title }}</h2>
    <p>
      <span class="font-bold">Nível</span> {{ parsedLevel }} ({{
        spell.descriptors.map(capitalize).join(', ')
      }})
    </p>
    <template v-for="[label, key] in dictionary" :key="key">
      <p v-if="spell[key as keyof typeof spell]">
        <span class="font-bold">
          {{ label }}
        </span>
        {{ spell[key as keyof typeof spell] }}
      </p>
    </template>
    <p class="mt-4">{{ spell.description }}</p>
  </div>
</template>
