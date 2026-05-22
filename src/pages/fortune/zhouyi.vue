<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { ZhouYiInput, ZhouYiCalculatedData } from '@/types/zhouyi'
import { calculateZhouYi } from '@/utils/zhouyi-calc'
import { useFortune } from '@/hooks/useFortune'

const question = ref(''); const method = ref<'coin' | 'random'>('random')
const { state, result, error, startFortune, reset } = useFortune<ZhouYiInput, ZhouYiCalculatedData>(FortuneMethod.ZhouYi)
function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune({ question: question.value, method: method.value }, calculateZhouYi) }
</script>
<template>
  <PageShell>
    <InkPageHeader title="周易占卜" subtitle="六爻预测" showBack @back="goBack" />
    <view v-if="state !== 'success'" class="form-area">
      <InkCard elevated>
        <text class="form-title">起卦问题</text>
        <InkInput v-model="question" placeholder="请输入所占之事 (选填)" :multiline="true" />
        <view class="form-row">
          <InkTag :selected="method === 'coin'" @click="method = 'coin'">铜钱起卦</InkTag>
          <InkTag :selected="method === 'random'" @click="method = 'random'">随机起卦</InkTag>
        </view>
      </InkCard>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">{{ method === 'coin' ? '开始摇卦' : '随机起卦' }}</InkButton>
    </view>
    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地起卦结果。</view>
      <InkCard elevated>
        <text class="hex-name">{{ result.calculatedData.originalHexagram.name }}</text>
        <view class="hex-lines">
          <view v-for="l in result.calculatedData.originalHexagram.lines" :key="l.position" :class="['hex-line', l.isChanging ? 'changing' : '', l.value === 7 || l.value === 9 ? 'yang' : 'yin']">
          </view>
        </view>
        <text class="hex-judgment">卦辞：{{ result.calculatedData.originalHexagram.judgment }}</text>
      </InkCard>
      <view class="mini-result-grid">
        <InkCard v-if="result.calculatedData.mutualHexagram" elevated><text class="mini-label">互卦</text><text class="mini-value">{{ result.calculatedData.mutualHexagram.name }}</text></InkCard>
        <InkCard v-if="result.calculatedData.changedHexagram" elevated><text class="mini-label">变卦</text><text class="mini-value">{{ result.calculatedData.changedHexagram.name }}</text></InkCard>
      </view>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新占卜</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您解卦..." />
  </PageShell>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-title { display: block; margin-bottom: var(--space-3); font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-text); }
.form-row { display: flex; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap; }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(200, 166, 90, 0.16); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.hex-name { font-family: var(--font-display); font-size: var(--font-2xl); color: var(--ink-text); }
.hex-lines { display: flex; flex-direction: column-reverse; gap: var(--space-1); padding: var(--space-4) 0; }
.hex-line.changing { background: var(--ink-cinnabar-light); border-radius: var(--radius-sm); }
.hex-line.yang::before { content: "━━━━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-line.yin::before { content: "━━ ━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-judgment { font-size: var(--font-sm); color: var(--ink-text-light); }
.mini-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.mini-label { font-size: var(--font-xs); color: var(--ink-text-muted); display: block; }
.mini-value { margin-top: var(--space-2); display: block; font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-text); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
