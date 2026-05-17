<script setup lang="ts">
import { FortuneMethod } from '@/types/fortune'
const methods = [
  { key: FortuneMethod.Bazi, name: '八字命理', desc: '四柱预测·十神分析', icon: '☯' },
  { key: FortuneMethod.ZhouYi, name: '周易占卜', desc: '六爻起卦·卦象解读', icon: '☰' },
  { key: FortuneMethod.ZiWei, name: '紫微斗数', desc: '星曜排盘·十二宫论', icon: '⭐' },
  { key: FortuneMethod.Astrology, name: '星座命盘', desc: '西方占星·行星分析', icon: '♈' },
  { key: FortuneMethod.Tarot, name: '塔罗占卜', desc: '78张牌·牌阵解读', icon: '🎴' },
]
const chineseMethods = methods.slice(0, 3)
const westernMethods = methods.slice(3)
function navigate(method: string) { uni.navigateTo({ url: `/pages/fortune/${method}` }) }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="算命大全" subtitle="中西命理·AI智能解读" />
    <InkSeal char="命" style="position:absolute;top:20rpx;right:30rpx" />
    <InkDivider text="中式命理" />
    <view class="method-grid">
      <InkCard v-for="m in chineseMethods" :key="m.key" :gold="true" padding @click="navigate(m.key)">
        <view class="method-card">
          <text class="card-icon">{{ m.icon }}</text>
          <text class="card-name">{{ m.name }}</text>
          <text class="card-desc">{{ m.desc }}</text>
        </view>
      </InkCard>
    </view>
    <InkDivider text="西式占卜" />
    <view class="method-grid">
      <InkCard v-for="m in westernMethods" :key="m.key" :gold="true" padding @click="navigate(m.key)">
        <view class="method-card">
          <text class="card-icon">{{ m.icon }}</text>
          <text class="card-name">{{ m.name }}</text>
          <text class="card-desc">{{ m.desc }}</text>
        </view>
      </InkCard>
    </view>
    <view class="footer"><text class="footer-text">AI算命 · 仅供参考 · 理性看待</text></view>
  </PageContainer>
</template>
<style lang="scss" scoped>
.method-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); padding: var(--space-4); }
.method-card { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); padding: var(--space-4) 0; cursor: pointer; }
.card-icon { font-size: var(--font-3xl); }
.card-name { font-family: var(--font-display); font-size: var(--font-lg); color: var(--ink-text); }
.card-desc { font-size: var(--font-xs); color: var(--ink-text-muted); }
.footer { padding: var(--space-6); text-align: center; }
.footer-text { font-size: var(--font-xs); color: var(--ink-text-muted); }
</style>
