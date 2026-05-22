<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>
<template>
  <PageShell>
    <InkPageHeader title="我的" subtitle="应用信息与使用说明" />
    <view class="profile-content">
      <view class="brand-card">
        <InkSeal char="命" />
        <view class="brand-copy">
          <text class="app-name">算命大全</text>
          <text class="app-version">v{{ appStore.appVersion }}</text>
        </view>
      </view>
      <view class="feature-grid">
        <view class="feature-item"><text class="feature-title">中式</text><text class="feature-desc">八字 · 周易 · 紫微</text></view>
        <view class="feature-item"><text class="feature-title">西式</text><text class="feature-desc">星盘 · 塔罗</text></view>
      </view>
      <view class="disclaimer"><text class="disc-text">本小程序仅供娱乐参考，不构成医疗、法律、金融或人生重大决策建议。请理性看待命理占卜结果。</text></view>
    </view>
  </PageShell>
</template>
<style lang="scss" scoped>
.profile-content { display: flex; flex-direction: column; padding: var(--space-4); gap: var(--space-4); }
.brand-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  background: var(--ink-night);
  box-shadow: 0 18rpx 48rpx rgba(37, 45, 53, 0.18);
}
.brand-copy { display: flex; flex-direction: column; gap: 6rpx; }
.app-name { font-family: var(--font-seal); font-size: var(--font-2xl); font-weight: 700; color: var(--ink-paper); }
.app-version { font-size: var(--font-xs); color: var(--ink-text-muted); }
.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.feature-item {
  min-height: 150rpx;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: rgba(255, 249, 237, 0.82);
  border: 1rpx solid rgba(32, 28, 24, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
}
.feature-title { font-family: var(--font-seal); font-size: var(--font-lg); font-weight: 700; color: var(--ink-text); }
.feature-desc { font-size: var(--font-xs); color: var(--ink-text-muted); line-height: 1.5; }
.disclaimer { padding: var(--space-4); background: rgba(255, 249, 237, 0.76); border: 1rpx solid rgba(182, 66, 50, 0.18); border-radius: var(--radius-lg); }
.disc-text { font-size: var(--font-xs); color: var(--ink-text-muted); text-align: left; line-height: 1.8; }
</style>
