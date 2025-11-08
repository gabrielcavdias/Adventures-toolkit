<script lang="ts" setup>
import { useCharacterStore } from '../../stores/character-store'
import type { ArmorOrShield, Attribute } from '../../helpers/types'
import HeartPotion from '../Icons/HeartPotion.vue'
import AcShield from '../Icons/AcShield.vue'
import SkeletonBones from '../Icons/SkeletonBones.vue'
import { computed, ref } from 'vue'
import AppModal from '../AppModal.vue'
import AppInput from '../AppInput.vue'
import AppButton from '../AppButton.vue'
import { convertToSlug, getSizeModifier } from '../../helpers/functions'
import { SIZE_OPTIONS } from '../../helpers/constants'

const charStore = useCharacterStore()
const { modifiers } = defineProps<{ modifiers: Record<Attribute, number> }>()

const lifePointsCalc = ref(0)
const lifeModal = ref<InstanceType<typeof AppModal> | null>(null)
const acModal = ref<InstanceType<typeof AppModal> | null>(null)
const changeLifePoints = (action: 'add' | 'subtract') => {
  if (action == 'subtract') {
    subtractLife(lifePointsCalc.value)
  } else {
    addLife(lifePointsCalc.value)
  }
  lifePointsCalc.value = 0
  lifeModal.value?.closeModal()
}
const dexterityBonus = computed(() => {
  const maxDexterity = charStore.currentChar?.armor_and_shields.length
    ? Math.min(...charStore.currentChar?.armor_and_shields.map((s) => s.max_dextrity))
    : modifiers.dexterity
  return Math.min(maxDexterity, modifiers.dexterity)
})
const computedAc = computed(() => {
  if (!charStore.currentChar) return 0
  const baseValue = 10
  const shieldsAndArmor = (
    charStore.currentChar ?? { armor_and_shields: [] }
  ).armor_and_shields.reduce((acc: number, cur: ArmorOrShield) => acc + +cur.ac, 0)
  const halfLevel = Math.floor((charStore.currentChar?.level ?? 0) / 2)
  const other = charStore.currentChar?.ac_other ?? 0
  return (
    baseValue +
    shieldsAndArmor +
    halfLevel +
    dexterityBonus.value +
    getSizeModifier(charStore.currentChar.size) +
    other
  )
})
const subtractLife = (qtd: number) => {
  if (!charStore.currentChar) return
  let partialQtd = qtd
  if (charStore.currentChar.temp_lp > 0) {
    partialQtd = qtd - charStore.currentChar.temp_lp
    charStore.currentChar.temp_lp = Math.max(0, charStore.currentChar.temp_lp - qtd)
  }
  charStore.currentChar.current_lp -= partialQtd
}
const addLife = (qtd: number) => {
  if (!charStore.currentChar) return
  charStore.currentChar.current_lp = Math.min(
    charStore.currentChar.current_lp + qtd,
    charStore.currentChar.life_points,
  )
}

