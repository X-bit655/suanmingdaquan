const FBazi = require('./prompts/bazi')
const FZhouYi = require('./prompts/zhouyi')
const FZiWei = require('./prompts/ziwei')
const FAstrology = require('./prompts/astrology')
const FTarot = require('./prompts/tarot')
const FSystem = require('./prompts/system')
const { chatCompletion } = require('./utils/deepseek-client')
const { parseResponse } = require('./utils/response-parser')

interface CloudFunctionEvent {
  method: 'bazi' | 'zhouyi' | 'ziwei' | 'astrology' | 'tarot'
  input: Record<string, unknown>
  calculatedData: Record<string, unknown>
}

interface CloudFunctionResult {
  code: number
  message: string
  data: { calculatedData: Record<string, unknown>; interpretation: ReturnType<typeof parseResponse> } | null
}

exports.main = async (event: CloudFunctionEvent, context: unknown): Promise<CloudFunctionResult> => {
  const { method, input, calculatedData } = event
  if (!method || !calculatedData) {
    return { code: 400, message: 'Missing required params', data: null }
  }
  const systemPrompt: string = FSystem.buildSystemPrompt()
  let userPrompt: string
  switch (method) {
    case 'bazi': userPrompt = FBazi.buildBaziPrompt(input, calculatedData); break
    case 'zhouyi': userPrompt = FZhouYi.buildZhouYiPrompt(input, calculatedData); break
    case 'ziwei': userPrompt = FZiWei.buildZiWeiPrompt(input, calculatedData); break
    case 'astrology': userPrompt = FAstrology.buildAstrologyPrompt(input, calculatedData); break
    case 'tarot': userPrompt = FTarot.buildTarotPrompt(input, calculatedData); break
    default: return { code: 400, message: `Unknown method: ${method}`, data: null }
  }
  try {
    const raw: string = await chatCompletion(systemPrompt, userPrompt)
    const interpretation = parseResponse(raw)
    return { code: 0, message: 'success', data: { calculatedData, interpretation } }
  } catch (e: any) {
    console.error('Fortune cloud function error:', e.message)
    return { code: 500, message: e.message || 'AI 解读服务暂不可用，请稍后重试', data: null }
  }
}
