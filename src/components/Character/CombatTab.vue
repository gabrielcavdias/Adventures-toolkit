<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacterStore } from '../../stores/character-store'
import AppModal from '../AppModal.vue'
import AppButton from '../AppButton.vue'
import type { AttackType, Attribute, Expandable, Weapon } from '../../helpers/types'
import AppInput from '../AppInput.vue'
import SwordAttack from '../Icons/SwordAttack.vue'
import { ARMOR_TYPE_MAP, ATT_OPTIONS } from '../../helpers/constants'
import NamedBlock from '../NamedBlock.vue'
import BowAndArrow from '../Icons/BowAndArrow.vue'
import { convertToSlug, getSizeModifier } from '../../helpers/functions'

const { modifiers } = defineProps<{ modifiers: Record<Attribute, number> }>()

const charStore = useCharacterStore()
const newFeatItem = ref<Expandable>({
  title: '',
  body: '',
})
const newNoteItem = ref<Expandable>({
  title: '',
  body: '',
})
const newWeaponItem = ref<Weapon>({
  name: '',
  critical: '20',
  damage: '1d6',
  other_bonus: 0,
  type: 'hand',
})
const newWeaponErroMessage = ref('')
const itemToDelete = ref<{
  title: string
  index: number
  type: 'feat' | 'note'
}>()
const fieldToEdit = ref<{
  title: string
  index: number
  type: 'feat' | 'note'
}>()
const abilityEditing = ref<Expandable>({
  title: '',
  body: '',
})
const startTime = ref<number>(new Date().getTime())
const deleteItemModal = ref<InstanceType<typeof AppModal> | null>(null)
const featItemModal = ref<InstanceType<typeof AppModal> | null>(null)
const noteItemModal = ref<InstanceType<typeof AppModal> | null>(null)
const newWeaponModal = ref<InstanceType<typeof AppModal> | null>(null)
const editAbilityModal = ref<InstanceType<typeof AppModal> | null>(null)

const editAbility = () => {
  const index = fieldToEdit.value!.index
  const list =
    fieldToEdit.value?.type == 'feat' ? charStore.currentChar?.feats : charStore.currentChar?.notes
  if (!list) return
  list[index] = abilityEditing.value
  abilityEditing.value = { title: '', body: '' }
  editAbilityModal.value?.closeModal()
}

const openEditAbilityModal = (type: 'feat' | 'note', index: number) => {
  if (!charStore.currentChar) return
  const targetList = type == 'note' ? charStore.currentChar.notes : charStore.currentChar.feats

  fieldToEdit.value = {
    title: targetList[index]?.title ?? '',
    index,
    type,
  }
  abilityEditing.value = {
    title: targetList[index]!.title,
    body: targetList[index]!.body,
  }
  editAbilityModal.value?.openModal()
}

const countSeconds = () => {
  startTime.value = new Date().getTime()
}

const charAttacks = computed<Record<AttackType, number>>(() => {
  const char = charStore.currentChar
  if (!char) {
    return {
      hand: 0,
      distance: 0,
    }
  }
  return {
    hand:
      +char.attacks.hand_other +
      +char.bab +
      +modifiers[char.attacks.hand_attribute] +
      getSizeModifier(char.size),
    distance:
      +char.attacks.distance_other +
      +char.bab +
      +modifiers[char.attacks.distance_attribute] +
      getSizeModifier(char.size),
  }
})

const openDeleteItem = (type: 'feat' | 'note', index: number) => {
  if (!charStore.currentChar) return
  const startSeconds = startTime.value / 1000
  const endSeconds = new Date().getTime() / 1000
  const holdTime = endSeconds - startSeconds
  if (holdTime < 1) return
  const targetList = type == 'feat' ? charStore.currentChar.feats : charStore.currentChar.notes

  itemToDelete.value = {
    title: targetList[index]?.title ?? '',
    index,
    type,
  }
  deleteItemModal.value?.openModal()
}

const addAbility = (type: 'feat' | 'notes') => {
  if (!charStore.currentChar) return
  // Talentos
  if (type == 'feat') {
    if (newFeatItem.value.title === '') return
    charStore.currentChar.feats.push({ ...newFeatItem.value })
    newFeatItem.value.title = ''
    newFeatItem.value.body = ''
    featItemModal.value?.closeModal()
    return
  }
  // Notas
  if (newNoteItem.value.title === '') return
  charStore.currentChar.notes.push({ ...newNoteItem.value })
  newNoteItem.value.title = ''
  newNoteItem.value.body = ''
  noteItemModal.value?.closeModal()
}

