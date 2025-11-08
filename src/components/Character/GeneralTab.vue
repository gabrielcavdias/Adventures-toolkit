<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Attribute, Expandable } from '../../helpers/types'
import { useCharacterStore } from '../../stores/character-store'
import AppModal from '../AppModal.vue'
import AttributeBlock from '../AttributeBlock.vue'
import AppInput from '../AppInput.vue'
import AppButton from '../AppButton.vue'
const { modifiers } = defineProps<{ modifiers: Record<Attribute, number> }>()
const savesModal = ref<InstanceType<typeof AppModal> | null>(null)
const classAbilitiesModal = ref<InstanceType<typeof AppModal> | null>(null)
const raceAbilitiesModal = ref<InstanceType<typeof AppModal> | null>(null)
const deleteAbilityModal = ref<InstanceType<typeof AppModal> | null>(null)

const charStore = useCharacterStore()
const newClassAbility = ref<Expandable>({
  title: '',
  body: '',
})
const newRaceAbility = ref<Expandable>({
  title: '',
  body: '',
})
const abilityToDelete = ref<{
  title: string
  index: number
  type: 'race' | 'class'
}>()
const startTime = ref<number>(new Date().getTime())
const halfLevel = computed(() => Math.floor((charStore.currentChar?.level ?? 0) / 2))
const savings = computed(() => ({
  fortitude:
    halfLevel.value +
    modifiers.constitution +
    +(charStore.currentChar?.saving?.fortitude_other ?? 0),
  reflex:
    halfLevel.value + modifiers.dexterity + +(charStore.currentChar?.saving?.reflex_other ?? 0),
  will: halfLevel.value + modifiers.wisdom + +(charStore.currentChar?.saving?.will_other ?? 0),
}))

const addAbility = (type: 'race' | 'class') => {
  if (!charStore.currentChar) return
  if (type == 'race') {
    if (newRaceAbility.value.title === '') return
    charStore.currentChar.race_abilitites.push({ ...newRaceAbility.value })
    newRaceAbility.value.title = ''
    newRaceAbility.value.body = ''
    raceAbilitiesModal.value?.closeModal()
    return
  }
  if (newClassAbility.value.title === '') return
  charStore.currentChar.class_abilities.push({ ...newClassAbility.value })
  newClassAbility.value.title = ''
  newClassAbility.value.body = ''
  classAbilitiesModal.value?.closeModal()
}
const countSeconds = () => {
  startTime.value = new Date().getTime()
}
const openDeleteAbilityModal = (type: 'race' | 'class', index: number) => {
  if (!charStore.currentChar) return
  const startSeconds = startTime.value / 1000
  const endSeconds = new Date().getTime() / 1000
  const holdTime = endSeconds - startSeconds
  if (holdTime < 1) return
  const targetList =
    type == 'race' ? charStore.currentChar.race_abilitites : charStore.currentChar.class_abilities

  abilityToDelete.value = {
    title: targetList[index]?.title ?? '',
    index,
    type,
  }
  deleteAbilityModal.value?.openModal()
}

const deleteAbility = () => {
  if (!abilityToDelete.value || !charStore.currentChar) return
  const targetList =
    abilityToDelete.value.type == 'race'
      ? charStore.currentChar.race_abilitites
      : charStore.currentChar.class_abilities
  const index = abilityToDelete.value.index
  targetList.splice(index, 1)
  deleteAbilityModal.value?.closeModal()
  abilityToDelete.value = undefined
}
</script>