const exportCharacter = () => {
  if (!charStore.currentChar) return
  const data = JSON.stringify(charStore.currentChar, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = convertToSlug(charStore.currentChar.name) + '.json'
  anchor.click()
  URL.revokeObjectURL(url)
}
</script>
<template>
  <h2 class="text-gray-100 text-3xl mt-6 mx-2 text-center">{{ charStore.currentChar?.name }}</h2>

  <details
    class="group flex flex-col-reverse max-h-10 open:max-h-[300px] overflow-hidden transition-all duration-300"
  >
    <summary class="text-center text-3xl text-gray-100 h-10">
      <i class="fa-solid fa-chevron-up group-open:rotate-180 transition-all duration-300"></i>
    </summary>
    <div>
      <p class="text-gray-100 text-center text-xl">
        Nível:
        <span class="block">
          <button @click="charStore.currentChar!.level -= 1">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          {{ charStore.currentChar?.level.toString().padStart(2, '0') }}
          <button @click="charStore.currentChar!.level += 1">
            <i class="fa-solid fa-chevron-up"></i>
          </button>
        </span>
      </p>
      <ul
        class="grid grid-cols-3 items-center gap-2 text-gray-100 mx-2"
        v-if="charStore.currentChar"
      >
        <li>
          <label for="class" class="mt-2 text-lg font-semibold mb-1 block">Classe</label>
          <AppInput type="text" id="class" v-model="charStore.currentChar.class" />
        </li>
        <li>
          <label for="race" class="mt-2 text-lg font-semibold mb-1 block">Raça</label>
          <AppInput type="text" id="race" v-model="charStore.currentChar.race" />
        </li>
        <li>
          <label for="bab" class="mt-2 text-lg font-semibold mb-1 block">BBA</label>
          <AppInput type="number" id="bab" v-model="charStore.currentChar.bab" />
        </li>
        <li>
          <label for="att_hand" class="mt-2 text-lg font-semibold mb-1 block">Tamanho:</label>
          <select
            id="att_hand"
            class="outline py-2 px-4 w-full rounded-md"
            v-model="charStore.currentChar.size"
          >
            <option v-for="size in SIZE_OPTIONS" :value="size.size" :key="size.label">
              {{ size.label }}
            </option>
          </select>
        </li>
        <li>
          <label for="alignment" class="mt-2 text-lg font-semibold mb-1 block">Tendência</label>
          <AppInput type="text" id="alignment" v-model="charStore.currentChar.alignment" />
        </li>
        <li>
          <label for="alignment" class="mt-2 text-lg font-semibold mb-1 block">Pts. de ação</label>
          <AppInput type="text" id="alignment" v-model="charStore.currentChar.action_points" />
        </li>
      </ul>
      <div class="flex justify-center my-4">
        <AppButton class="inline-flex items-center gap-2" @click="exportCharacter">
          Exportar <i class="fa-solid fa-file-export"></i>
        </AppButton>
      </div>
    </div>
  </details>
  <div class="mt-4 grid grid-cols-2 gap-3 mx-2 text-2xl">
    <div
      class="relative outline py-4 text-center rounded-xl text-gray-100 font-bold text-shadow-purple text-shadow-purple-400"
      @click="lifeModal?.openModal()"
    >
      <span
        class="absolute inset-0 flex items-center justify-center z-10"
        v-if="charStore.currentChar"
      >
        <button @click.stop="subtractLife(1)">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <span
          :class="{
            'text-green-400 font-bold': charStore.currentChar.temp_lp > 0,
            'text-red-500 font-bold': charStore.currentChar.current_lp < 0,
          }"
          >{{ charStore.currentChar.current_lp + charStore.currentChar.temp_lp }}</span
        >
        / {{ charStore.currentChar?.life_points }}
        <button @click.stop="addLife(1)">
          <i class="fa-solid fa-chevron-up"></i>
        </button>
      </span>
      <Transition>
        <HeartPotion
          class="size-24 text-purple-600 mx-auto"
          v-if="
            charStore.currentChar &&
            charStore.currentChar?.current_lp >
              Math.floor(charStore.currentChar?.life_points / 2) * -1
          "
        />
        <SkeletonBones class="size-24 text-purple-600 mx-auto drop-shadow-2xl" v-else />
      </Transition>
    </div>
    <p
      class="relative outline py-4 text-center rounded-xl text-gray-100"
      @click="acModal?.openModal()"
    >
      <span class="absolute inset-0 flex items-center justify-center">
        {{ computedAc }}
      </span>
      <AcShield class="size-24 text-purple-600 mx-auto" />
    </p>
  </div>
  <AppModal ref="lifeModal" v-if="charStore.currentChar">
    <label for="temp_lp" class="text-lg font-semibold mb-1 block">Pontos de vida temporários</label>
    <AppInput type="number" id="temp_lp" v-model="charStore.currentChar.temp_lp" />
    <label for="life_points" class="mt-2 text-lg font-semibold mb-1 block"
      >Pontos de vida totais</label
    >
    <AppInput type="number" id="life_points" v-model="charStore.currentChar.life_points" />

    <div class="mt-4 outline p-2">
      <label for="calc" class="mt-2 text-lg font-semibold mb-1 block">Alterar vida</label>
      <AppInput type="number" id="calc" v-model="lifePointsCalc" />
      <div class="mt-4 flex gap-2 items-center">
        <AppButton @click="changeLifePoints('add')"> Adicionar </AppButton>
        <AppButton class="bg-red-500" @click="changeLifePoints('subtract')"> Remover </AppButton>
      </div>
    </div>
  </AppModal>
  <AppModal ref="acModal" v-if="charStore.currentChar">
    <p class="text-2xl font-bold flex items-center gap-1">
      <AcShield class="size-8 text-purple-500" />
      {{ computedAc }}
    </p>
    <p class="mt-2 font-bold">Composto por:</p>
    <ul>
      <li>Base: 10</li>
      <li v-for="defensePiece in charStore.currentChar.armor_and_shields" :key="defensePiece.name">
        {{ defensePiece.name }} : {{ defensePiece.ac }}
      </li>
      <li>Metade do nível: {{ Math.floor((charStore.currentChar?.level ?? 0) / 2) }}</li>
      <li>
        Modificador de destreza:
        {{ dexterityBonus }}
      </li>
    </ul>
    <label for="ac_other" class="mt-2 text-lg font-semibold mb-1 block">Outros modificadores</label>
    <AppInput type="number" id="ac_other" v-model="charStore.currentChar.ac_other" />
  </AppModal>
</template>
<style>
.v-enter-active,
.v-leave-active {
  position: absolute;
  transform: translateX(50%);

  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  position: absolute;
  transform: translateX(50%);
  opacity: 0;
}
details summary::marker {
  display: none;
}
details summary {
  list-style: none;
}
</style>
