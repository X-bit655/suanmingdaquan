import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const visible = ref(true)
  const appVersion = '1.0.0'

  function init() { /* initialize app */ }
  function setVisible(v: boolean) { visible.value = v }

  return { visible, appVersion, init, setVisible }
})
