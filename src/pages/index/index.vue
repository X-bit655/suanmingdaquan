<script setup lang="ts">
import { FortuneMethod } from '@/types/fortune'

const methods = [
  { key: FortuneMethod.Bazi, name: '八字命理', desc: '四柱五行、日主格局、阶段运势', mark: '字', tone: 'cinnabar', tag: '出生排盘' },
  { key: FortuneMethod.ZhouYi, name: '周易占卜', desc: '针对一个具体问题，看趋势与行动时机', mark: '易', tone: 'gold', tag: '一事一问' },
  { key: FortuneMethod.ZiWei, name: '紫微斗数', desc: '命宫身宫、星曜四化、人生主题', mark: '微', tone: 'indigo', tag: '深度命盘' },
  { key: FortuneMethod.Astrology, name: '星座命盘', desc: '太阳、月亮、上升星座的性格解读', mark: '星', tone: 'jade', tag: '西方占星' },
  { key: FortuneMethod.Tarot, name: '塔罗占卜', desc: '抽牌回应当下困惑，给出清晰建议', mark: '塔', tone: 'ochre', tag: '即时指引' },
]
const featured = methods[4]
const quickMethods = methods.filter((method) => method.key !== featured.key)

function navigate(method: string) {
  uni.navigateTo({ url: `/pages/fortune/${method}` })
}
</script>

