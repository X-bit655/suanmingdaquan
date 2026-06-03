import { ref } from 'vue'
import type { FortuneMethod, FortuneResult } from '@/types/fortune'
import { FortuneFlowState } from '@/types/fortune'
import { useFortuneStore } from '@/stores/fortune'

// 通过 globalThis 访问原生 wx，避免 uni-app 编译器重命名
const _g: any = typeof globalThis !== 'undefined' ? globalThis : Function('return this')()

export function useFortune<TInput, TCalcData>(method: FortuneMethod) {
  const store = useFortuneStore()
  const state = ref<FortuneFlowState>(FortuneFlowState.Idle)
  const result = ref<FortuneResult<TCalcData> | null>(null)
  const error = ref<string | null>(null)

  function startFortune(input: TInput, calcFn: (input: TInput) => TCalcData) {
    state.value = FortuneFlowState.Calculating
    store.setFlowState(FortuneFlowState.Calculating)
    const calculatedData = calcFn(input)
    const localResult: FortuneResult<TCalcData> = {
      method,
      input: input as any,
      calculatedData,
      interpretation: null,
      timestamp: Date.now(),
    }
    state.value = FortuneFlowState.Loading
    store.setFlowState(FortuneFlowState.Loading)

    // 纯回调模式，不依赖 async/await/regenerator/fetch
    _g.wx.cloud.callFunction({
      name: 'fortune',
      data: { method, input, calculatedData },
      success: function (res: any) {
        try {
          if (res.result.code !== 0) {
            handleError(res.result.message || '服务异常', localResult)
            return
          }
          const r: FortuneResult<TCalcData> = {
            method, input: input as any, calculatedData,
            interpretation: res.result.data?.interpretation || null,
            timestamp: Date.now(),
          }
          result.value = r; store.setResult(r as any)
          store.saveToHistory(r as any)
          state.value = FortuneFlowState.Success
          store.setFlowState(FortuneFlowState.Success)
        } catch (e: any) {
          handleError(e.message || '解析结果失败', localResult)
        }
      },
      fail: function (e: any) {
        handleError(e.errMsg || e.message || '云函数调用失败', localResult)
      },
    })
  }

  function handleError(msg: string, localResult: FortuneResult<TCalcData>) {
    console.error('[fortune] 云函数调用失败:', msg)
    uni.showToast({ title: msg.slice(0, 20), icon: 'none', duration: 3000 })
    error.value = msg
    store.setError(msg)
    result.value = localResult
    store.setResult(localResult as any)
    store.saveToHistory(localResult as any)
    state.value = FortuneFlowState.Success
    store.setFlowState(FortuneFlowState.Success)
  }

  function reset() {
    state.value = FortuneFlowState.Idle; result.value = null; error.value = null
    store.setFlowState(FortuneFlowState.Idle); store.setResult(null); store.setError(null)
  }
  return { state, result, error, startFortune, reset }
}
