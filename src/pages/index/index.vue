<script setup lang="ts">
import { FortuneMethod } from '@/types/fortune'
const methods = [
  { key: FortuneMethod.Bazi, name: '八字命理', desc: '四柱预测 · 十神五行', mark: '字', tone: 'cinnabar' },
  { key: FortuneMethod.ZhouYi, name: '周易占卜', desc: '六爻起卦 · 卦象变爻', mark: '易', tone: 'gold' },
  { key: FortuneMethod.ZiWei, name: '紫微斗数', desc: '星曜排盘 · 十二宫论', mark: '微', tone: 'indigo' },
  { key: FortuneMethod.Astrology, name: '星座命盘', desc: '西方占星 · 行星宫位', mark: '星', tone: 'jade' },
  { key: FortuneMethod.Tarot, name: '塔罗占卜', desc: '牌阵抽取 · 直觉解读', mark: '塔', tone: 'ochre' },
]
const chineseMethods = methods.slice(0, 3)
const westernMethods = methods.slice(3)
function navigate(method: string) { uni.navigateTo({ url: `/pages/fortune/${method}` }) }
</script>
<template>
  <PageShell>
    <view class="home-hero">
      <view class="hero-copy">
        <text class="eyebrow">命理工具箱</text>
        <text class="hero-title">算命大全</text>
        <text class="hero-subtitle">中式命理与西方占卜，一处完成排盘、起卦与解读。</text>
      </view>
      <view class="astro-disc" aria-hidden="true">
        <view class="disc-ring ring-outer" />
        <view class="disc-ring ring-inner" />
        <text class="disc-center">命</text>
        <text class="disc-node node-1">乾</text>
        <text class="disc-node node-2">坤</text>
        <text class="disc-node node-3">星</text>
        <text class="disc-node node-4">卦</text>
      </view>
    </view>

    <view class="quick-panel">
      <view class="quick-item">
        <text class="quick-value">5</text>
        <text class="quick-label">种测算</text>
      </view>
      <view class="quick-item">
        <text class="quick-value">AI</text>
        <text class="quick-label">智能解读</text>
      </view>
      <view class="quick-item">
        <text class="quick-value">本地</text>
        <text class="quick-label">历史留存</text>
      </view>
    </view>

    <InkDivider text="中式命理" />
    <view class="method-list">
      <InkCard v-for="m in chineseMethods" :key="m.key" :gold="true" padding @click="navigate(m.key)">
        <view :class="['method-card', 'tone-' + m.tone]">
          <view class="method-mark"><text>{{ m.mark }}</text></view>
          <view class="method-copy">
            <text class="card-name">{{ m.name }}</text>
            <text class="card-desc">{{ m.desc }}</text>
          </view>
          <text class="card-arrow">›</text>
        </view>
      </InkCard>
    </view>

    <InkDivider text="西式占卜" />
    <view class="method-list">
      <InkCard v-for="m in westernMethods" :key="m.key" :gold="true" padding @click="navigate(m.key)">
        <view :class="['method-card', 'tone-' + m.tone]">
          <view class="method-mark"><text>{{ m.mark }}</text></view>
          <view class="method-copy">
            <text class="card-name">{{ m.name }}</text>
            <text class="card-desc">{{ m.desc }}</text>
          </view>
          <text class="card-arrow">›</text>
        </view>
      </InkCard>
    </view>
    <view class="footer"><text class="footer-text">结果仅供娱乐参考，请理性看待。</text></view>
  </PageShell>
</template>
<style lang="scss" scoped>
.home-hero {
  position: relative;
  margin: var(--space-4) var(--space-4) var(--space-3);
  min-height: 390rpx;
  padding: var(--space-6);
  overflow: hidden;
  border-radius: var(--radius-xl);
  background:
    linear-gradient(135deg, rgba(37, 45, 53, 0.98), rgba(47, 83, 111, 0.92) 56%, rgba(92, 127, 103, 0.9));
  box-shadow: 0 24rpx 60rpx rgba(37, 45, 53, 0.22);
}
.home-hero::before {
  content: '';
  position: absolute;
  inset: 24rpx;
  border: 1rpx solid rgba(255, 249, 237, 0.16);
  border-radius: calc(var(--radius-xl) - 6rpx);
}
.hero-copy {
  position: relative;
  z-index: 2;
  width: 58%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.eyebrow {
  width: fit-content;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 249, 237, 0.12);
  color: var(--ink-gold-light);
  font-size: var(--font-xs);
  font-weight: 600;
}
.hero-title {
  font-family: var(--font-seal);
  font-size: 64rpx;
  line-height: 1.05;
  color: var(--ink-paper);
  font-weight: 800;
}
.hero-subtitle {
  color: rgba(255, 249, 237, 0.78);
  font-size: var(--font-sm);
  line-height: 1.75;
}
.astro-disc {
  position: absolute;
  right: -34rpx;
  top: 42rpx;
  width: 310rpx;
  height: 310rpx;
  border-radius: 50%;
}
.disc-ring {
  position: absolute;
  border-radius: 50%;
  border: 2rpx solid rgba(224, 208, 160, 0.46);
}
.ring-outer { inset: 0; }
.ring-inner { inset: 58rpx; border-color: rgba(255, 249, 237, 0.24); }
.disc-center {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 108rpx;
  height: 108rpx;
  margin-left: -54rpx;
  margin-top: -54rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(182, 66, 50, 0.94);
  color: var(--ink-paper);
  font-family: var(--font-seal);
  font-size: var(--font-2xl);
}
.disc-node {
  position: absolute;
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 249, 237, 0.12);
  color: rgba(255, 249, 237, 0.84);
  font-size: var(--font-xs);
}
.node-1 { left: 130rpx; top: -6rpx; }
.node-2 { right: 12rpx; top: 132rpx; }
.node-3 { left: 130rpx; bottom: -6rpx; }
.node-4 { left: 12rpx; top: 132rpx; }
.quick-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding: 0 var(--space-4) var(--space-2);
}
.quick-item {
  min-height: 120rpx;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: rgba(255, 249, 237, 0.76);
  border: 1rpx solid rgba(32, 28, 24, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.quick-value {
  font-size: var(--font-lg);
  color: var(--ink-text);
  font-weight: 700;
}
.quick-label {
  margin-top: 4rpx;
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
}
.method-list { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-2) var(--space-4); }
.method-card { min-height: 132rpx; display: flex; align-items: center; gap: var(--space-4); cursor: pointer; }
.method-mark {
  width: 84rpx;
  height: 84rpx;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: #fff;
  font-family: var(--font-seal);
  font-size: var(--font-xl);
  font-weight: 700;
}
.tone-cinnabar .method-mark { background: var(--ink-cinnabar); }
.tone-gold .method-mark { background: var(--ink-gold-dark); }
.tone-indigo .method-mark { background: var(--ink-indigo); }
.tone-jade .method-mark { background: var(--ink-jade); }
.tone-ochre .method-mark { background: var(--ink-ochre); }
.method-copy { flex: 1; display: flex; flex-direction: column; gap: 8rpx; min-width: 0; }
.card-name { font-family: var(--font-seal); font-size: var(--font-lg); font-weight: 700; color: var(--ink-text); }
.card-desc { font-size: var(--font-xs); color: var(--ink-text-muted); }
.card-arrow { font-size: 48rpx; color: var(--ink-text-muted); }
.footer { padding: var(--space-5) var(--space-6) var(--space-8); text-align: center; }
.footer-text { font-size: var(--font-xs); color: var(--ink-text-muted); }
</style>
