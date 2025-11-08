<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppModal from '../components/AppModal.vue'
import { useCharacterStore } from '../stores/character-store'
import AppButton from '../components/AppButton.vue'
import AppInput from '../components/AppInput.vue'
import type { Character } from '../helpers/types'
import { convertToSlug } from '../helpers/functions'

const charStore = useCharacterStore()
const addCharModal = ref<InstanceType<typeof AppModal> | null>(null)
const importCharModal = ref<InstanceType<typeof AppModal> | null>(null)
const importCharMessage = ref('')
const file = ref('')
const errorMessage = ref('')
const newChar = reactive<Character>({
  name: '',
  slug: '',
  race: '',
  bab: 0,
  class: '',
  level: 1,
  alignment: '',
  age: 1,
  deity: '',
  size: 'medium',
  speed: '9M',
  life_points: 10,
  action_points: 1,
  current_lp: 10,
  temp_lp: 0,
  magic_ponts: 0,
  current_mp: 0,
  ac_other: 0,
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  saving: {
    fortitude_other: 0,
    reflex_other: 0,
    will_other: 0,
  },
  attacks: {
    hand_other: 0,
    distance_other: 0,
    hand_attribute: 'strength',
    distance_attribute: 'dexterity',
  },
  weapons: [],
  armor_and_shields: [
    {
      ac: 0,
      max_dextrity: 100,
      name: 'Escudo',
      penality: 0,
      type: 'shield',
    },
    {
      ac: 0,
      max_dextrity: 100,
      name: 'Armadura',
      penality: 0,
      type: 'armor',
    },
  ],
  race_abilitites: [],
  class_abilities: [],
  equipments: [],
  money: {
    ts: 0,
    tp: 0,
    to: 0,
    tl: 0,
  },
  languages: [],
  spell_ids: [],
  notes: [],
  feats: [],
  skills: [
    {
      name: 'Acrobacia',
      attribute: 'dexterity',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: true,
    },
    {
      name: 'Adestrar Animais',
      attribute: 'charisma',
      trained: false,
      other: 0,
      trained_only: true,
      affected_by_armor: false,
    },
    {
      name: 'Atletismo',
      attribute: 'strength',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: true,
    },
    {
      name: 'Cavalgar',
      attribute: 'dexterity',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Cura',
      attribute: 'wisdom',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Diplomacia',
      attribute: 'charisma',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Enganação',
      attribute: 'charisma',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Furtividade',
      attribute: 'dexterity',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: true,
    },
    {
      name: 'Identificar Magia',
      attribute: 'intelligence',
      trained: false,
      other: 0,
      trained_only: true,
      affected_by_armor: false,
    },
    {
      name: 'Iniciativa',
      attribute: 'dexterity',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Intimidação',
      attribute: 'charisma',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Intuição',
      attribute: 'wisdom',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Ladinagem',
      attribute: 'dexterity',
      trained: false,
      other: 0,
      trained_only: true,
      affected_by_armor: true,
    },
    {
      name: 'Obter Informação',
      attribute: 'charisma',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Percepção',
      attribute: 'wisdom',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
    {
      name: 'Sobrevivência',
      attribute: 'wisdom',
      trained: false,
      other: 0,
      trained_only: false,
      affected_by_armor: false,
    },
  ],
})
const createNewChar = () => {
  if (newChar.name == '') {
    errorMessage.value = 'Preencha um nome para o seu personagem'
    return
  }
  const alreadyExists = charStore.characters.find((c) => c.slug === convertToSlug(newChar.name))
  if (alreadyExists) {
    errorMessage.value = 'Já existe um personagem com esse nome'
    return
  }

  charStore.characters.push({ ...newChar, slug: convertToSlug(newChar.name) })
  newChar.name = ''
  addCharModal.value?.closeModal()
}

const deleteChar = (slug: string | undefined) => {
  charStore.characters = charStore.characters.filter((char) => char.slug !== slug)
}

async function addJsonCharacter(file: File) {
  const char = await handleJsonfile(file)
  charStore.characters.push(char as Character)
}

async function handleJsonfile(file: File) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        resolve(jsonData)
      } catch (e) {
        console.error(e)
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = function () {
      reject(new Error('Error reading file'))
    }

    reader.readAsText(file)
  })
}
</script>
<template>
  <div class="mt-4 flex justify-between px-2">
    <AppButton @click="importCharModal?.openModal()">
      Importar <i class="fa-solid fa-file-import"></i>
    </AppButton>

    <AppButton @click="addCharModal?.openModal()"> Adicionar Personagem </AppButton>
  </div>

  <ul class="mt-5 mx-2 grid gap-2 text-gray-100">
    <li
      v-for="char in charStore.characters"
      :key="char.name"
      class="bg-neutral-800 p-4 rounded-md flex justify-between"
    >
      <RouterLink
        :to="{
          name: 'chars-single',
          params: {
            slug: char.slug,
          },
        }"
        class="w-full"
      >
        {{ char.name }}
        <span class="block">
          <i class="fa-solid fa-book-open"></i>
          {{ char.spell_ids.length }}
        </span>
      </RouterLink>
      <span>
        <button @click="deleteChar(char.slug)">
          <i class="ml-3 fa-solid fa-trash text-red-500"></i>
        </button>
      </span>
    </li>
  </ul>
  <AppModal ref="addCharModal">
    <label for="name" class="font-bold">Nome</label>
    <AppInput type="text" name="name" id="name" v-model="newChar.name" />
    <span v-if="errorMessage.length" class="text-red-300">
      {{ errorMessage }}
    </span>
    <div class="flex mt-2 justify-end">
      <AppButton @click="createNewChar">Criar</AppButton>
    </div>
  </AppModal>
  <AppModal ref="importCharModal">
    <label
      for="file"
      class="font-bold w-full bg-purple-600 p-4 rounded-md text-center text-xl flex justify-center items-center gap-2"
    >
      {{ file ? `Importado` : 'Enviar arquivo' }}
      <i class="fa-solid fa-file-import"></i>
    </label>
    {{ file }}
    <AppInput
      type="file"
      name="file"
      id="file"
      v-model="file"
      class="hidden"
      @change="async (e: any) => await addJsonCharacter(e.target.files[0])"
    />
    <span v-if="importCharMessage.length" class="text-red-300">
      {{ importCharMessage }}
    </span>
    <div class="flex mt-2 justify-end">
      <AppButton @click="createNewChar">Criar</AppButton>
    </div>
  </AppModal>
</template>
