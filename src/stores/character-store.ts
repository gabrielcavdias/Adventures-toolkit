import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Character } from '../helpers/types'
import { ref } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  const characters = useLocalStorage<Character[]>('characters', [])
  const currentChar = ref<Character>()

  return { characters, currentChar }
})
