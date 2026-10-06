<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { type Character, type Spell } from '../helpers/types'
import SpellCard from '../components/SpellCard.vue'
import SpellsList from '../components/SpellsList.vue'
import { useRoute, useRouter } from 'vue-router'
import { until } from '@vueuse/core'
import { useCharacterStore } from '../stores/character-store'
import SkillsTab from '../components/Character/SkillsTab.vue'
import CharacterHeader from '../components/Character/CharacterHeader.vue'
import CombatTab from '../components/Character/CombatTab.vue'
import AttributesSection from '../components/Character/GeneralTab.vue'
import ManaPotion from '../components/Icons/ManaPotion.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'
import AppModal from '../components/AppModal.vue'
import EquipmentTab from '../components/Character/EquipmentTab.vue'
import { useFixedBoxStore } from '../stores/fixed-box-store'
import WizardHat from '../components/Icons/WizardHat.vue'

type Tab = 'general' | 'skills' | 'spells' | 'combat' | 'equips'
const parsedData = shallowRef<Spell[]>()
let data: Spell[] = []

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
  ['Combate', 'combat'],
  ['Inventário', 'equips'],
]

const fixedBox = useFixedBoxStore()

const modifiers = computed(() => ({
  strength: Math.floor(((charStore.currentChar?.attributes.strength ?? 10) - 10) / 2),
  dexterity: Math.floor(((charStore.currentChar?.attributes.dexterity ?? 10) - 10) / 2),
  constitution: Math.floor(((charStore.currentChar?.attributes.constitution ?? 10) - 10) / 2),
  wisdom: Math.floor(((charStore.currentChar?.attributes.wisdom ?? 10) - 10) / 2),
  intelligence: Math.floor(((charStore.currentChar?.attributes.intelligence ?? 10) - 10) / 2),
  charisma: Math.floor(((charStore.currentChar?.attributes.charisma ?? 10) - 10) / 2),
}))

const manaModal = ref<InstanceType<typeof AppModal> | null>(null)

const manaPointsCalc = ref(0)

const difficultClass = computed(() => {
  if (!charStore.currentChar?.spell_attribute) {
    return 10
  }
  const modifier = modifiers.value[charStore.currentChar.spell_attribute]
  return 10 + modifier
})

const changeMagicPoints = (action: 'add' | 'subtract') => {
  if (action == 'subtract') {
    substractMana(manaPointsCalc.value)
  } else {
    addMana(manaPointsCalc.value)
  }
  manaPointsCalc.value = 0
  manaModal.value?.closeModal()
}

const substractMana = (qtd: number) => {
  if (!charStore.currentChar) return
  charStore.currentChar.current_mp = Math.max(0, charStore.currentChar.current_mp - qtd)
}
const addMana = (qtd: number) => {
  if (!charStore.currentChar) return
  charStore.currentChar.current_mp = Math.min(
    charStore.currentChar.current_mp + qtd,
    charStore.currentChar.magic_ponts,
  )
}

const deleteSpell = (spell: Spell) => {
  if (!charStore.currentChar) return
  charStore.currentChar.spell_ids = charStore.currentChar.spell_ids.filter((sp) => sp !== spell.id)
  activeSpell.value = undefined
  parseSpells()
  if (charStore.currentChar.spell_ids.length > 0) return
  currentTab.value = 'general'
}
const prepareSpell = (spell: Spell) => {
  if (!charStore.currentChar) return
  const alreadyPrepared = charStore.currentChar.spells_prepared?.find(
    (prepared) => prepared.id == spell.id,
  )
  if (alreadyPrepared) {
    charStore.currentChar.spells_prepared = [
      ...charStore.currentChar.spells_prepared!.filter((prepared) => prepared.id !== spell.id),
      {
        id: alreadyPrepared.id,
        prepared: alreadyPrepared.prepared + 1,
      },
    ]
    return
  }
  charStore.currentChar.spells_prepared = [
    ...(charStore.currentChar.spells_prepared ?? []),
    {
      id: spell.id,
      prepared: 1,
    },
  ]
}

const unprepareSpell = (spell: Spell) => {
  if (!charStore.currentChar) return
  const alreadyPrepared = charStore.currentChar.spells_prepared?.find(
    (prepared) => prepared.id === spell.id,
  )
  if (!alreadyPrepared) return
  if (alreadyPrepared.prepared <= 1) {
    charStore.currentChar.spells_prepared = charStore.currentChar.spells_prepared!.filter(
      (prepared) => prepared.id !== spell.id,
    )
    return
  }
  charStore.currentChar.spells_prepared = [
    ...charStore.currentChar.spells_prepared!.filter((prepared) => prepared.id !== spell.id),
    {
      id: alreadyPrepared.id,
      prepared: alreadyPrepared.prepared - 1,
    },
  ]
}

const parseSpells = () => {
  parsedData.value = data.filter((spell) => charStore.currentChar?.spell_ids.includes(spell.id))
}
onMounted(async () => {
  await until(() => charStore.isFinished).toBe(true)
  const char = charStore.characters.find((char: Character) => char.slug == route.params.slug)
  if (!char) {
    router.push({
      name: 'chars',
    })
    return
  }
  charStore.currentChar = char
  data = (await import('../data/spells.json')).default
  parseSpells()
})
</script>

