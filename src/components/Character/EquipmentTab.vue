<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from '../../stores/character-store'
import AppButton from '../AppButton.vue'

const charStore = useCharacterStore()
const character = computed(() => charStore.currentChar)
const someEquipIsEmpty = computed(() =>
  character.value?.equipments.some((equip) => equip.name == ''),
)
const addEmptyEquipment = () => {
  if (someEquipIsEmpty.value) return
  character.value?.equipments.push({
    name: '',
    quantity: 0,
    weight: 0,
  })
}
const deleteEquipment = (index: number) => {
  character.value?.equipments.splice(index, 1)
}
</script>
<template>
  <h2 class="mt-4 font-bold text-center text-gray-100 text-2xl">Equipamento</h2>
  <div class="mt-4 flex justify-end px-2">
    <AppButton :disabled="someEquipIsEmpty" @click="addEmptyEquipment"
      >Adicionar equipamento</AppButton
    >
  </div>

  <p
    class="mt-2 text-2xl text-center text-red-400 underline font-bold"
    v-if="charStore.isCurCharOverEncumbered"
  >
    VOCÊ ESTÁ SOBRECARREGADO!
  </p>
  <div class="mt-4 mx-2 overflow-x-auto">
    <table class="w-full border-collapse border border-gray-200 text-sm">
      <thead class="bg-purple-600 text-gray-100 font-bold">
        <tr>
          <th class="border border-gray-200 px-2 py-1 text-left w-16">Qtd.</th>
          <th class="border border-gray-200 px-2 py-1 text-left">Nome</th>
          <th class="border border-gray-200 px-2 py-1 text-left w-20">Peso</th>
          <th>#</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(equip, index) in character?.equipments" :key="index" class="text-gray-100">
          <td class="border border-gray-200 p-0">
            <input
              type="number"
              v-model="equip.quantity"
              class="w-full px-2 py-1 focus:outline-none"
            />
          </td>

          <td class="border border-gray-200 p-0">
            <input type="text" v-model="equip.name" class="w-full px-2 py-1 focus:outline-none" />
          </td>

          <td class="border border-gray-200 p-0">
            <input
              type="number"
              v-model="equip.weight"
              class="w-full px-2 py-1 focus:outline-none"
            />
          </td>
          <td class="border border-gray-200 p-2">
            <AppButton @click="deleteEquipment(index)" size="sm">Excluir</AppButton>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="mt-1 text-gray-100 text-sm italic">
      Você fica sobrecarregado com {{ (character?.attributes.strength ?? 0) * 3 }}kg
    </p>
    <p class="mt-2 text-right font-bold text-gray-100">
      Peso Total: {{ charStore.curCharTotalCarryWeight }}kg /
      {{ (character?.attributes.strength ?? 0) * 10 }}kg
    </p>
  </div>
  <h3 class="mt-4 font-bold text-center text-gray-100 text-xl">Dinheiro</h3>

  <ul class="mt-2 grid grid-cols-4 text-gray-100 justify-items-start" v-if="character">
    <li class="flex gap-2">
      <span>T$:</span>
      <input type="number" class="pl-2 outline w-16" v-model="character.money.ts" />
    </li>
    <li class="flex gap-2">
      <span>TP:</span>
      <input type="number" class="pl-2 outline w-16" v-model="character.money.tp" />
    </li>
    <li class="flex gap-2">
      <span>TO:</span>
      <input type="number" class="pl-2 outline w-16" v-model="character.money.to" />
    </li>
    <li class="flex gap-2">
      <span>TP:</span>
      <input type="number" class="pl-2 outline w-16" v-model="character.money.tl" />
    </li>
  </ul>
</template>
