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
  background-image:
    linear-gradient(90deg, rgba(32, 28, 24, 0.025) 1rpx, transparent 1rpx),
    linear-gradient(0deg, rgba(32, 28, 24, 0.018) 1rpx, transparent 1rpx);
  background-size: 36rpx 36rpx;
  color: var(--ink-text);
  font-family: var(--font-primary);
  font-size: var(--font-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}
</style>
