import type { FortuneMethod, AIInterpretation } from './fortune'

export interface CloudFunctionRequest {
  method: FortuneMethod
  input: Record<string, unknown>
  calculatedData: Record<string, unknown>
}

export interface CloudFunctionResponse<T = unknown> {
  code: number
  message: string
  data: {
    calculatedData: T
    interpretation: AIInterpretation
  } | null
}
