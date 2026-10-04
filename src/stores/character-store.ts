import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { defineStore } from 'pinia'
import type { Character, Equipment } from '../helpers/types'
import { computed, ref } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  const { data: characters, isFinished } = useIDBKeyval<Character[]>('characters', [], {
    serializer: {
      read: (v) => v as Character[],
      // IndexedDB can't clone Vue proxies
      write: (v) => JSON.parse(JSON.stringify(v)),
    },
  })
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

  return { characters, currentChar, isFinished, isCurCharOverEncumbered, curCharTotalCarryWeight }
})
