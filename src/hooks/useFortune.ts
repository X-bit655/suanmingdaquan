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
      error.value = e.message || '测算失败'
      store.setError(error.value)
      result.value = { method, timestamp: Date.now(), input: input as any, calculatedData, interpretation: null }
      state.value = FortuneFlowState.Error
      store.setFlowState(FortuneFlowState.Error)
    }
  }
  function reset() {
    state.value = FortuneFlowState.Idle; result.value = null; error.value = null
    store.setFlowState(FortuneFlowState.Idle); store.setResult(null); store.setError(null)
  }
  return { state, result, error, startFortune, reset }
}
