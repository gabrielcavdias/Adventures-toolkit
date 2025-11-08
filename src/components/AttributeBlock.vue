<script lang="ts" setup>
import type { Attribute } from '../helpers/types'
import NamedBlock from './NamedBlock.vue'

const { label, modifiers, attribute, attributes } = defineProps<{
  label: string
  modifiers: Record<Attribute, number>
  attribute: Attribute
  attributes: Record<Attribute, number>
}>()
const emit = defineEmits<{
  setValue: [value: number]
}>()
const setValue = (vl: number) => {
  if (vl < 0) return emit('setValue', 0)
  emit('setValue', vl)
}
const numberPad = (n: number) => {
  if (n >= 10) return n
  return '0' + n
}
</script>
<template>
  <NamedBlock :label="label" :value="modifiers[attribute]" tag="li">
    <button @click="setValue(attributes[attribute] - 1)">-</button>
    <span class="block text-sm">{{ numberPad(attributes[attribute]) }}</span>
    <button @click="setValue(attributes[attribute] + 1)">+</button>
  </NamedBlock>
</template>
