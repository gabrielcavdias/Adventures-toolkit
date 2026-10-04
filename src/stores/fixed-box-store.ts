import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFixedBoxStore = defineStore('fixed-box', () => {
  const html = ref<string>()
  return { html }
})
