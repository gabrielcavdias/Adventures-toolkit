<script setup lang="ts">
import { useNPCStore } from '../stores/npcs-store'
import ManaPotion from './Icons/ManaPotion.vue'

const npcStore = useNPCStore()
const substractMana = (qtd: number) => {
  if (!npcStore.currentNPC) return
  npcStore.currentNPC.mana.current -= qtd
}

const addMana = (qtd: number) => {
  if (!npcStore.currentNPC) return
  npcStore.currentNPC.mana.current = Math.min(
    npcStore.currentNPC.mana.current + qtd,
    npcStore.currentNPC.mana.total,
  )
}
</script>
<template>
  <div
    class="relative text-center rounded-xl text-gray-100 font-bold text-shadow-purple text-shadow-purple-400 w-[200px] py-4 mt-4 text-2xl"
  >
    <span class="absolute inset-0 flex items-center justify-center z-10" v-if="npcStore.currentNPC">
      <button @click.stop="substractMana(1)">
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <span
        :class="{
          'text-red-500 font-bold': npcStore.currentNPC.mana.current < 0,
        }"
        >{{ npcStore.currentNPC.mana.current }}</span
      >
      / {{ npcStore.currentNPC.mana.total }}
      <button @click.stop="addMana(1)">
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    </span>
    <ManaPotion width="100" class="text-purple-600 mx-auto size-24 -mt-4" />
  </div>
</template>
