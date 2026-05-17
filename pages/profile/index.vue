<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>
<template>
  <PageContainer>
    <InkPageHeader title="我的" />
    <view class="profile-content">
      <InkSeal char="命" />
      <text class="app-name">算命大全</text>
      <text class="app-version">v{{ appStore.appVersion }}</text>
      <InkDivider />
      <text class="app-desc">中西命理 · AI智能解读</text>
      <text class="app-desc">八字 | 周易 | 紫微 | 星座 | 塔罗</text>
      <view class="disclaimer"><text class="disc-text">本小程序仅供娱乐参考，不构成任何决策建议。请理性看待命理占卜结果。</text></view>
    </view>
  </PageContainer>
</template>
<style lang="scss" scoped>
.profile-content { display: flex; flex-direction: column; align-items: center; padding: var(--space-10) var(--space-5); gap: var(--space-4); }
.app-name { font-family: var(--font-display); font-size: var(--font-2xl); color: var(--ink-text); }
.app-version { font-size: var(--font-xs); color: var(--ink-text-muted); }
.app-desc { font-size: var(--font-sm); color: var(--ink-text-light); }
.disclaimer { padding: var(--space-4); background: var(--ink-surface-inset); border-radius: var(--radius-md); }
.disc-text { font-size: var(--font-xs); color: var(--ink-text-muted); text-align: center; }
</style>
