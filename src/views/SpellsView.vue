<script setup lang="ts">
import { onMounted, ref } from 'vue'
import data from '../data/spells.json'
import type { Spell } from '../helpers/types'
import SpellCard from '../components/SpellCard.vue'
import SpellsList from '../components/SpellsList.vue'

const parsedData = ref<Spell[]>()
const search = ref('')
const activeSpell = ref<Spell>()

onMounted(() => {
  parsedData.value = data.sort((a, b) => {
    const aLevel = (
      a.origins.includes('divina') && !a.origins.includes('arcana')
        ? a.divine_level
        : a.arcane_level
    ) as number
    const bLevel = (
      b.origins.includes('divina') && !b.origins.includes('arcana')
        ? b.divine_level
        : b.arcane_level
    ) as number

    if (aLevel < bLevel) {
      return -1
    } else if (aLevel > bLevel) {
      return 1
    }
    return 0
  })
})
</script>

<template>
  <h2 class="text-gray-100 text-3xl m-2">Magias</h2>

  <SpellsList
    v-model="search"
    :data="parsedData"
    @set-active-spell="(sp) => (activeSpell = sp)"
    :active-spell="activeSpell"
  />
  <Transition name="fadeup">
    <SpellCard
      :spell="activeSpell"
      @close="activeSpell = undefined"
      v-if="activeSpell !== undefined"
    />
  </Transition>
</template>
