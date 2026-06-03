const FBazi = require('./prompts/bazi')
const FZhouYi = require('./prompts/zhouyi')
const FZiWei = require('./prompts/ziwei')
const FAstrology = require('./prompts/astrology')
const FTarot = require('./prompts/tarot')
const FSystem = require('./prompts/system')
const { chatCompletion } = require('./utils/deepseek-client')
const { parseResponse } = require('./utils/response-parser')

exports.main = async (event, context) => {
  const { method, input, calculatedData } = event
  if (!method || !calculatedData) {
    return { code: 400, message: 'Missing required params', data: null }
  }
  const systemPrompt = FSystem.buildSystemPrompt()
  let userPrompt
  switch (method) {
    case 'bazi': userPrompt = FBazi.buildBaziPrompt(input, calculatedData); break
    case 'zhouyi': userPrompt = FZhouYi.buildZhouYiPrompt(input, calculatedData); break
    case 'ziwei': userPrompt = FZiWei.buildZiWeiPrompt(input, calculatedData); break
    case 'astrology': userPrompt = FAstrology.buildAstrologyPrompt(input, calculatedData); break
    case 'tarot': userPrompt = FTarot.buildTarotPrompt(input, calculatedData); break
    default: return { code: 400, message: 'Unknown method: ' + method, data: null }
  }
  try {
    const raw = await chatCompletion(systemPrompt, userPrompt)
    const interpretation = parseResponse(raw)
    return { code: 0, message: 'success', data: { calculatedData, interpretation } }
  } catch (e) {
    console.error('Fortune cloud function error:', e.message)
    return { code: 500, message: e.message || 'AI 解读服务暂不可用，请稍后重试', data: null }
  }
}
