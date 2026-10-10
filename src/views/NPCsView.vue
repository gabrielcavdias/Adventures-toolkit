<script lang="ts" setup>
import { reactive, ref } from 'vue'
import AppButton from '../components/AppButton.vue'
import AppModal from '../components/AppModal.vue'
import EnergyBar from '../components/EnergyBar.vue'
import type { NPC } from '../helpers/types'
import AppInput from '../components/AppInput.vue'
import { convertToSlug } from '../helpers/functions'
import { useNPCStore } from '../stores/npcs-store'
import NPCLifeControls from '../components/NPCLifeControls.vue'
import NPCManaControls from '../components/NPCManaControls.vue'

const COLORS = {
  life: '#fb2d36',
  mana: 'blue',
}

const addNPCModal = ref<InstanceType<typeof AppModal> | null>(null)
const showNPCModal = ref<InstanceType<typeof AppModal> | null>(null)

const newNPC = reactive<NPC>({
  name: '',
  info: '',
  mana: {
    current: 0,
    total: 0,
  },
  life: {
    current: 10,
    total: 10,
  },
  slug: '',
})

const errorMessage = ref('')

const npcStore = useNPCStore()

const createNPC = () => {
  if (newNPC.name == '') {
    errorMessage.value = 'Preencha um nome para o seu personagem'
    return
  }

  if (newNPC.info == '') {
    errorMessage.value = 'Prencha as informações básicas do NPC'
    return
  }

  const alreadyExists = npcStore.npcs.find((c) => c.slug === convertToSlug(newNPC.name))
  if (alreadyExists) {
    errorMessage.value = 'Já existe um personagem com esse nome'
    return
  }
  newNPC.life.current = newNPC.life.total
  newNPC.mana.current = newNPC.mana.total
  npcStore.npcs.push({ ...newNPC, slug: convertToSlug(newNPC.name) })
  addNPCModal.value?.closeModal()

  Object.assign(newNPC, {
    name: '',
    info: '',
    mana: {
      current: 0,
      total: 0,
    },
    life: {
      current: 10,
      total: 10,
    },
    slug: '',
  })
}

const showNPC = (slug: string) => {
  const foundNPC = npcStore.npcs.find((npc) => npc.slug == slug)
  if (!foundNPC) return
  npcStore.currentNPC = foundNPC
  showNPCModal.value?.openModal()
}

const deleteNPC = () => {
  if (!npcStore.currentNPC) return
  showNPCModal.value?.closeModal()
  npcStore.npcs = npcStore.npcs.filter((npc) => npc.slug !== npcStore.currentNPC?.slug)
  npcStore.currentNPC = undefined
}

const cloneNPC = (slug: string) => {
  const foundNPC = npcStore.npcs.find((npc) => npc.slug == slug)
  if (!foundNPC) return
  npcStore.currentNPC = foundNPC
  npcStore.cloneCurrentNPC()
}
</script>
<template>
  <div class="mt-4 flex justify-between px-2">
    <AppButton @click="console.log('TODO!!')" v-if="false">
      Importar <i class="fa-solid fa-file-import"></i>
    </AppButton>

    <AppButton @click="addNPCModal?.openModal()" class="ml-auto"> Adicionar NPC </AppButton>
  </div>
  <ul class="mt-5 mx-2 grid gap-2 text-gray-100">
    <li
      class="bg-neutral-800 p-4 rounded-md grid gap-2"
      v-for="npc in npcStore.npcs"
      :key="npc.slug"
      @click="showNPC(npc.slug)"
    >
      <div class="flex justify-between">
        <p class="text-lg font-bold mb-4">{{ npc.name }}</p>
        <button class="cursor-pointer" @click.stop="cloneNPC(npc.slug)">
          <i class="fa-solid fa-clone"></i>
        </button>
      </div>
      <EnergyBar :current="npc.life.current" :total="npc.life.total" :color="COLORS.life" />
      <EnergyBar
        v-if="npc.mana.total"
        class="mt-4"
        :current="npc.mana.current"
        :total="npc.mana.total"
        :color="COLORS.mana"
      />
    </li>
  </ul>
  <AppModal ref="showNPCModal" class="lg:max-w-[700px]">
    <div class="grid gap-4" v-if="npcStore.currentNPC">
      <p class="text-2xl font-bold">{{ npcStore.currentNPC.name }}</p>
      <div class="flex gap-4 lg:justify-center">
        <NPCLifeControls />
        <NPCManaControls v-if="npcStore.currentNPC.mana.total" />
      </div>
      <pre class="font-sans my-4">{{ npcStore.currentNPC.info }}</pre>
      <div class="flex justify-center">
        <button class="bg-red-500 px-4 py-2 font-bold rounded-md" @click="deleteNPC">
          Excluir NPC
        </button>
      </div>
    </div>
  </AppModal>
  <AppModal ref="addNPCModal" class="lg:max-w-[400px]">
    <div class="grid gap-6">
      <p class="italic font-bold text-red-400 underline underline-offset-8 text-center">
        {{ errorMessage }}
      </p>
      <div>
        <label for="name" class="font-bold block mb-4 text-xl">Nome</label>
        <AppInput type="text" name="name" id="name" v-model="newNPC.name" />
      </div>
      <div>
        <label for="info" class="font-bold block mb-4 text-xl">Informações</label>
        <textarea
          name="info"
          id="info"
          class="w-full rounded p-2 outline outline-gray-100 focus:outline-purple-500 text-gray-100 resize-none field-sizing-content min-h-20"
          v-model="newNPC.info"
        ></textarea>
      </div>
      <div>
        <label for="life" class="font-bold block mb-4 text-xl">Vida</label>
        <AppInput type="number" name="life" id="life" v-model="newNPC.life.total" />
      </div>
      <div>
        <label for="mana" class="font-bold block mb-4 text-xl">Mana</label>
        <AppInput type="number" name="mana" id="mana" v-model="newNPC.mana.total" />
      </div>
    </div>
    <AppButton class="mt-4" @click="createNPC">Criar NPC</AppButton>
  </AppModal>
</template>
