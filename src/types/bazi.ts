import type { Gender, CalendarType } from './fortune'

export interface BaziInput {
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  gender: Gender
  calendarType: CalendarType
}

export type PillarType = 'year' | 'month' | 'day' | 'hour'

export interface Pillar {
  heavenlyStem: string
  earthlyBranch: string
  hiddenStems: string[]
  nayin: string
}

export interface TenGodRelation {
  godName: string
  pillar: PillarType
}

export interface FortuneCycle {
  startAge: number
  direction: 'forward' | 'reverse'
  cycles: CycleStep[]
}

export interface CycleStep {
  ageRange: string
  heavenlyStem: string
  earthlyBranch: string
}

export interface WuxingBalance {
  metal: number
  wood: number
  water: number
  fire: number
  earth: number
}

export interface BaziCalculatedData {
  pillars: Record<PillarType, Pillar>
  dayMaster: string
  tenGods: TenGodRelation[]
  fortuneCycles: FortuneCycle
  currentYearPillar: Pillar
  wuxingBalance: WuxingBalance
}
