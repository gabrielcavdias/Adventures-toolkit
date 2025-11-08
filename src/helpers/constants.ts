import type { Attribute, CharacterSize } from './types'

export const ATT_OPTIONS: { label: string; attribute: Attribute }[] = [
  { label: 'Força', attribute: 'strength' },
  {
    label: 'Destreza',
    attribute: 'dexterity',
  },
  {
    label: 'Constituição',
    attribute: 'constitution',
  },
  {
    label: 'Inteligência',
    attribute: 'intelligence',
  },
  {
    label: 'Sabedoria',
    attribute: 'wisdom',
  },
  {
    label: 'Carisma',
    attribute: 'charisma',
  },
]

export const SIZE_OPTIONS: { label: string; size: CharacterSize }[] = [
  {
    label: 'Diminuto',
    size: 'mini-small',
  },
  {
    label: 'Mínimo',
    size: 'extra-small',
  },
  {
    label: 'Pequeno',
    size: 'small',
  },
  {
    label: 'Médio',
    size: 'medium',
  },
  {
    label: 'Grande',
    size: 'large',
  },
  {
    label: 'Enorme',
    size: 'extra-large',
  },
  {
    label: 'Descomunal',
    size: 'huge',
  },
  {
    label: 'Colossal',
    size: 'extra-huge',
  },
]

export const ARMOR_TYPE_MAP = {
  shield: 'Escudo',
  armor: 'Armadura',
}
