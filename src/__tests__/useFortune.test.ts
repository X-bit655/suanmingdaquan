import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFortune } from '@/hooks/useFortune'
import { FortuneFlowState, FortuneMethod } from '@/types/fortune'

function mockWxCloud(result: unknown) {
  ;(globalThis as any).wx = {
    cloud: {
      callFunction: vi.fn((options: any) => {
        if (options.success) options.success({ result })
        return options
      }),
    },
  }
}

function mockWxCloudFail(errMsg: string) {
  ;(globalThis as any).wx = {
    cloud: {
      callFunction: vi.fn((options: any) => {
        if (options.fail) options.fail({ errMsg })
        return options
      }),
    },
  }
}

describe('useFortune', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    ;(globalThis as any).uni = {
      setStorageSync: vi.fn(),
      removeStorageSync: vi.fn(),
      getStorageSync: vi.fn(),
      showToast: vi.fn(),
    }
  })

  it('shows local calculated result when cloud call fails', () => {
    mockWxCloudFail('cloud unavailable')

    const { state, result, error, startFortune } = useFortune<{ seed: number }, { value: number }>(FortuneMethod.Tarot)

    startFortune({ seed: 1 }, (input) => ({ value: input.seed + 1 }))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(result.value?.calculatedData).toEqual({ value: 2 })
    expect(result.value?.interpretation).toBeNull()
    expect(error.value).toContain('cloud unavailable')
  })

  it('sets success state on cloud call with valid response', () => {
    mockWxCloud({
      code: 0,
      data: {
        calculatedData: { value: 42 },
        interpretation: { summary: '吉', analysis: '好', advice: '行', score: 88, tags: ['大吉'] },
      },
    })

    const { state, result, startFortune } = useFortune<{ q: string }, { value: number }>(FortuneMethod.ZhouYi)

    startFortune({ q: 'test' }, () => ({ value: 42 }))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(result.value?.interpretation?.summary).toBe('吉')
    expect(result.value?.interpretation?.score).toBe(88)
  })

  it('resets state to idle correctly', () => {
    mockWxCloud({
      code: 0,
      data: { calculatedData: {}, interpretation: { summary: 'ok', analysis: '', advice: '', score: 50, tags: [] } },
    })

    const { state, result, error, startFortune, reset } = useFortune<{}, {}>(FortuneMethod.Bazi)
    startFortune({}, () => ({}))
    expect(state.value).toBe(FortuneFlowState.Success)

    reset()
    expect(state.value).toBe(FortuneFlowState.Idle)
    expect(result.value).toBeNull()
    expect(error.value).toBeNull()
  })

  it('handles cloud function returning error code', () => {
    mockWxCloud({ code: 500, message: '内部错误' })

    const { state, error, startFortune } = useFortune<{}, {}>(FortuneMethod.Bazi)
    startFortune({}, () => ({}))

    expect(state.value).toBe(FortuneFlowState.Success)
    expect(error.value).toContain('内部错误')
  })
})