<template>
  <template v-if="charStore.currentChar">
    <details class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300">
      <summary>
        <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
          Atributos
          <i
            class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
          ></i>
        </h2>
      </summary>
      <ul class="mt-4 text-gray-100 grid grid-cols-3 gap-2 mx-2 pb-2">
        <AttributeBlock
          label="Força"
          attribute="strength"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.strength = vl)"
        />
        <AttributeBlock
          label="Destreza"
          attribute="dexterity"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.dexterity = vl)"
        />
        <AttributeBlock
          label="Constituição"
          attribute="constitution"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.constitution = vl)"
        />
        <AttributeBlock
          label="Inteligência"
          attribute="intelligence"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.intelligence = vl)"
        />
        <AttributeBlock
          label="Sabedoria"
          attribute="wisdom"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.wisdom = vl)"
        />
        <AttributeBlock
          label="Carisma"
          attribute="charisma"
          :attributes="charStore.currentChar.attributes"
          :modifiers="modifiers"
          @set-value="(vl) => (charStore.currentChar!.attributes.charisma = vl)"
        />
      </ul>
    </details>
    <details
      class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    >
      <summary>
        <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
          Resistências
          <i
            class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
          ></i>
        </h2>
      </summary>
      <ul class="mt-4 text-gray-100 flex mx-2 gap-2 pb-2" @click="savesModal?.openModal()">
        <li class="text-center outline-gray-100 outline rounded-md overflow-hidden w-full pb-1">
          <span class="block w-full bg-purple-600 mb-1">Fortitude</span>
          {{ savings.fortitude }}
        </li>
        <li class="text-center outline-gray-100 outline rounded-md overflow-hidden w-full pb-1">
          <span class="block w-full bg-purple-600 mb-1">Reflexos</span>
          {{ savings.reflex }}
        </li>
        <li class="text-center outline-gray-100 outline rounded-md overflow-hidden w-full pb-1">
          <span class="block w-full bg-purple-600 mb-1">Vontade</span>
          {{ savings.will }}
        </li>
      </ul>
    </details>
    <details
      class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    >
      <summary>
        <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
          Habilidades de classe
          <i
            class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
          ></i>
        </h2>
      </summary>
      <div class="flex flex-col items-end mx-2">
        <AppButton @click="classAbilitiesModal?.openModal()">Adicionar nova</AppButton>
        <ul class="mt-4 text-gray-100 w-full grid gap-2">
          <li
            v-for="(ability, index) in charStore.currentChar.class_abilities"
            :key="ability.title"
            @touchstart="countSeconds"
            @touchend="openDeleteAbilityModal('class', index)"
          >
            <details>
              <summary class="bg-purple-600 py-2 px-4 outline rounded-md flex justify-between">
                {{ ability.title }}
                <button
                  class="text-red-400 hidden lg:inline"
                  @click="charStore.currentChar.class_abilities.splice(index, 1)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </summary>
              <p class="bg-neutral-800 p-3">
                {{ ability.body }}
              </p>
            </details>
          </li>
        </ul>
      </div>
    </details>
    <details
      class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    >
      <summary>
        <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
          Habilidades de raça
          <i
            class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
          ></i>
        </h2>
      </summary>
      <div class="flex flex-col items-end mx-2">
        <AppButton @click="raceAbilitiesModal?.openModal()">Adicionar nova</AppButton>
        <ul class="mt-4 text-gray-100 w-full grid gap-2">
          <li
            v-for="(ability, index) in charStore.currentChar.race_abilitites"
            :key="ability.title"
            @touchstart="countSeconds"
            @touchend="openDeleteAbilityModal('race', index)"
          >
            <details>
              <summary class="bg-purple-600 py-2 px-4 outline rounded-md flex justify-between">
                {{ ability.title }}
                <button
                  class="text-red-400 hidden lg:inline"
                  @click="charStore.currentChar.race_abilitites.splice(index, 1)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </summary>
              <p class="bg-neutral-800 p-3">
                {{ ability.body }}
              </p>
            </details>
          </li>
        </ul>
      </div>
    </details>
    <AppModal ref="savesModal">
      <h3 class="text-center text-2xl font-bold">Resistências</h3>
      <p class="text-xl mb-2">Fortitude: {{ savings.fortitude }}</p>
      <ul class="flex">
        <li class="outline w-full p-2">
          <span class="block font-bold">1/2 do nível</span>
          {{ halfLevel }}
        </li>
        <li class="outline w-full p-2">
          <span class="block font-bold">Mod. Const</span>
          {{ modifiers.constitution }}
        </li>
        <li class="outline w-full p-2">
          <label for="fortitude_other" class="block font-bold">Outros</label>
          <AppInput
            type="number"
            id="fortitude_other"
            v-model="charStore.currentChar.saving.fortitude_other"
          />
        </li>
      </ul>
      <!--  -->
      <p class="text-xl mb-2">Reflexo: {{ savings.reflex }}</p>
      <ul class="flex">
        <li class="outline w-full p-2">
          <span class="block font-bold">1/2 do nível</span>
          {{ halfLevel }}
        </li>
        <li class="outline w-full p-2">
          <span class="block font-bold">Mod. Dest</span>
          {{ modifiers.dexterity }}
        </li>
        <li class="outline w-full p-2">
          <label for="reflex_other" class="block font-bold">Outros</label>
          <AppInput
            type="number"
            id="reflex_other"
            v-model="charStore.currentChar.saving.reflex_other"
          />
        </li>
      </ul>
      <!--  -->
      <p class="text-xl my-2">Vontade {{ savings.will }}:</p>
      <ul class="flex">
        <li class="outline w-full p-2">
          <span class="block font-bold">1/2 do nível</span>
          {{ halfLevel }}
        </li>
        <li class="outline w-full p-2">
          <span class="block font-bold">Mod. Sab</span>
          {{ modifiers.wisdom }}
        </li>
        <li class="outline w-full p-2">
          <label for="will_other" class="block font-bold">Outros</label>
          <AppInput
            type="number"
            id="will_other"
            v-model="charStore.currentChar.saving.will_other"
          />
        </li>
      </ul>
    </AppModal>
    <AppModal ref="classAbilitiesModal">
      <h2 class="text-center text-gray-100 font-bold my-4 text-2xl">
        Adicionar habilidade de classe
      </h2>
      <label for="class_ability_title" class="text-lg font-semibold mb-1 block">
        Título da habilidade
      </label>
      <AppInput type="text" id="class_ability_title" v-model="newClassAbility.title" />
      <label for="class_ability_body" class="mt-2 text-lg font-semibold mb-1 block">
        Descrição da habilidade <span class="text-gray-400">(Opcional)</span>
      </label>
      <textarea
        id="class_ability_body"
        class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
        v-model="newClassAbility.body"
      ></textarea>
      <div class="flex justify-end mt-2">
        <AppButton @click="addAbility('class')">Adicionar Habilidade</AppButton>
      </div>
    </AppModal>
    <AppModal ref="raceAbilitiesModal">
      <h2 class="text-center text-gray-100 font-bold my-4 text-2xl">
        Adicionar habilidade de raça
      </h2>
      <label for="race_ability_title" class="text-lg font-semibold mb-1 block">
        Título da habilidade
      </label>
      <AppInput type="text" id="race_ability_title" v-model="newRaceAbility.title" />
      <label for="race_ability_body" class="mt-2 text-lg font-semibold mb-1 block">
        Descrição da habilidade <span class="text-gray-400">(Opcional)</span>
      </label>
      <textarea
        id="race_ability_body"
        class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
        v-model="newRaceAbility.body"
      ></textarea>
      <div class="flex justify-end mt-2">
        <AppButton @click="addAbility('race')">Adicionar Habilidade</AppButton>
      </div>
    </AppModal>
    <AppModal ref="deleteAbilityModal">
      <p class="text-xl">
        Tem certeza que deseja excluir a habilidade {{ abilityToDelete?.title }} ?
      </p>
      <div class="mt-2">
        <AppButton class="bg-red-500" @click="deleteAbility">Excluir habilidade</AppButton>
      </div>
    </AppModal>
  </template>
</template>
