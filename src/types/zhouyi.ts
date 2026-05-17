export type YaoValue = 6 | 7 | 8 | 9

export interface YaoLine {
  position: number
  value: YaoValue
  isChanging: boolean
  lineText: string
}

export interface Trigram {
  name: string
  chineseName: string
  element: string
  lines: YaoValue[]
}

export interface Hexagram {
  id: number
  name: string
  upperTrigram: Trigram
  lowerTrigram: Trigram
  lines: YaoLine[]
  judgment: string
  image: string
  changingLines: number[]
}

export interface ZhouYiInput {
  question: string
  method: 'coin' | 'random'
}

export interface ZhouYiCalculatedData {
  originalHexagram: Hexagram
  mutualHexagram: Hexagram | null
  changedHexagram: Hexagram | null
  changingLineInterpretations: string[]
}
