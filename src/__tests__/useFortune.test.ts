import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFortune } from '@/hooks/useFortune'
import { FortuneFlowState, FortuneMethod } from '@/types/fortune'

describe('useFortune', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    ;(globalThis as any).uni = {
      setStorageSync: vi.fn(),
      removeStorageSync: vi.fn(),
      getStorageSync: vi.fn(),
    }
    ;(globalThis as any).uniCloud = {
      callFunction: vi.fn().mockRejectedValue(new Error('cloud unavailable')),
    }
  })

  it('shows local calculated result when cloud interpretation fails', async () => {
    const { state, result, error, startFortune } = useFortune<{ seed: number }, { value: number }>(FortuneMethod.Tarot)

    await startFortune({ seed: 1 }, input => ({ value: input.seed + 1 }))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(result.value?.calculatedData).toEqual({ value: 2 })
    expect(result.value?.interpretation).toBeNull()
    expect(error.value).toContain('cloud unavailable')
  })

  it('sets success state on cloud call with valid response', async () => {
    ;(globalThis as any).uniCloud.callFunction = vi.fn().mockResolvedValue({
      result: {
        code: 0,
        data: {
          calculatedData: { value: 42 },
          interpretation: { summary: '吉', analysis: '好', advice: '行', score: 88, tags: ['大吉'] },
        },
      },
    })

    const { state, result, startFortune } = useFortune<{ q: string }, { value: number }>(FortuneMethod.ZhouYi)

    await startFortune({ q: 'test' }, () => ({ value: 42 }))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(result.value?.interpretation?.summary).toBe('吉')
    expect(result.value?.interpretation?.score).toBe(88)
  })

  it('resets state to idle correctly', async () => {
    ;(globalThis as any).uniCloud.callFunction = vi.fn().mockResolvedValue({
      result: { code: 0, data: { calculatedData: {}, interpretation: { summary: 'ok', analysis: '', advice: '', score: 50, tags: [] } } },
    })

    const { state, result, error, startFortune, reset } = useFortune<{}, {}>(FortuneMethod.Bazi)
    await startFortune({}, () => ({}))
    expect(state.value).toBe(FortuneFlowState.Success)

    reset()
    expect(state.value).toBe(FortuneFlowState.Idle)
    expect(result.value).toBeNull()
    expect(error.value).toBeNull()
  })

  it('handles cloud function returning error code', async () => {
    ;(globalThis as any).uniCloud.callFunction = vi.fn().mockResolvedValue({
      result: { code: 500, message: '内部错误' },
    })

    const { state, error, startFortune } = useFortune<{}, {}>(FortuneMethod.Bazi)
    await startFortune({}, () => ({}))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(error.value).toContain('内部错误')
  })
})
