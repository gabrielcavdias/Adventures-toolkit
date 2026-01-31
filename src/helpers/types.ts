export type Spell = {
  id: number
  title: string
  divine_level: number | null
  arcane_level: number | null
  descriptors: string[]
  origins: string[]
  range?: string
  target?: string
  duration?: string
  description?: string
}
export type Attribute =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'

export type AttackType = 'hand' | 'distance'

export type CharacterSize =
  | 'mini-small'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'huge'
  | 'extra-huge'

type Attributes = {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

type Saving = {
  fortitude_other: number
  reflex_other: number
  will_other: number
}

type Attacks = {
  hand_other: number
  distance_other: number
  hand_attribute: Attribute
  distance_attribute: Attribute
}

export type Weapon = {
  name: string
  damage: string
  critical: string
  other_bonus: number
  type: AttackType
}

export type ArmorOrShield = {
  name: string
  ac: number
  max_dextrity: number
  penality: number
  type: 'shield' | 'armor'
}

export type Equipment = {
  name: string
  weight: number
  quantity: number
}

type Money = {
  ts: number
  tp: number
  to: number
  tl: number
}

export type Skill = {
  name: string
  attribute: Attribute
  trained: boolean
  other: number
  trained_only: boolean
  affected_by_armor: boolean
}

export type Expandable = {
  title: string
  body: string
}

export type Character = {
  name: string
  slug: string
  race: string
  class: string
  level: number
  alignment: string
  age: number
  deity: string
  size: CharacterSize
  speed: string
  bab: number
  life_points: number
  current_lp: number
  temp_lp: number
  magic_ponts: number
  action_points: number
  current_mp: number
  ac_other: number
  attributes: Attributes
  saving: Saving
  attacks: Attacks
  weapons: Weapon[]
  armor_and_shields: ArmorOrShield[]
  race_abilitites: Expandable[]
  class_abilities: Expandable[]
  equipments: Equipment[]
  money: Money
  languages: string[]
  spell_ids: number[]
  notes: Expandable[]
  feats: Expandable[]
  skills: Skill[]
}
