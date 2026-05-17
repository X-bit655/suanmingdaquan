import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FortuneMethod, FortuneResult, FortuneFlowState, FortuneHistoryItem } from '@/types/fortune'

export const useFortuneStore = defineStore('fortune', () => {
  const currentMethod = ref<FortuneMethod | null>(null)
  const flowState = ref<FortuneFlowState>('idle' as FortuneFlowState)
  const currentResult = ref<FortuneResult | null>(null)
  const error = ref<string | null>(null)
  const history = ref<FortuneHistoryItem[]>([])

  function loadHistory() {
    try {
      const stored = uni.getStorageSync('fortune_history')
      if (stored) history.value = JSON.parse(stored)
    } catch { /* ignore */ }
  }

  function saveToHistory(result: FortuneResult) {
    const item: FortuneHistoryItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      method: result.method, timestamp: result.timestamp,
      summary: result.interpretation?.summary || '无摘要',
      score: result.interpretation?.score,
    }
    history.value.unshift(item)
    if (history.value.length > 50) history.value = history.value.slice(0, 50)
    uni.setStorageSync('fortune_history', JSON.stringify(history.value))
  }

  function clearHistory() {
    history.value = []
    uni.removeStorageSync('fortune_history')
  }

  function setFlowState(state: FortuneFlowState) { flowState.value = state }
  function setResult(result: FortuneResult | null) { currentResult.value = result }
  function setError(msg: string | null) { error.value = msg }

  return { currentMethod, flowState, currentResult, error, history,
    loadHistory, saveToHistory, clearHistory, setFlowState, setResult, setError }
})
