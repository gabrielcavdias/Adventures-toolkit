import type { Attribute, CharacterSize } from './types'

/**
 * @param slug
 * @returns Font awesome component based on spell's "descritor"
 */
export function getDescritorIcon(slug: string) {
  const icons = {
    cura: 'fa-solid fa-heart',
    frio: 'fa-solid fa-snowflake',
    encantamento: 'fa-solid fa-face-grin-hearts',
    // ERRO \/
    encantamentos: 'fa-solid fa-face-grin-hearts',
    //
    adivinhação: 'fa-solid fa-magnifying-glass',
    abjuração: 'fa-solid fa-shield-halved',
    invocação: 'fa-solid fa-dragon',
    necromância: 'fa-solid fa-skull',
    terra: 'fa-solid fa-mountain-sun',
    ilusão: 'fa-solid fa-wand-magic-sparkles',
    água: 'fa-solid fa-droplet',
    sônico: 'fa-solid fa-volume-high',
    gelo: 'fa-solid fa-icicles',
    transmutação: 'fa-solid fa-star-of-david',
    ar: 'fa-solid fa-wind',
    eletricidade: 'fa-solid fa-bolt',
    fogo: 'fa-solid fa-fire-flame-curved',
    medo: 'fa-solid fa-face-flushed',
    escuridão: 'fa-solid fa-eye-slash',
    caos: 'fa-solid fa-dice',
    ordem: 'fa-solid fa-scale-balanced',
    tempo: 'fa-solid fa-clock',
    luz: 'fa-regular fa-lightbulb',
    essência: 'fa-solid fa-hand-sparkles',
    bem: 'fa-solid fa-handshake-simple',
    mal: 'fa-solid fa-hand-middle-finger',
    ácido: 'fa-solid fa-hand-holding-droplet',
    coringa: 'fa-solid fa-diamond',
  }
  return icons[slug as keyof typeof icons] == undefined
    ? 'fa-solid fa-bug text-red-500'
    : icons[slug as keyof typeof icons]
}

export function getOriginIcon(origin: string) {
  return origin == 'divina' ? 'fa-solid fa-book-bible' : 'fa-solid fa-book-tanakh'
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function convertToSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export function parseAttribute(str: Attribute) {
  return {
    strength: 'Força',
    dexterity: 'Destreza',
    constitution: 'Constituição',
    intelligence: 'Inteligência',
    wisdom: 'Sabedoria',
    charisma: 'Carisma',
  }[str]
}

export const getSizeModifier = (size: CharacterSize): number => {
  const modifier: Record<CharacterSize, number> = {
    'mini-small': 4,
    'extra-small': 2,
    small: 1,
    medium: 0,
    large: -1,
    'extra-large': -2,
    huge: -4,
    'extra-huge': -8,
  }
  return modifier[size]
}

export const getStealthModifier = (size: CharacterSize) => {
  const modifier: Record<CharacterSize, number> = {
    'mini-small': 12,
    'extra-small': 8,
    small: 4,
    medium: 0,
    large: -4,
    'extra-large': -8,
    huge: -12,
    'extra-huge': -16,
  }
  return modifier[size]
}
