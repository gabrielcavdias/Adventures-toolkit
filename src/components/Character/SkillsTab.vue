<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ArmorOrShield, Attribute, Skill } from '../../helpers/types'
import AppButton from '../AppButton.vue'
import { useCharacterStore } from '../../stores/character-store'
import { getStealthModifier, parseAttribute } from '../../helpers/functions'
import AppModal from '../AppModal.vue'
import AppInput from '../AppInput.vue'
import { ATT_OPTIONS } from '../../helpers/constants'

const { modifiers } = defineProps<{ modifiers: Record<Attribute, number> }>()
const charStore = useCharacterStore()
const viewSkillModal = ref<InstanceType<typeof AppModal> | null>(null)
const activeSkill = ref<Skill>()
const addSkillModal = ref<InstanceType<typeof AppModal> | null>(null)
const newSkill = reactive<Skill>({
  name: '',
  trained: false,
  other: 0,
  affected_by_armor: false,
  attribute: 'strength',
  trained_only: false,
})

const getSkillLevel = (skill: Skill) => {
  if (skill.trained_only && !skill.trained) {
    return 'NT'
  }
  const stealthBonus =
    skill.name.toLowerCase() === 'furtividade'
      ? getStealthModifier(charStore.currentChar?.size ?? 'medium')
      : 0
  const armorSubtraction = skill.affected_by_armor
    ? (charStore.currentChar?.armor_and_shields.reduce(
        (acc: number, cur: ArmorOrShield) => acc + cur.penality,
        0,
      ) ?? 0)
    : 0
  if (skill.trained) {
    return (
      modifiers[skill.attribute] +
      3 +
      charStore.currentChar!.level +
      +skill.other -
      armorSubtraction +
      stealthBonus
    )
  }
  return (
    Math.floor(charStore.currentChar!.level / 2) - armorSubtraction + stealthBonus + +skill.other
  )
}
const openSkillMenu = (skill: Skill) => {
  activeSkill.value = skill
  viewSkillModal.value?.openModal()
}
const openAddSkillMenu = () => {
  if (addSkillModal.value) addSkillModal.value.openModal()
}
const addNewSkill = () => {
  if (newSkill.name === '' || !charStore.currentChar) return
  charStore.currentChar.skills = [...charStore.currentChar.skills, { ...newSkill }]
  Object.assign(newSkill, {
    name: '',
    trained: false,
    other: 0,
    affected_by_armor: false,
    attribute: 'strength',
    trained_only: false,
  })
  addSkillModal.value?.closeModal()
}

const deleteActiveSkill = () => {
  if (!charStore.currentChar) return
  charStore.currentChar.skills = charStore.currentChar.skills.filter(
    (skill: Skill) => activeSkill.value && skill.name !== activeSkill.value.name,
  )
  activeSkill.value = undefined
  viewSkillModal.value?.closeModal()
}
</script>
<template>
  <div class="mt-4 flex justify-end mr-2">
    <AppButton @click="openAddSkillMenu">Adicionar Perícia</AppButton>
  </div>
  <ul class="mt-4 mx-2 grid gap-2 text-gray-100">
    <li
      v-for="(skill, index) in charStore.currentChar?.skills"
      :key="skill.name"
      class="bg-neutral-600 p-2 rounded-lg flex items-center gap-2"
      @click.stop="openSkillMenu(skill)"
    >
      <input
        type="checkbox"
        :name="`trained_${skill.name}`"
        v-model="charStore.currentChar!.skills[index]!.trained"
        class="accent-purple-500 size-5"
        @click.stop
      />
      <span>
        {{ getSkillLevel(skill) }}
      </span>
      {{ skill.name }}
      <div class="ml-auto flex flex-col justify-end" @click.stop>
        <label :for="`${skill.name}_other`" class="block">outro</label>
        <input
          v-model="skill.other"
          class="w-7 px-2 bg-white text-black rounded-md"
          type="number"
          :name="`${skill.name}_other`"
        />
      </div>
    </li>
  </ul>
  <!-- Modal ver perícia -->
  <AppModal v-if="activeSkill && charStore.currentChar" ref="viewSkillModal">
    <h3 class="font-bold text-xl mb-2">{{ activeSkill.name }}</h3>
    <p>
      <span
        :class="{
          'text-red-400': !activeSkill.trained,
          'text-purple-500': activeSkill.trained,
        }"
      >
        {{ activeSkill.trained ? '✔' : 'X' }}
      </span>
      {{ activeSkill.trained ? 'Treinada' : 'Não treinada' }}
    </p>
    <p>Atributo chave: {{ parseAttribute(activeSkill.attribute) }}</p>
    <p v-if="activeSkill.trained_only">Somente treinada</p>
    <p v-if="activeSkill.affected_by_armor">Afetada por armadura</p>
    <p v-if="activeSkill.name.toLowerCase() === 'furtividade'">
      Modificador de tamanho: {{ getStealthModifier(charStore.currentChar.size) }}
    </p>
    <p>
      Graduação:
      {{
        activeSkill.trained
          ? // Se treinada
            3 + charStore.currentChar?.level
          : activeSkill.trained_only
            ? // Se for só treinada
              'Não treinada'
            : // Se for uma perícia regular não treinada
              Math.floor(charStore.currentChar.level / 2)
      }}
    </p>
    <div class="mt-4 flex items-center gap-2">
      <AppButton @click="activeSkill.trained = !activeSkill.trained">
        <template v-if="activeSkill.trained"> Destreinar </template>
        <template v-else> Treinar </template>
      </AppButton>
      <AppButton class="bg-red-400" @click="deleteActiveSkill">Excluir Perícia</AppButton>
    </div>
  </AppModal>
  <!-- Modal add perícia -->
  <AppModal ref="addSkillModal">
    <label for="name" class="text-lg font-semibold mb-1 block">Nome da perícia</label>
    <AppInput type="text" name="name" id="name" v-model="newSkill.name" />
    <label for="name" class="mt-4 text-lg font-semibold mb-1 block">Atributo relacionado</label>
    <select
      class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-4 w-full rounded-md"
      v-model="newSkill.attribute"
    >
      <option v-for="att in ATT_OPTIONS" :value="att.attribute" :key="att.attribute">
        {{ att.label }}
      </option>
    </select>
    <div class="mt-4 flex items-center gap-2">
      <input
        type="checkbox"
        id="trained_only"
        class="accent-purple-500 size-5"
        v-model="newSkill.trained_only"
      />
      <label for="trained_only">Apenas Treinada</label>
    </div>
    <div class="mt-4 flex items-center gap-2">
      <input
        type="checkbox"
        id="affected_by_armor"
        class="accent-purple-500 size-5"
        v-model="newSkill.affected_by_armor"
      />
      <label for="affected_by_armor">Afetada por armadura</label>
    </div>
    <AppButton @click="addNewSkill" class="mt-4">Adicionar Perícia</AppButton>
  </AppModal>
</template>
