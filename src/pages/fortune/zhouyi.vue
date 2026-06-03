<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { ZhouYiInput, ZhouYiCalculatedData } from '@/types/zhouyi'
import { calculateZhouYi } from '@/utils/zhouyi-calc'
import { useFortune } from '@/hooks/useFortune'

const question = ref('')
const method = ref<'coin' | 'random'>('random')
const examples = ['这件事现在推进合适吗？', '我该如何处理这段关系？', '近期工作机会如何？']
const { state, result, error, startFortune, reset } = useFortune<ZhouYiInput, ZhouYiCalculatedData>(FortuneMethod.ZhouYi)

function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune({ question: question.value, method: method.value }, calculateZhouYi) }
</script>

<template>
  <PageShell>
    <InkPageHeader title="周易占卜" subtitle="一事一问 · 快速起卦" showBack @back="goBack" />

    <view v-if="state !== 'success'" class="fortune-page">
      <view class="intro-panel">
        <text class="intro-kicker">起卦前</text>
        <text class="intro-title">把问题说具体，卦象会更好读</text>
        <text class="intro-desc">适合询问趋势、选择与行动时机，不需要输入个人资料。</text>
      </view>

      <InkCard elevated>
        <text class="form-title">你想问什么</text>
        <InkInput v-model="question" placeholder="例如：近期是否适合换工作？" :multiline="true" />
        <view class="example-row">
          <InkTag v-for="item in examples" :key="item" @click="question = item">{{ item }}</InkTag>
        </view>

        <view class="mode-card">
          <view :class="['mode-item', { active: method === 'random' }]" @click="method = 'random'">
            <text class="mode-title">快速起卦</text>
            <text class="mode-desc">立即生成卦象</text>
          </view>
          <view :class="['mode-item', { active: method === 'coin' }]" @click="method = 'coin'">
            <text class="mode-title">铜钱起卦</text>
            <text class="mode-desc">更有仪式感</text>
          </view>
        </view>
      </InkCard>

      <view class="action-bar">
        <InkButton block :loading="state === 'loading'" @click="handleSubmit">{{ method === 'coin' ? '开始摇卦' : '立即起卦' }}</InkButton>
      </view>
    </view>

    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地起卦结果。</view>
      <InkCard elevated>
        <view class="hex-header">
          <view>
            <text class="small-label">本卦</text>
            <text class="hex-name">{{ result.calculatedData.originalHexagram.name }}</text>
          </view>
          <InkTag variant="gold">六爻</InkTag>
        </view>
        <view class="hex-lines">
          <view
            v-for="l in result.calculatedData.originalHexagram.lines"
            :key="l.position"
            :class="['hex-line', l.isChanging ? 'changing' : '', l.value === 7 || l.value === 9 ? 'yang' : 'yin']"
          />
        </view>
        <text class="hex-judgment">卦辞：{{ result.calculatedData.originalHexagram.judgment }}</text>
      </InkCard>
      <view class="mini-result-grid">
        <InkCard v-if="result.calculatedData.mutualHexagram" elevated><text class="mini-label">互卦</text><text class="mini-value">{{ result.calculatedData.mutualHexagram.name }}</text></InkCard>
        <InkCard v-if="result.calculatedData.changedHexagram" elevated><text class="mini-label">变卦</text><text class="mini-value">{{ result.calculatedData.changedHexagram.name }}</text></InkCard>
      </view>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI 解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新占卜</InkButton>
    </view>

    <InkLoading v-if="state === 'loading'" text="AI 正在为你解卦..." />
  </PageShell>
</template>

<style lang="scss" scoped>
.fortune-page,
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.intro-panel { padding: var(--space-5); border-radius: var(--radius-xl); background: linear-gradient(135deg, rgba(31,39,54,0.98), rgba(20,26,37,0.96)); border: 1rpx solid var(--ink-border); box-shadow: var(--shadow-ink); display: flex; flex-direction: column; gap: var(--space-2); }
.intro-kicker { font-size: var(--font-xs); color: var(--ink-cinnabar); font-weight: 800; }
.intro-title { font-size: var(--font-xl); font-weight: 900; color: var(--ink-text); }
.intro-desc { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.65; }
.form-title { display: block; margin-bottom: var(--space-3); font-size: var(--font-lg); font-weight: 900; color: var(--ink-text); }
.example-row { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
.mode-card { margin-top: var(--space-4); padding: 8rpx; border-radius: 999rpx; background: rgba(255,255,255,0.06); border: 1rpx solid var(--ink-border); display: grid; grid-template-columns: 1fr 1fr; gap: 8rpx; }
.mode-item { min-height: 92rpx; border-radius: 999rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4rpx; color: var(--ink-text-muted); }
.mode-item.active { background: linear-gradient(135deg, var(--ink-gold-light), var(--ink-gold)); color: #16100A; box-shadow: var(--shadow-gold); }
.mode-title { font-size: var(--font-sm); font-weight: 900; }
.mode-desc { font-size: var(--font-xs); opacity: 0.72; }
.action-bar { position: sticky; bottom: var(--space-3); z-index: 2; }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(196,147,62,0.14); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.hex-header { display: flex; align-items: center; justify-content: space-between; }
.small-label, .mini-label { display: block; font-size: var(--font-xs); color: var(--ink-text-muted); }
.hex-name { display: block; margin-top: var(--space-1); font-size: var(--font-2xl); color: var(--ink-text); font-weight: 900; }
.hex-lines { display: flex; flex-direction: column-reverse; gap: var(--space-1); padding: var(--space-4) 0; }
.hex-line { height: 44rpx; display: flex; align-items: center; }
.hex-line.changing { background: rgba(180, 71, 54, 0.1); border-radius: var(--radius-sm); }
.hex-line.yang::before { content: "━━━━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-line.yin::before { content: "━━ ━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-judgment { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.7; }
.mini-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.mini-value { margin-top: var(--space-2); display: block; font-size: var(--font-lg); color: var(--ink-text); font-weight: 900; }
.section-title { display: block; font-size: var(--font-lg); color: var(--ink-text); font-weight: 900; margin-bottom: var(--space-2); }
.interp-text { display: block; font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; margin-bottom: var(--space-2); }
</style>
