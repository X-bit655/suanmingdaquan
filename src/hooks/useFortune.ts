import { ref } from 'vue'
import type { FortuneMethod, FortuneResult } from '@/types/fortune'
import { FortuneFlowState } from '@/types/fortune'
import { useFortuneStore } from '@/stores/fortune'

export function useFortune<TInput, TCalcData>(method: FortuneMethod) {
  const store = useFortuneStore()
  const state = ref<FortuneFlowState>(FortuneFlowState.Idle)
  const result = ref<FortuneResult<TCalcData> | null>(null)
  const error = ref<string | null>(null)

  async function startFortune(input: TInput, calcFn: (input: TInput) => TCalcData) {
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
    try {
      const res = await uniCloud.callFunction({
        name: 'fortune',
        data: { method, input, calculatedData },
      })
      if (res.result.code !== 0) throw new Error(res.result.message || '服务异常')
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
      error.value = e.message || 'AI 解读暂不可用，已展示本地测算结果'
      store.setError(error.value)
      result.value = localResult
      store.setResult(localResult as any)
      store.saveToHistory(localResult as any)
      state.value = FortuneFlowState.Success
      store.setFlowState(FortuneFlowState.Success)
    }
  }
  function reset() {
    state.value = FortuneFlowState.Idle; result.value = null; error.value = null
    store.setFlowState(FortuneFlowState.Idle); store.setResult(null); store.setError(null)
  }
  return { state, result, error, startFortune, reset }
}
