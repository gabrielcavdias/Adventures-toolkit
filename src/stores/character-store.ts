import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Character, Equipment } from '../helpers/types'
import { computed, ref } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  const characters = useLocalStorage<Character[]>('characters', [])
  const currentChar = ref<Character>()

  const curCharTotalCarryWeight = computed(() =>
    (currentChar.value?.equipments ?? []).reduce(
      (acc: number, cur: Equipment) => acc + cur.quantity * cur.weight,
      0,
    ),
  )

  const isCurCharOverEncumbered = computed(
    () => curCharTotalCarryWeight.value > (currentChar.value?.attributes.strength ?? 0) * 3,
  )

  return { characters, currentChar, isCurCharOverEncumbered, curCharTotalCarryWeight }
})
