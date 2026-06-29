import animeCards from './animeCards'
import packOnePiece from './packOnePiece'
import packShonen from './packShonen'
import packClasicos from './packClasicos'

// Registro central de packs. Para añadir un nuevo pack:
// 1. Crea su archivo de datos en src/data/
// 2. Añade una entrada aquí
// 3. Sube imágenes y audios a public/images/ y public/audio/
export const PACKS = {
  base: {
    id: 'base',
    name: 'Juego Base',
    description: '60 openings clásicos y modernos',
    color: '#fcbe00',
    emoji: '🎵',
    cards: animeCards,
    free: true,
  },
  onepiece: {
    id: 'onepiece',
    name: 'Especial One Piece',
    description: '20 openings del Rey de los Piratas',
    color: '#e07b00',
    emoji: '🏴‍☠️',
    cards: packOnePiece,
    free: true,
  },
  shonen: {
    id: 'shonen',
    name: 'Especial Shonen',
    description: '20 openings de los grandes shonen',
    color: '#b7002b',
    emoji: '⚡',
    cards: packShonen,
    free: true,
  },
  clasicos: {
    id: 'clasicos',
    name: 'Especial Clásicos',
    description: '20 openings de los años 70, 80 y 90',
    color: '#5b8cff',
    emoji: '📺',
    cards: packClasicos,
    free: true,
  },
}

// Devuelve el array de cartas combinado para los ids de pack seleccionados.
// Ejemplo: buildCardSet(['base', 'onepiece'])
export function buildCardSet(packIds = ['base']) {
  const seen = new Set()
  return packIds
    .flatMap(id => (PACKS[id]?.cards ?? []))
    .filter(card => {
      if (seen.has(card.id)) return false
      seen.add(card.id)
      return true
    })
}
