import { ref, onMounted } from 'vue'

export function useSafeArea() {
  const top = ref(0); const bottom = ref(0)
  onMounted(() => {
    try {
      const info = uni.getSystemInfoSync()
      if (info.safeAreaInsets) { top.value = info.safeAreaInsets.top || 0; bottom.value = info.safeAreaInsets.bottom || 0 }
      if (info.statusBarHeight) top.value = info.statusBarHeight || 0
    } catch { /* ignore */ }
  })
  return { top, bottom }
}
