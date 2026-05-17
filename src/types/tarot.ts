export type TarotSpreadType = 'single' | 'three-card' | 'celtic-cross'

export interface TarotInput {
  spread: TarotSpreadType
  question: string
}

export interface TarotCard {
  id: number
  name: string
  nameEn: string
  arcana: 'major' | 'minor'
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles'
  number: number
  keywords: string[]
  meaningUpright: string
  meaningReversed: string
}

export interface DrawnCard {
  card: TarotCard
  isReversed: boolean
  position: string
}

export interface TarotCalculatedData {
  spread: TarotSpreadType
  cards: DrawnCard[]
}
