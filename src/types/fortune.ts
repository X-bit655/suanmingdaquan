/** 算命方式 */
export enum FortuneMethod {
  Bazi = 'bazi',
  ZhouYi = 'zhouyi',
  ZiWei = 'ziwei',
  Astrology = 'astrology',
  Tarot = 'tarot',
}

/** 性别 */
export enum Gender {
  Male = 'male',
  Female = 'female',
}

/** 历法类型 */
export enum CalendarType {
  Solar = 'solar',
  Lunar = 'lunar',
}

/** 算命流程状态 */
export enum FortuneFlowState {
  Idle = 'idle',
  Inputting = 'inputting',
  Calculating = 'calculating',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

/** AI 解读结果 */
export interface AIInterpretation {
  summary: string
  analysis: string
  advice: string
  score: number
  tags: string[]
}

/** 统一算命结果 */
export interface FortuneResult<T = unknown> {
  method: FortuneMethod
  input: Record<string, unknown>
  calculatedData: T
  interpretation: AIInterpretation | null
  timestamp: number
}

/** 历史记录 */
export interface FortuneHistoryItem {
  id: string
  method: FortuneMethod
  timestamp: number
  summary: string
  score?: number
}