<template>
  <CharacterHeader :modifiers="modifiers" />

  <ul
    class="mt-6 mx-2 flex justify-between px-8 text-gray-100 bg-neutral-600 rounded-xl lg:justify-center lg:gap-0 lg:px-4 lg:text-xl"
  >
    <template v-for="[label, key] in tabs">
      <li
        @click="currentTab = key"
        :key="key"
        v-if="key !== 'spells' || charStore.currentChar?.spell_ids.length"
        :class="[
          'py-2 lg:cursor-pointer lg:transition lg:hover:text-purple-300 lg:py-3 lg:px-4 lg:w-30 lg:text-center',
          {
            'font-bold text-purple-400 lg:text-white border-b-2 border-purple-400 lg:bg-purple-600':
              currentTab == key,
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
    <div class="grid grid-cols-2 justify-items-center gap-8 w-fit mx-auto">
      <div
        class="relative outline text-center rounded-xl text-gray-100 font-bold text-shadow-purple text-shadow-purple-400 w-[200px] py-4 mt-4 text-2xl"
      >
        <article class="absolute inset-0 flex flex-col items-center justify-center">
          <select
            class="text-sm text-center appearance-none font-bold px-3"
            v-model="charStore.currentChar!.spell_attribute"
          >
            <option value="" disabled>Selecione um</option>
            <option value="strength" class="text-black">Força</option>
            <option value="dexterity" class="text-black">Destreza</option>
            <option value="contitution" class="text-black">Contituição</option>
            <option value="intelligence" class="text-black">Inteligência</option>
            <option value="wisdom" class="text-black">Sabedoria</option>
            <option value="charisma" class="text-black">Carisma</option>
          </select>
          <p class="text-4xl">{{ difficultClass }}</p>
        </article>
        <WizardHat width="100" class="text-purple-600 mx-auto" />
      </div>
      <div
        class="relative outline text-center rounded-xl text-gray-100 font-bold text-shadow-purple text-shadow-purple-400 w-[200px] py-4 mt-4 text-2xl"
        @click="manaModal?.openModal()"
      >
        <span
          class="absolute inset-0 flex items-center justify-center z-10"
          v-if="charStore.currentChar"
        >
          <button @click.stop="substractMana(1)">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <span
            :class="{
              'text-red-500 font-bold': charStore.currentChar.current_mp < 0,
            }"
            >{{ charStore.currentChar.current_mp }}</span
          >
          / {{ charStore.currentChar?.magic_ponts }}
          <button @click.stop="addMana(1)">
            <i class="fa-solid fa-chevron-up"></i>
          </button>
        </span>
        <ManaPotion width="100" class="text-purple-600 mx-auto" />
      </div>
    </div>
    <SpellsList
      v-model="search"
      :data="parsedData"
      @set-active-spell="(sp) => (activeSpell = sp)"
      @delete="deleteSpell"
      @prepare-spell="prepareSpell"
      @unprepare-spell="unprepareSpell"
      :active-spell="activeSpell"
      :prepared-spells="charStore.currentChar?.spells_prepared"
      :show-learn="false"
    />
    <Transition name="fadeup">
      <SpellCard
        @pin="(data) => (fixedBox.html = data)"
        :show-pin-button="true"
        :spell="activeSpell"
        @close="activeSpell = undefined"
        v-if="activeSpell !== undefined"
      />
    </Transition>
    <AppModal ref="manaModal" v-if="charStore.currentChar">
      <label for="life_points" class="mt-2 text-lg font-semibold mb-1 block"
        >Pontos mana totais</label
      >
      <AppInput type="number" id="life_points" v-model="charStore.currentChar.magic_ponts" />

      <div class="mt-4 outline p-2">
        <label for="calc" class="mt-2 text-lg font-semibold mb-1 block">Alterar mana</label>
        <AppInput type="number" id="calc" />
        <div class="mt-4 flex gap-2 items-center">
          <AppButton @click="changeMagicPoints('add')"> Adicionar </AppButton>
          <AppButton class="bg-red-500" @click="changeMagicPoints('subtract')"> Remover </AppButton>
        </div>
      </div>
    </AppModal>
  </template>
  <template v-if="currentTab === 'combat'">
    <CombatTab :modifiers="modifiers" />
  </template>
  <template v-if="currentTab == 'equips'">
    <EquipmentTab />
  </template>
  <div
    class="fixed top-0 text-white bg-neutral-700 w-full p-4 z-10 border-b"
    v-if="fixedBox.html?.length"
  >
    <details class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300">
      <summary>
        <h2 class="text-center lg:text-left text-gray-100 my-4 text-xl font-bold">
          Fixado
          <i
            class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
          ></i>
        </h2>
        <div>
          <div v-html="fixedBox.html"></div>
          <div class="mt-2 text-center">
            <button class="px-4 py-2 bg-purple-600 rounded-md" @click="fixedBox.html = ''">
              Desafixar
            </button>
          </div>
        </div>
      </summary>
    </details>
  </div>
</template>
<style scoped>
.text-shadow-purple {
  text-shadow: 0 0 10px oklch(62.7% 0.265 303.9);
}
</style>
