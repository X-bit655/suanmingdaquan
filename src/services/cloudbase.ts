interface CloudFunctionError {
  code: number
  message: string
}

export async function callCloudFunction<T = unknown>(name: string, data: Record<string, unknown>): Promise<T> {
  try {
    const res = await uniCloud.callFunction({ name, data })
    const result = res.result as T & CloudFunctionError
    if (result?.code && result.code !== 0) {
      throw new CloudFunctionCallError(result.code, result.message || '云函数调用异常')
    }
    return res.result as T
  } catch (e: any) {
    if (e instanceof CloudFunctionCallError) throw e
    if (e.message?.includes('timeout')) {
      throw new CloudFunctionCallError(504, '云函数超时，请检查网络后重试')
    }
    throw new CloudFunctionCallError(500, e.message || '云函数调用失败')
  }
}

export class CloudFunctionCallError extends Error {
  constructor(public code: number, message: string) {
    super(message)
    this.name = 'CloudFunctionCallError'
  }
}
