import type { FortuneMethod, FortuneResult } from '@/types/fortune'
import type { CloudFunctionRequest, CloudFunctionResponse } from '@/types/api'

export async function callFortune<T>(method: FortuneMethod, input: Record<string, unknown>, calculatedData: Record<string, unknown>): Promise<FortuneResult<T>> {
  const req: CloudFunctionRequest = { method, input, calculatedData }
  const res = await uniCloud.callFunction({ name: 'fortune', data: req })
  const cfRes = res.result as CloudFunctionResponse<T>
  if (cfRes.code !== 0 || !cfRes.data) throw new Error(cfRes.message || 'service error')
  return { method, input, calculatedData: cfRes.data.calculatedData, interpretation: cfRes.data.interpretation, timestamp: Date.now() }
}
