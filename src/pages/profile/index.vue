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
        <view class="feature-item"><text class="feature-title">中式命理</text><text class="feature-desc">八字 · 周易 · 紫微</text></view>
        <view class="feature-item"><text class="feature-title">西式占卜</text><text class="feature-desc">星盘 · 塔罗</text></view>
      </view>

      <view class="disclaimer">
        <text class="disc-title">理性参考</text>
        <text class="disc-text">本小程序仅供娱乐参考，不构成医疗、法律、金融或人生重大决策建议。</text>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.profile-content { display: flex; flex-direction: column; padding: var(--space-4); gap: var(--space-4); }
.brand-card { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-5); border-radius: var(--radius-xl); background: linear-gradient(135deg, var(--ink-night), var(--ink-indigo)); box-shadow: var(--shadow-ink-elevated); }
.brand-copy { display: flex; flex-direction: column; gap: 6rpx; }
.app-name { font-size: var(--font-2xl); font-weight: 900; color: var(--ink-paper); }
.app-version { font-size: var(--font-xs); color: rgba(255,252,247,0.68); }
.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.feature-item { min-height: 150rpx; padding: var(--space-4); border-radius: var(--radius-lg); background: rgba(255,255,255,0.06); border: 1rpx solid var(--ink-border); box-shadow: var(--shadow-ink); display: flex; flex-direction: column; justify-content: center; gap: var(--space-2); }
.feature-title { font-size: var(--font-lg); font-weight: 900; color: var(--ink-text); }
.feature-desc { font-size: var(--font-xs); color: var(--ink-text-muted); line-height: 1.5; }
.disclaimer { padding: var(--space-4); background: rgba(255,255,255,0.06); border: 1rpx solid rgba(217,174,95,0.2); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: var(--space-2); }
.disc-title { font-size: var(--font-sm); color: var(--ink-cinnabar); font-weight: 900; }
.disc-text { font-size: var(--font-xs); color: var(--ink-text-muted); line-height: 1.8; }
</style>
