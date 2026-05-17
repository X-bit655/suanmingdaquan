<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onLaunch(() => {
  appStore.init()
})

onShow(() => {
  appStore.setVisible(true)
})

onHide(() => {
  appStore.setVisible(false)
})
</script>

<style lang="scss">
@import '@/theme/tokens.scss';

page {
  background-color: var(--ink-bg);
  color: var(--ink-text);
  font-family: var(--font-primary);
  font-size: var(--font-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
</style>
