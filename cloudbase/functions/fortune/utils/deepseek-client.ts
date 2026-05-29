const DEEPSEEK_API_KEY: string = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_BASE: string = 'https://api.deepseek.com'

interface ChatCompletionRequest {
  model: string
  messages: Array<{ role: 'system' | 'user'; content: string }>
  temperature: number
  max_tokens: number
  response_format: { type: string }
}

interface ChatCompletionResponse {
  choices: Array<{ message: { content: string } }>
}

async function chatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
  const url: string = DEEPSEEK_BASE + '/v1/chat/completions'
  const body: ChatCompletionRequest = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  }
  let lastError: Error | null = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const text = await res.text()
        if (res.status === 429) { await sleep(2000 * (attempt + 1)); continue }
        throw new Error('DeepSeek error ' + res.status + ': ' + text)
      }
      const data = (await res.json()) as ChatCompletionResponse
      return data.choices[0].message.content
    } catch (e: any) { lastError = e; if (attempt < 2) continue }
  }
  throw lastError || new Error('DeepSeek API call failed')
}

function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)) }
exports.chatCompletion = chatCompletion
