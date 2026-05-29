import type { FortuneMethod, FortuneResult } from '@/types/fortune'
import type { CloudFunctionRequest, CloudFunctionResponse } from '@/types/api'
import { callCloudFunction, CloudFunctionCallError } from './cloudbase'

const MAX_RETRIES = 2

export async function callFortune<T>(
  method: FortuneMethod,
  input: Record<string, unknown>,
  calculatedData: Record<string, unknown>,
): Promise<FortuneResult<T>> {
  const req: CloudFunctionRequest = { method, input, calculatedData }

  let lastError: Error | null = null
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const cfRes = await callCloudFunction<CloudFunctionResponse<T>>('fortune', req as unknown as Record<string, unknown>)
      if (cfRes.code !== 0 || !cfRes.data) {
        throw new CloudFunctionCallError(cfRes.code, cfRes.message || '服务异常')
      }
      return {
        method, input,
        calculatedData: cfRes.data.calculatedData as T,
        interpretation: cfRes.data.interpretation,
        timestamp: Date.now(),
      }
    } catch (e: any) {
      lastError = e
      if (attempt < MAX_RETRIES - 1) {
        await sleep(1000 * (attempt + 1))
      }
    }
  }
  throw lastError || new Error('运势服务暂不可用')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
