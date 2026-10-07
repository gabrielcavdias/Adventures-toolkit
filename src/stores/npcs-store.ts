import { defineStore } from 'pinia'
import type { NPC } from '../helpers/types'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { ref } from 'vue'

export const useNPCStore = defineStore('npcs', () => {
  const { data: npcs, isFinished } = useIDBKeyval<NPC[]>('npcs', [], {
    serializer: {
      read: (v) => v as NPC[],
      // IndexedDB can't clone Vue proxies
      write: (v) => JSON.parse(JSON.stringify(v)),
    },
  })

  const currentNPC = ref<NPC>()

  const cloneCurrentNPC = () => {
    if (!currentNPC.value) return
    // TODO: improve to actually use the latest number and not the number in here
    const newNPC = { ...currentNPC.value } as NPC
    const numbersInName = newNPC.name.match(/\d+$/g)
    const numbersInSlug = newNPC.slug.match(/\d+$/g)
    if (numbersInName && numbersInSlug) {
      newNPC.name = newNPC.name.replace(numbersInName[0], (+numbersInName[0] + 1).toString())
      newNPC.slug = newNPC.slug.replace(numbersInSlug[0], (+numbersInSlug[0] + 1).toString())
      console.log(newNPC)
      npcs.value.push(newNPC)
      return
    }
    newNPC.name = newNPC.name + ' 2'
    newNPC.slug = newNPC.slug + '2'
    npcs.value.push(newNPC)
  }

  return {
    npcs,
    isFinished,
    currentNPC,
    cloneCurrentNPC,
  }
})
