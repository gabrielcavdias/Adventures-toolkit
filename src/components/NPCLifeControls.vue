<script setup lang="ts">
import { useNPCStore } from '../stores/npcs-store'
import HeartPotion from './Icons/HeartPotion.vue'
import SkeletonBones from './Icons/SkeletonBones.vue'

const npcStore = useNPCStore()
const subtractLife = (qtd: number) => {
  if (!npcStore.currentNPC) return
  npcStore.currentNPC.life.current -= qtd
}

const addLife = (qtd: number) => {
  if (!npcStore.currentNPC) return
  npcStore.currentNPC.life.current = Math.min(
    npcStore.currentNPC.life.current + qtd,
    npcStore.currentNPC.life.total,
  )
}
</script>
<template>
  <div
    v-if="npcStore.currentNPC"
    class="relative outline py-4 text-center rounded-xl text-gray-100 font-bold text-shadow-purple text-shadow-purple-400 lg:min-w-38 lg:h-fit lg:outline-0"
  >
    <span class="absolute inset-0 flex items-center justify-center z-10">
      <button @click.stop="subtractLife(1)">
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <span
        :class="{
          'text-red-500': npcStore.currentNPC.life.current < 0,
        }"
        >{{ npcStore.currentNPC.life.current }}</span
      >
      / {{ npcStore.currentNPC?.life.total }}
      <button @click.stop="addLife(1)">
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    </span>
    <Transition>
      <HeartPotion
        class="size-24 text-purple-600 mx-auto"
        v-if="
          npcStore.currentNPC.life.current > Math.floor(npcStore.currentNPC.life.total / 2) * -1
        "
      />
      <SkeletonBones class="size-24 text-purple-600 mx-auto drop-shadow-2xl" v-else />
    </Transition>
  </div>
</template>
