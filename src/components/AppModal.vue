<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import AppButton from './AppButton.vue'

const dialogRef = useTemplateRef<HTMLDialogElement>('dialogRef')
const isOpen = ref(false)
const emit = defineEmits(['opened', 'closed'])
const openModal = () => {
  dialogRef.value?.showModal()
  isOpen.value = true
  emit('opened')
}
const closeModal = () => {
  dialogRef.value?.close()
  isOpen.value = false
  emit('closed')
}
defineExpose({
  openModal,
  closeModal,
})
</script>
<template>
  <dialog
    ref="dialogRef"
    class="w-full mx-auto my-auto backdrop:bg-purple-900/50 focus:outline-0 bg-gray-800 rounded-md text-gray-100 p-3"
  >
    <div class="flex justify-end my-2">
      <AppButton @click="closeModal">X</AppButton>
    </div>
    <slot></slot>
  </dialog>
</template>
<style scoped>
dialog::backdrop {
  backdrop-filter: blur(5px);
}
</style>
