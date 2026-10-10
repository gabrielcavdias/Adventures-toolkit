<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Spell } from '../helpers/types'
import { capitalize } from '../helpers/functions'

const {
  spell,
  showPinButton = false,
  prepared,
} = defineProps<{
  spell: Spell | undefined
  prepared?: number
  showPinButton?: boolean
}>()
const innerBody = ref<HTMLDivElement | null>(null)
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
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'pin', html: string): void
  (e: 'prepareSpell', spell: Spell): void
  (e: 'unprepareSpell', spell: Spell): void
}>()

const pinHtml = () => {
  if (!innerBody.value) return
  const innerHtml = innerBody.value.innerHTML
  emit('pin', innerHtml)
  emit('close')
}

const dictionary: [string, keyof Spell][] = [
  ['Alcance', 'range'],
  ['Alvo', 'target'],
  ['Duração', 'duration'],
  ['Teste de resistência', 'save'],
]
</script>
<template>
  <div
    class="absolute -translate-y-[400px] w-full rounded-xl bg-neutral-800 overflow-y-auto h-[400px] text-gray-100 px-5 pb-5"
    v-if="spell"
  >
    <div class="flex justify-between pt-2 pr-2">
      <div class="pt-3">
        <button @click="pinHtml" class="cursor-pointer" v-if="showPinButton">
          <i class="fa-solid fa-thumbtack"></i>
        </button>
      </div>
      <div class="pt-3 font-bold lg:hidden" v-if="prepared !== undefined">
        <button @click="emit('prepareSpell', spell)">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <span class="mx-4">
          <i class="fa-solid fa-book-open"></i>
          Preparadas: {{ prepared }}
        </span>
        <button @click="emit('unprepareSpell', spell)">
          <i class="fa-solid fa-chevron-up"></i>
        </button>
      </div>
      <button @click="emit('close')" class="p-3">X</button>
    </div>
    <div :class="{ 'mt-2': showPinButton }" ref="innerBody">
      <h2 class="font-bold text-3xl">{{ spell.title }}</h2>
      <p>
        <span class="font-bold">Nível</span> {{ parsedLevel }} ({{
          spell.descriptors.map(capitalize).join(', ')
        }})
      </p>
      <template v-for="[label, key] in dictionary" :key="key">
        <p v-if="spell[key]">
          <span class="font-bold">
            {{ label }}
          </span>
          {{ spell[key] }}
        </p>
      </template>
      <p class="mt-4">{{ spell.description }}</p>
    </div>
  </div>
</template>
