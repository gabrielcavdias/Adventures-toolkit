<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import data from '../data/spells.json'
import { type Character, type Spell } from '../helpers/types'
import SpellCard from '../components/SpellCard.vue'
import SpellsList from '../components/SpellsList.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCharacterStore } from '../stores/character-store'
import SkillsTab from '../components/Character/SkillsTab.vue'
import CharacterHeader from '../components/Character/CharacterHeader.vue'
import CombatTab from '../components/Character/CombatTab.vue'
import AttributesSection from '../components/Character/GeneralTab.vue'

type Tab = 'general' | 'skills' | 'spells' | 'combat'
const parsedData = ref<Spell[]>()

const route = useRoute()
const router = useRouter()
const search = ref('')
const activeSpell = ref<Spell>()
const charStore = useCharacterStore()
const currentTab = ref<Tab>('general')
const tabs: [string, Tab][] = [
  ['Geral', 'general'],
  ['Perícias', 'skills'],
  ['Magias', 'spells'],
  ['Talentos e combate', 'combat'],
]

const modifiers = computed(() => ({
  strength: Math.floor(((charStore.currentChar?.attributes.strength ?? 10) - 10) / 2),
  dexterity: Math.floor(((charStore.currentChar?.attributes.dexterity ?? 10) - 10) / 2),
  constitution: Math.floor(((charStore.currentChar?.attributes.constitution ?? 10) - 10) / 2),
  wisdom: Math.floor(((charStore.currentChar?.attributes.wisdom ?? 10) - 10) / 2),
  intelligence: Math.floor(((charStore.currentChar?.attributes.intelligence ?? 10) - 10) / 2),
  charisma: Math.floor(((charStore.currentChar?.attributes.charisma ?? 10) - 10) / 2),
}))

const deleteSpell = (spell: Spell) => {
  if (!charStore.currentChar) return
  charStore.currentChar.spell_ids = charStore.currentChar.spell_ids.filter((sp) => sp !== spell.id)
  activeSpell.value = undefined
  parseSpells()
  if (charStore.currentChar.spell_ids.length > 0) return
  currentTab.value = 'general'
}
const parseSpells = () => {
  parsedData.value = data.filter((spell) => charStore.currentChar?.spell_ids.includes(spell.id))
}
onMounted(() => {
  const char = charStore.characters.find((char: Character) => char.slug == route.params.slug)
  if (!char) {
    router.push({
      name: 'chars',
    })
  }
  charStore.currentChar = char
  parseSpells()
})
</script>

<template>
  <CharacterHeader :modifiers="modifiers" />

  <ul class="mt-6 mx-2 flex justify-between px-8 text-gray-100 bg-neutral-600 rounded-xl">
    <template v-for="[label, key] in tabs">
      <li
        @click="currentTab = key"
        :key="key"
        v-if="key !== 'spells' || charStore.currentChar?.spell_ids.length"
        :class="[
          'py-2',
          {
            'font-bold text-purple-400 border-b-2 border-purple-400': currentTab == key,
          },
        ]"
      >
        {{ label }}
      </li>
    </template>
  </ul>

  <template v-if="currentTab === 'general' && charStore.currentChar">
    <AttributesSection :modifiers="modifiers" />
  </template>
  <template v-if="currentTab == 'skills'">
    <SkillsTab :modifiers="modifiers" />
  </template>
  <template v-if="currentTab == 'spells'">
    <SpellsList
      v-model="search"
      :data="parsedData"
      @set-active-spell="(sp) => (activeSpell = sp)"
      @delete="deleteSpell"
      :active-spell="activeSpell"
      :show-learn="false"
    />
    <Transition name="fadeup">
      <SpellCard
        :spell="activeSpell"
        @close="activeSpell = undefined"
        v-if="activeSpell !== undefined"
      />
    </Transition>
  </template>
  <template v-if="currentTab === 'combat'">
    <CombatTab :modifiers="modifiers" />
  </template>
</template>
<style scoped>
.text-shadow-purple {
  text-shadow: 0 0 10px oklch(62.7% 0.265 303.9);
}
</style>
