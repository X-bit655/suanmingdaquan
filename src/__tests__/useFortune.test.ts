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
})
