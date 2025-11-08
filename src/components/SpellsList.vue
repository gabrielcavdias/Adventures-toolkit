<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Character, Spell } from '../helpers/types'
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
  activeSpell: Spell | undefined
  showLearn?: boolean
}>()
const model = defineModel<string>()
const modalRef = ref<InstanceType<typeof AppModal> | null>(null)
const spellToBeLearned = ref<Spell>()
const emit = defineEmits<{
  (e: 'setActiveSpell', spell: Spell): void
  (e: 'delete', spell: Spell): void
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
        :key="item.id"
        v-for="item in filteredList"
        class="flex gap-2 cursor-pointer"
        @click="emit('setActiveSpell', item)"
      >
        <div
          :class="[
            'p-2 rounded-lg min-w-fit',
            {
              'bg-neutral-700 text-gray-100': activeSpell?.id !== item.id,
              'bg-purple-900 outline-2 outline-purple-300 text-amber-300':
                activeSpell?.id == item.id,
            },
          ]"
        >
          {{
            item.origins.includes('divina') && !item.origins.includes('arcana')
              ? item.divine_level
              : item.arcane_level
          }}
          º
        </div>
        <div
          :class="[
            'p-2 rounded-lg w-full flex items-center',
            {
              'bg-neutral-700 text-gray-100': activeSpell?.id !== item.id,
              'bg-purple-900 outline-2 outline-purple-300 text-amber-300':
                activeSpell?.id == item.id,
            },
          ]"
        >
          <i
            :key="descriptor"
            v-for="descriptor in item.descriptors"
            :class="[getDescritorIcon(descriptor), 'ml-2']"
          ></i>
          <span class="ml-2">{{ item.title }}</span>
          <span class="ml-auto" v-if="charStore.characters.length > 0">
            <template v-if="showLearn">
              <button
                v-for="origin in item.origins"
                :key="origin"
                @click.stop="saveSpellToCharacter(item)"
              >
                <i :class="[getOriginIcon(origin), 'ml-1']"></i>
              </button>
            </template>
            <template v-else>
              <button class="text-gray-100 hover:text-red-500" @click.stop="emit('delete', item)">
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
