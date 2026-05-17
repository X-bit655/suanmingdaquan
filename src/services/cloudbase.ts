export async function callCloudFunction(name: string, data: Record<string, unknown>): Promise<any> {
  const res = await uniCloud.callFunction({ name, data })
  if (res.result?.code && res.result.code !== 0) throw new Error(res.result.message || 'error')
  return res.result
}
