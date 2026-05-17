<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { ZhouYiInput, ZhouYiCalculatedData } from '@/types/zhouyi'
import { calculateZhouYi } from '@/utils/zhouyi-calc'
import { useFortune } from '@/hooks/useFortune'

const question = ref(''); const method = ref<'coin' | 'random'>('random')
const { state, result, error, startFortune, reset } = useFortune<ZhouYiInput, ZhouYiCalculatedData>(FortuneMethod.ZhouYi)
function handleSubmit() { startFortune({ question: question.value, method: method.value }, calculateZhouYi) }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="周易占卜" subtitle="六爻预测" showBack @back="uni.navigateBack()" />
    <view v-if="state !== 'success'" class="form-area">
      <InkInput v-model="question" placeholder="请输入所占之事 (选填)" :multiline="true" />
      <view class="form-row">
        <InkTag :selected="method === 'coin'" @click="method = 'coin'">铜钱起卦</InkTag>
        <InkTag :selected="method === 'random'" @click="method = 'random'">随机起卦</InkTag>
      </view>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">{{ method === 'coin' ? '开始摇卦' : '随机起卦' }}</InkButton>
      <InkError v-if="state === 'error'" :message="error || undefined" showRetry @retry="handleSubmit" />
    </view>
    <view v-else-if="result" class="result-area">
      <InkCard elevated>
        <text class="hex-name">{{ result.calculatedData.originalHexagram.name }}</text>
        <view class="hex-lines">
          <view v-for="l in result.calculatedData.originalHexagram.lines" :key="l.position" :class="['hex-line', l.isChanging ? 'changing' : '', l.value === 7 || l.value === 9 ? 'yang' : 'yin']">
          </view>
        </view>
        <text class="hex-judgment">卦辞：{{ result.calculatedData.originalHexagram.judgment }}</text>
      </InkCard>
      <InkCard v-if="result.calculatedData.mutualHexagram" elevated><text>互卦：{{ result.calculatedData.mutualHexagram.name }}</text></InkCard>
      <InkCard v-if="result.calculatedData.changedHexagram" elevated><text>变卦：{{ result.calculatedData.changedHexagram.name }}</text></InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新占卜</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您解卦..." />
  </PageContainer>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-row { display: flex; gap: var(--space-3); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.hex-name { font-family: var(--font-display); font-size: var(--font-2xl); color: var(--ink-text); }
.hex-lines { display: flex; flex-direction: column-reverse; gap: var(--space-1); padding: var(--space-4) 0; }
.hex-line.changing { background: var(--ink-cinnabar-light); border-radius: var(--radius-sm); }
.hex-line.yang::before { content: "━━━━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-line.yin::before { content: "━━ ━━"; font-size: var(--font-2xl); color: var(--ink-text); }
.hex-judgment { font-size: var(--font-sm); color: var(--ink-text-light); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