const deleteItem = () => {
  if (!itemToDelete.value || !charStore.currentChar) return
  const targetList =
    itemToDelete.value.type == 'feat' ? charStore.currentChar.feats : charStore.currentChar.notes
  const index = itemToDelete.value.index
  targetList.splice(index, 1)
  deleteItemModal.value?.closeModal()
  itemToDelete.value = undefined
}

const createNewWeapon = () => {
  if (newWeaponItem.value.name == '') {
    newWeaponErroMessage.value = 'Preencha um nome para sua arma'
    return
  }
  if (!charStore.currentChar) return
  const alreadyCreatedWeaponNames = charStore.currentChar.weapons.map((w) => w.name.toLowerCase())
  if (alreadyCreatedWeaponNames.includes(newWeaponItem.value.name.toLowerCase())) {
    newWeaponErroMessage.value = 'Você já tem uma arma com esse nome'
    return
  }
  charStore.currentChar.weapons.push({ ...newWeaponItem.value })
  newWeaponModal.value?.closeModal()
  newWeaponItem.value.name = ''
}

const deleteWeapon = (weapon: Weapon) => {
  if (!charStore.currentChar) return
  charStore.currentChar.weapons = charStore.currentChar.weapons.filter(
    (w) => w.name !== weapon.name,
  )
}
</script>
<template>
  <details
    class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    v-if="charStore.currentChar"
  >
    <summary>
      <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
        Talentos
        <i
          class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
        ></i>
      </h2>
    </summary>
    <div class="flex flex-col items-end mx-2">
      <AppButton @click="featItemModal?.openModal()">Adicionar novo</AppButton>
      <ul class="mt-4 text-gray-100 w-full grid gap-2">
        <li
          v-for="(feat, index) in charStore.currentChar.feats"
          :key="feat.title"
          @touchstart="countSeconds"
          @touchend="openDeleteItem('feat', index)"
        >
          <details>
            <summary class="bg-purple-600 py-2 px-4 outline rounded-md flex justify-between">
              {{ feat.title }}
              <div class="flex gap-1">
                <button
                  class="text-red-400 hidden lg:inline"
                  @click="charStore.currentChar.feats.splice(index, 1)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button @click="openEditAbilityModal('feat', index)">
                  <i class="fa-solid fa-pencil"></i>
                </button>
              </div>
            </summary>
            <p class="bg-neutral-800 p-3">
              {{ feat.body }}
            </p>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <details
    class="group transition-all max-h-10 open:max-h-[500px] overflow-hidden duration-300 pb-1"
    v-if="charStore.currentChar"
  >
    <summary>
      <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
        Ataques
        <i
          class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
        ></i>
      </h2>
    </summary>
    <ul class="mx-2 text-gray-100 grid gap-6">
      <li>
        <details>
          <summary>
            <p class="flex items-center justify-center w-full gap-2">
              <SwordAttack class="size-5 text-purple-500" />
              Corpo-a-corpo
            </p>
            <NamedBlock label="Total" :value="charAttacks.hand" class="max-w-1/2 mx-auto my-2" />
          </summary>
          <div class="flex items-center gap-2">
            <div class="w-full">
              <label for="att_hand">Modificador:</label>
              <select
                id="att_hand"
                class="outline py-2 px-4 w-full rounded-md"
                v-model="charStore.currentChar.attacks.hand_attribute"
              >
                <option v-for="att in ATT_OPTIONS" :value="att.attribute" :key="att.attribute">
                  {{ att.label }}
                </option>
              </select>
            </div>
            <div class="w-full">
              <label for="hand_other">Outros:</label>
              <AppInput
                type="number"
                name="hand_other"
                id="hand_other"
                v-model="charStore.currentChar.attacks.hand_other"
              />
            </div>
          </div>
        </details>
      </li>
      <li>
        <details>
          <summary>
            <p class="flex items-center justify-center w-full gap-2">
              <BowAndArrow class="size-5 text-purple-500" />
              À distância
            </p>
            <NamedBlock
              label="Total"
              :value="charAttacks.distance"
              class="max-w-1/2 mx-auto my-2"
            />
          </summary>
          <div class="flex items-center gap-2">
            <div class="w-full">
              <label for="att_distance">Modificador:</label>
              <select
                id="att_distance"
                class="outline py-2 px-4 w-full rounded-md"
                v-model="charStore.currentChar.attacks.distance_attribute"
              >
                <option v-for="att in ATT_OPTIONS" :value="att.attribute" :key="att.attribute">
                  {{ att.label }}
                </option>
              </select>
            </div>
            <div class="w-full">
              <label for="hand_other">Outros:</label>
              <AppInput
                type="number"
                name="hand_other"
                id="hand_other"
                v-model="charStore.currentChar.attacks.distance_other"
              />
            </div>
          </div>
        </details>
      </li>
    </ul>
  </details>

  <details
    class="group max-h-10 open:max-h-[10000px] overflow-hidden transition-all duration-300 pb-1"
    v-if="charStore.currentChar"
  >
    <summary>
      <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
        Armas
        <i
          class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
        ></i>
      </h2>
    </summary>
    <div class="text-gray-100">
      <div class="flex justify-end mb-4 mr-2">
        <AppButton @click="newWeaponModal?.openModal()">Adiciona nova arma</AppButton>
      </div>
      <ul class="mx-2 grid gap-4">
        <li v-for="weapon in charStore.currentChar.weapons" :key="weapon.name">
          <details>
            <summary>
              <p class="font-semibold text-center text-lg mb-4">
                <span class="block mb-2">{{ weapon.name }}</span>
                <AppButton class="bg-red-400" size="sm" @click.stop="deleteWeapon(weapon)">
                  Excluir arma
                </AppButton>
              </p>
              <NamedBlock
                label="Total"
                :value="charAttacks[weapon.type] + weapon.other_bonus"
                class="max-w-1/2 mx-auto"
              />
            </summary>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label :for="convertToSlug(weapon.name) + '_damage'">Dano</label>
                <AppInput
                  type="text"
                  :name="convertToSlug(weapon.name) + '_damage'"
                  :id="convertToSlug(weapon.name) + '_damage'"
                  v-model="weapon.damage"
                />
              </div>
              <div>
                <label :for="convertToSlug(weapon.name) + '_critical'">Crítico</label>
                <AppInput
                  type="text"
                  :name="convertToSlug(weapon.name) + '_critical'"
                  :id="convertToSlug(weapon.name) + '_critical'"
                  v-model="weapon.critical"
                />
              </div>
              <div>
                <label :for="convertToSlug(weapon.name) + '_type'"> Tipo: </label>
                <select
                  :id="convertToSlug(weapon.name) + '_type'"
                  class="outline py-2 px-4 w-full rounded-md"
                  v-model="weapon.type"
                >
                  <option value="hand">Corpo-a-corpo</option>
                  <option value="distance">À distância</option>
                </select>
              </div>
              <div>
                <label :for="convertToSlug(weapon.name) + 'weapon'">Outros</label>
                <AppInput
                  type="number"
                  :name="convertToSlug(weapon.name) + 'weapon'"
                  :id="convertToSlug(weapon.name) + 'weapon'"
                  v-model="weapon.other_bonus"
                />
              </div>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <details
    class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    v-if="charStore.currentChar"
  >
    <summary>
      <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
        Armaduras e escudos
        <i
          class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
        ></i>
      </h2>
    </summary>
    <div class="px-2 text-gray-100 grid gap-4">
      <div
        v-for="armor in charStore.currentChar.armor_and_shields"
        :key="armor.type"
        class="outline rounded"
      >
        <p class="bg-purple-600 font-semibold py-2 col-span-2 pl-2">
          {{ ARMOR_TYPE_MAP[armor.type] }}
        </p>
        <div class="p-2 grid grid-cols-2 gap-2">
          <div>
            <label :for="`name_${armor.name}`"> Nome </label>
            <AppInput
              :id="`name_${armor.name}`"
              :name="`name_${armor.name}`"
              v-model="armor.name"
            />
          </div>
          <div>
            <label :for="`ac_${armor.name}`"> Bônus de CA </label>
            <AppInput :id="`ac_${armor.name}`" :name="`ac_${armor.name}`" v-model="armor.ac" />
          </div>
          <div v-if="armor.type == 'armor'">
            <label :for="`max_dexterity_${armor.name}`"> Max. Destreza </label>
            <AppInput
              :id="`max_dexterity_${armor.name}`"
              :name="`max_dexterity_${armor.name}`"
              v-model="armor.max_dextrity"
            />
          </div>
          <div
            :class="{
              'col-span-2': armor.type == 'shield',
            }"
          >
            <label :for="`penalty_${armor.name}`"> Penalidade Perícia </label>
            <AppInput
              :id="`penalty_${armor.name}`"
              :name="`penalty_${armor.name}`"
              v-model="armor.penality"
            />
          </div>
        </div>
      </div>
    </div>
  </details>

  <details
    class="group max-h-10 open:max-h-[3000px] overflow-hidden transition-all duration-300 pb-1"
    v-if="charStore.currentChar"
  >
    <summary>
      <h2 class="text-center text-gray-100 my-4 text-xl font-bold">
        Notas
        <i
          class="fa-solid fa-chevron-down -rotate-90 group-open:rotate-0 transiton duration-300"
        ></i>
      </h2>
    </summary>
    <div class="flex flex-col items-end mx-2">
      <AppButton @click="noteItemModal?.openModal()">Adicionar nova</AppButton>
      <ul class="mt-4 text-gray-100 w-full grid gap-2">
        <li
          v-for="(note, index) in charStore.currentChar.notes"
          :key="note.title"
          @touchstart="countSeconds"
          @touchend="openDeleteItem('note', index)"
        >
          <details>
            <summary class="bg-purple-600 py-2 px-4 outline rounded-md flex justify-between">
              {{ note.title }}
              <div class="flex gap-2">
                <button @click="openEditAbilityModal('feat', index)">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  class="text-red-400 hidden lg:inline"
                  @click="charStore.currentChar.notes.splice(index, 1)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </summary>
            <p class="bg-neutral-800 p-3">
              {{ note.body }}
            </p>
          </details>
        </li>
      </ul>
    </div>
  </details>

  <AppModal ref="deleteItemModal">
    <p class="text-xl">Tem certeza que deseja excluir {{ itemToDelete?.title }} ?</p>
    <div class="mt-2">
      <AppButton class="bg-red-500" @click="deleteItem">Excluir</AppButton>
    </div>
  </AppModal>

  <AppModal ref="featItemModal">
    <h2 class="text-center text-gray-100 font-bold my-4 text-2xl">Adicionar Talento</h2>
    <label for="title" class="text-lg font-semibold mb-1 block"> Título </label>
    <AppInput type="text" id="title" v-model="newFeatItem.title" />
    <label for="class_ability_body" class="mt-2 text-lg font-semibold mb-1 block">
      Descrição <span class="text-gray-400">(Opcional)</span>
    </label>
    <textarea
      id="class_ability_body"
      class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
      v-model="newFeatItem.body"
    ></textarea>
    <div class="flex justify-end mt-2">
      <AppButton @click="addAbility('feat')">Adicionar Talento</AppButton>
    </div>
  </AppModal>

  <AppModal ref="noteItemModal">
    <h2 class="text-center text-gray-100 font-bold my-4 text-2xl">Adicionar Nota</h2>
    <label for="title" class="text-lg font-semibold mb-1 block"> Título </label>
    <AppInput type="text" id="title" v-model="newNoteItem.title" />
    <label for="class_ability_body" class="mt-2 text-lg font-semibold mb-1 block">
      Descrição <span class="text-gray-400">(Opcional)</span>
    </label>
    <textarea
      id="class_ability_body"
      class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
      v-model="newNoteItem.body"
    ></textarea>
    <div class="flex justify-end mt-2">
      <AppButton @click="addAbility('notes')">Adicionar Nota</AppButton>
    </div>
  </AppModal>

  <AppModal
    ref="newWeaponModal"
    @closed="
      () => {
        newWeaponErroMessage = ''
        newWeaponItem.name = ''
      }
    "
  >
    <label for="name" class="font-bold">Nome da arma</label>
    <AppInput type="text" name="name" id="name" v-model="newWeaponItem.name" />
    <span v-if="newWeaponErroMessage.length" class="text-red-300">
      {{ newWeaponErroMessage }}
    </span>
    <div class="flex mt-2 justify-end">
      <AppButton @click="createNewWeapon">Criar</AppButton>
    </div>
  </AppModal>
  <AppModal ref="editAbilityModal">
    <h2 class="text-center text-gray-100 font-bold my-4 text-2xl">Editar habilidade</h2>
    <label for="race_ability_title" class="text-lg font-semibold mb-1 block">
      Título da habilidade
    </label>
    <AppInput type="text" id="race_ability_title" v-model="abilityEditing.title" />
    <label for="race_ability_body" class="mt-2 text-lg font-semibold mb-1 block">
      Descrição da habilidade <span class="text-gray-400">(Opcional)</span>
    </label>
    <textarea
      id="race_ability_body"
      class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100"
      v-model="abilityEditing.body"
    ></textarea>
    <div class="flex justify-end mt-2">
      <AppButton @click="editAbility()">Editar Habilidade</AppButton>
    </div>
  </AppModal>
</template>
