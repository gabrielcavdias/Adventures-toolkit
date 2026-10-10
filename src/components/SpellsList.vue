<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Character, PreparedSpell, Spell } from '../helpers/types'
import { getDescritorIcon, getOriginIcon } from '../helpers/functions'
import { useCharacterStore } from '../stores/character-store'
import AppInput from './AppInput.vue'
import AppModal from './AppModal.vue'
const {
  data,
  activeSpell,
  showLearn = true,
} = defineProps<{
  data: Spell[] | undefined
  preparedSpells?: PreparedSpell[]
  activeSpell: Spell | undefined
  showLearn?: boolean
}>()
const model = defineModel<string>()
const modalRef = ref<InstanceType<typeof AppModal> | null>(null)
const spellToBeLearned = ref<Spell>()
const emit = defineEmits<{
  (e: 'setActiveSpell', spell: Spell): void
  (e: 'delete', spell: Spell): void
  (e: 'prepareSpell', spell: Spell): void
  (e: 'unprepareSpell', spell: Spell): void
}>()
const charStore = useCharacterStore()
const filteredList = computed(() => {
  const filtered = data?.filter((spell) =>
    spell.title.toLowerCase().includes(model.value?.toLowerCase() as string),
  )
  return filtered
})
const saveSpellToCharacter = (spell: Spell) => {
  if (charStore.characters.length == 0) return
  spellToBeLearned.value = spell
  modalRef.value?.openModal()
}
const learnSpellWith = (selectedChar: Character) => {
  if (!spellToBeLearned.value) {
    modalRef.value?.closeModal()
    return
  }
  charStore.characters = charStore.characters.map((char) => {
    if (char.slug == selectedChar.slug) {
      selectedChar.spell_ids = [
        ...new Set([...selectedChar!.spell_ids, spellToBeLearned.value!.id]),
      ]
      return selectedChar
    }
    return char
  })
  modalRef.value?.closeModal()
}
</script>
<template>
  <div class="bg-neutral-800 py-2 mt-8 mx-2">
    <div class="flex justify-center px-2">
      <AppInput type="text" placeholder="Buscar magia" aria-label="Buscar magia" v-model="model" />
    </div>
    <ul class="rounded-lg px-1 py-2 h-[70vh] overflow-scroll space-y-2">
      <li
        :key="spell.id"
        v-for="spell in filteredList"
        class="flex gap-2 cursor-pointer"
        @click="emit('setActiveSpell', spell)"
      >
        <div
          :class="[
            'p-2 rounded-lg min-w-fit',
            {
              'bg-neutral-700 text-gray-100': activeSpell?.id !== spell.id,
              'bg-purple-900 outline-2 outline-purple-300 text-amber-300':
                activeSpell?.id == spell.id,
            },
          ]"
        >
          {{
            spell.origins.includes('divina') && !spell.origins.includes('arcana')
              ? spell.divine_level
              : spell.arcane_level
          }}
          º
        </div>
        <div
          :class="[
            'p-2 rounded-lg w-full flex items-center',
            {
              'bg-neutral-700 text-gray-100': activeSpell?.id !== spell.id,
              'bg-purple-900 outline-2 outline-purple-300 text-amber-300':
                activeSpell?.id == spell.id,
            },
          ]"
        >
          <i
            :key="descriptor"
            v-for="descriptor in spell.descriptors"
            :class="[getDescritorIcon(descriptor), 'ml-2']"
          ></i>
          <span class="ml-2">{{ spell.title }}</span>
          <span class="ml-auto" v-if="charStore.characters.length > 0">
            <template v-if="showLearn">
              <button
                v-for="origin in spell.origins"
                :key="origin"
                @click.stop="saveSpellToCharacter(spell)"
              >
                <i :class="[getOriginIcon(origin), 'ml-1']"></i>
              </button>
            </template>
            <template v-else>
              <button
                :class="[
                  'relative mr-2 text-gray-100 hover:text-purple-300 cursor-pointer hidden lg:inline',
                  {
                    'text-purple-500!': preparedSpells?.some((item) => item.id == spell.id),
                  },
                ]"
                @click.stop.left="emit('prepareSpell', spell)"
                @click.stop.right.prevent="emit('unprepareSpell', spell)"
              >
                <i class="fa-solid fa-book-open"></i>
                <span class="absolute -translate-x-1/2 left-1/2 top-1 text-white font-bold">
                  {{ preparedSpells?.find((item) => item.id == spell.id)?.prepared }}
                </span>
              </button>
              <button class="text-gray-100 hover:text-red-500" @click.stop="emit('delete', spell)">
                <i class="fa-solid fa-square-minus"></i>
              </button>
            </template>
          </span>
        </div>
      </li>
    </ul>
  </div>
  <AppModal ref="modalRef">
    <p class="my-2">
      Para qual personagem você deseja adicionar a magia {{ spellToBeLearned?.title }}?
    </p>
    <ul class="grid gap-1">
      <li v-for="char in charStore.characters" :key="char.slug">
        <button class="block bg-purple-600 w-full rounded-md p-2" @click="learnSpellWith(char)">
          {{ char.name }}
        </button>
      </li>
    </ul>
  </AppModal>
</template>
