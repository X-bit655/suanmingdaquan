import type { Gender, CalendarType } from './fortune'

export interface ZiWeiInput {
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  gender: Gender
  calendarType: CalendarType
}

export type PalaceName =
  '命宫' | '兄弟' | '夫妻' | '子女' | '财帛' | '疾厄' |
  '迁移' | '交友' | '官禄' | '田宅' | '福德' | '父母'

export interface Star {
  name: string
  brightness: '庙' | '旺' | '得' | '利' | '平' | '不' | '陷'
}

export interface PalaceData {
  name: PalaceName
  earthlyBranch: string
  heavenlyStem: string
  majorStars: Star[]
  minorStars: Star[]
}

export interface SiHua {
  huaLu: PalaceName
  huaQuan: PalaceName
  huaKe: PalaceName
  huaJi: PalaceName
}

export interface ZiWeiCalculatedData {
  mingGong: number
  shenGong: number
  palaces: PalaceData[]
  siHua: SiHua
}