<template>
  <PageShell>
    <view class="home">
      <view class="hero">
        <view class="hero-copy">
          <text class="eyebrow">AI Fortune Studio</text>
          <text class="hero-title">算命大全</text>
          <text class="hero-subtitle">把传统命理和 AI 解读做成清楚、好用、看得懂的移动工具。</text>
        </view>
        <view class="hero-chart" aria-hidden="true">
          <view class="chart-ring ring-a" />
          <view class="chart-ring ring-b" />
          <view class="chart-ring ring-c" />
          <text class="chart-core">命</text>
          <text class="chart-node node-a">卦</text>
          <text class="chart-node node-b">星</text>
          <text class="chart-node node-c">牌</text>
          <text class="chart-node node-d">盘</text>
        </view>
      </view>

      <view class="primary-card" @click="navigate(featured.key)">
        <view class="primary-top">
          <view :class="['method-mark', 'tone-' + featured.tone]">
            <text>{{ featured.mark }}</text>
          </view>
          <view class="primary-copy">
            <InkTag variant="gold">{{ featured.tag }}</InkTag>
            <text class="primary-title">{{ featured.name }}</text>
            <text class="primary-desc">{{ featured.desc }}</text>
          </view>
        </view>
        <view class="primary-button">
          <text>开始塔罗占卜</text>
          <text class="button-arrow">›</text>
        </view>
      </view>

      <view class="section-head">
        <view>
          <text class="section-title">全部功能</text>
          <text class="section-subtitle">选择一个入口，30 秒内开始测算。</text>
        </view>
      </view>

      <view class="method-list">
        <view v-for="method in quickMethods" :key="method.key" class="method-card" @click="navigate(method.key)">
          <view :class="['method-mark', 'tone-' + method.tone]">
            <text>{{ method.mark }}</text>
          </view>
          <view class="method-copy">
            <view class="method-head">
              <text class="method-name">{{ method.name }}</text>
              <InkTag variant="gold">{{ method.tag }}</InkTag>
            </view>
            <text class="method-desc">{{ method.desc }}</text>
            <view class="method-action">
              <text>开始测算</text>
              <text class="button-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <view class="trust-strip">
        <view class="trust-item"><text class="trust-value">5</text><text class="trust-label">种工具</text></view>
        <view class="trust-item"><text class="trust-value">AI</text><text class="trust-label">结构解读</text></view>
        <view class="trust-item"><text class="trust-value">本地</text><text class="trust-label">历史记录</text></view>
      </view>

      <view class="footer-note">
        <text>结果仅供娱乐参考，请理性看待。</text>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.home {
  padding: var(--space-4);
}
.hero {
  position: relative;
  min-height: 420rpx;
  padding: var(--space-6);
  overflow: hidden;
  border-radius: var(--radius-xl);
  background:
    linear-gradient(135deg, rgba(28, 36, 52, 0.98), rgba(10, 14, 22, 0.96)),
    radial-gradient(circle at 72% 18%, rgba(217, 174, 95, 0.28), transparent 30%);
  border: 1rpx solid rgba(217, 174, 95, 0.22);
  box-shadow: var(--shadow-ink-elevated);
}
.hero::before {
  content: '';
  position: absolute;
  inset: 22rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  border-radius: 28rpx;
}
.hero-copy {
  position: relative;
  z-index: 2;
  width: 62%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.eyebrow {
  width: fit-content;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(217, 174, 95, 0.14);
  color: var(--ink-gold-light);
  font-size: var(--font-xs);
  font-weight: 800;
}
.hero-title {
  color: #fff;
  font-size: 78rpx;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0;
}
.hero-subtitle {
  color: var(--ink-text-light);
  font-size: var(--font-sm);
  line-height: 1.75;
}
.hero-chart {
  position: absolute;
  right: -46rpx;
  top: 44rpx;
  width: 330rpx;
  height: 330rpx;
}
.chart-ring {
  position: absolute;
  border-radius: 50%;
  border: 2rpx solid rgba(217, 174, 95, 0.3);
}
.ring-a { inset: 0; }
.ring-b { inset: 54rpx; border-color: rgba(255, 255, 255, 0.12); }
.ring-c { inset: 104rpx; border-color: rgba(217, 174, 95, 0.22); }
.chart-core,
.chart-node {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: var(--font-seal);
}
.chart-core {
  left: 50%;
  top: 50%;
  width: 110rpx;
  height: 110rpx;
  margin-left: -55rpx;
  margin-top: -55rpx;
  background: linear-gradient(135deg, var(--ink-gold-light), var(--ink-gold));
  color: #16100A;
  font-size: var(--font-2xl);
  font-weight: 900;
}
.chart-node {
  width: 54rpx;
  height: 54rpx;
  background: rgba(255, 255, 255, 0.1);
  color: var(--ink-text-light);
  font-size: var(--font-xs);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}
.node-a { left: 138rpx; top: -8rpx; }
.node-b { right: 8rpx; top: 138rpx; }
.node-c { left: 138rpx; bottom: -8rpx; }
.node-d { left: 8rpx; top: 138rpx; }
.primary-card {
  margin-top: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(31, 39, 54, 0.98), rgba(20, 26, 37, 0.98));
  border: 1rpx solid rgba(217, 174, 95, 0.28);
  box-shadow: var(--shadow-ink-elevated);
}
.primary-top {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}
.method-mark {
  width: 92rpx;
  height: 92rpx;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26rpx;
  color: #fff;
  font-family: var(--font-seal);
  font-size: var(--font-xl);
  font-weight: 900;
  box-shadow: 0 14rpx 32rpx rgba(0, 0, 0, 0.26);
}
.tone-cinnabar { background: linear-gradient(135deg, var(--ink-cinnabar-light), var(--ink-cinnabar-dark)); }
.tone-gold { background: linear-gradient(135deg, var(--ink-gold-light), var(--ink-gold-dark)); color: #16100A; }
.tone-indigo { background: linear-gradient(135deg, var(--ink-indigo-light), var(--ink-indigo)); }
.tone-jade { background: linear-gradient(135deg, var(--ink-jade-light), var(--ink-jade)); color: #052017; }
.tone-ochre { background: linear-gradient(135deg, var(--ink-ochre-light), var(--ink-ochre)); color: #231204; }
.primary-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
}
.primary-title {
  font-size: var(--font-xl);
  color: #fff;
  font-weight: 900;
}
.primary-desc {
  font-size: var(--font-sm);
  color: var(--ink-text-light);
  line-height: 1.55;
}
.primary-button,
.method-action {
  height: 84rpx;
  margin-top: var(--space-4);
  padding: 0 var(--space-4);
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--ink-gold-light), var(--ink-gold));
  color: #16100A;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-sm);
  font-weight: 900;
  box-shadow: var(--shadow-gold);
}
.button-arrow {
  font-size: 44rpx;
  line-height: 1;
}
.section-head {
  margin-top: var(--space-6);
}
.section-title {
  display: block;
  font-size: var(--font-lg);
  color: #fff;
  font-weight: 900;
}
.section-subtitle {
  display: block;
  margin-top: 6rpx;
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
}
.method-list {
  margin-top: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.method-card {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: rgba(27, 35, 48, 0.92);
  border: 1rpx solid var(--ink-border);
  box-shadow: var(--shadow-ink);
  display: flex;
  gap: var(--space-3);
}
.method-card .method-mark {
  width: 78rpx;
  height: 78rpx;
  border-radius: 22rpx;
  font-size: var(--font-lg);
}
.method-copy {
  flex: 1;
  min-width: 0;
}
.method-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.method-name {
  font-size: var(--font-base);
  color: #fff;
  font-weight: 900;
}
.method-desc {
  display: block;
  margin-top: var(--space-2);
  font-size: var(--font-xs);
  color: var(--ink-text-light);
  line-height: 1.55;
}
.method-action {
  height: 68rpx;
  margin-top: var(--space-3);
  font-size: var(--font-xs);
}
.trust-strip {
  margin-top: var(--space-4);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.trust-item {
  min-height: 108rpx;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid var(--ink-border-light);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.trust-value {
  color: #fff;
  font-size: var(--font-lg);
  font-weight: 900;
}
.trust-label {
  margin-top: 4rpx;
  color: var(--ink-text-muted);
  font-size: var(--font-xs);
}
.footer-note {
  padding: var(--space-6) 0 var(--space-2);
  text-align: center;
  color: var(--ink-text-muted);
  font-size: var(--font-xs);
}
</style>
