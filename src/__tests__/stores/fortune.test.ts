import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFortuneStore } from '@/stores/fortune'
import { FortuneMethod, FortuneFlowState } from '@/types/fortune'
import type { FortuneResult } from '@/types/fortune'

describe('fortune store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    ;(globalThis as any).uni = {
      getStorageSync: vi.fn().mockReturnValue(null),
      setStorageSync: vi.fn(),
      removeStorageSync: vi.fn(),
    }
  })

  function makeResult(method: FortuneMethod, summary: string): FortuneResult {
    return {
      method,
      input: { test: true },
      calculatedData: { value: 1 },
      interpretation: { summary, analysis: 'test', advice: 'test', score: 80, tags: ['吉'] },
      timestamp: Date.now(),
    }
  }

  it('starts with empty history', () => {
    const store = useFortuneStore()
    expect(store.history).toEqual([])
  })

  it('saves result to history', () => {
    const store = useFortuneStore()
    const result = makeResult(FortuneMethod.Bazi, '八字测算结果')
    store.saveToHistory(result)
    expect(store.history).toHaveLength(1)
    expect(store.history[0].method).toBe(FortuneMethod.Bazi)
    expect(store.history[0].summary).toBe('八字测算结果')
    expect(store.history[0].score).toBe(80)
  })

  it('caps history at 50 items', () => {
    const store = useFortuneStore()
    for (let i = 0; i < 60; i++) {
      store.saveToHistory(makeResult(FortuneMethod.Tarot, `测算 ${i + 1}`))
    }
    expect(store.history).toHaveLength(50)
    expect(store.history[0].summary).toBe('测算 60')
  })

  it('clears all history', () => {
    const store = useFortuneStore()
    store.saveToHistory(makeResult(FortuneMethod.ZhouYi, '周易测试'))
    store.clearHistory()
    expect(store.history).toEqual([])
  })

  it('sets flow state correctly', () => {
    const store = useFortuneStore()
    store.setFlowState(FortuneFlowState.Calculating)
    expect(store.flowState).toBe(FortuneFlowState.Calculating)
    store.setFlowState(FortuneFlowState.Success)
    expect(store.flowState).toBe(FortuneFlowState.Success)
  })

  it('sets and clears error', () => {
    const store = useFortuneStore()
    store.setError('测试错误')
    expect(store.error).toBe('测试错误')
    store.setError(null)
    expect(store.error).toBeNull()
  })

  it('sets result', () => {
    const store = useFortuneStore()
    const result = makeResult(FortuneMethod.Astrology, '星座分析')
    store.setResult(result as any)
    expect(store.currentResult).not.toBeNull()
  })

  it('loads history from storage', () => {
    const stored = JSON.stringify([{
      id: 'test_1', method: 'bazi', timestamp: Date.now(),
      summary: '已存记录', score: 75,
    }])
    ;(globalThis as any).uni.getStorageSync = vi.fn().mockReturnValue(stored)
    const store = useFortuneStore()
    store.loadHistory()
    expect(store.history).toHaveLength(1)
    expect(store.history[0].summary).toBe('已存记录')
  })
})
