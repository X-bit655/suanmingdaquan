<script setup lang="ts">
import { ref, computed } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { AstrologyInput, AstrologyCalculatedData } from '@/types/astrology'
import { calculateAstrology } from '@/utils/astrology-calc'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990); const birthMonth = ref(1); const birthDay = ref(1)
const birthHour = ref(12); const birthMinute = ref(0); const city = ref('北京')
const input = computed<AstrologyInput>(() => ({ birthYear: birthYear.value, birthMonth: birthMonth.value, birthDay: birthDay.value, birthHour: birthHour.value, birthMinute: birthMinute.value, city: city.value }))
const { state, result, error, startFortune, reset } = useFortune<AstrologyInput, AstrologyCalculatedData>(FortuneMethod.Astrology)
function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateAstrology) }
</script>
<template>
  <PageShell>
    <InkPageHeader title="星座命盘" subtitle="西方占星" showBack @back="goBack" />
    <view v-if="state !== 'success'" class="form-area">
      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">出生时</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>
        <view class="field city-field"><text class="form-label">城市</text><input class="form-input" v-model="city" placeholder="出生城市" /></view>
      </InkCard>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始测算</InkButton>
    </view>
    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地星盘结果。</view>
      <InkCard elevated>
        <text class="section-title">三大星座</text>
        <view class="sign-grid">
          <view class="sign-item"><text class="sign-label">太阳</text><text class="sign-value">{{ result.calculatedData.sunSign }}</text></view>
          <view class="sign-item"><text class="sign-label">月亮</text><text class="sign-value">{{ result.calculatedData.moonSign }}</text></view>
          <view class="sign-item"><text class="sign-label">上升</text><text class="sign-value">{{ result.calculatedData.risingSign }}</text></view>
        </view>
      </InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您解读星盘..." />
  </PageShell>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.city-field { margin-top: var(--space-3); }
.form-label { font-size: var(--font-xs); color: var(--ink-text-muted); }
.form-input { width: 100%; min-height: 82rpx; padding: 0 var(--space-3); background: var(--ink-surface-inset); border-radius: var(--radius-md); font-size: var(--font-base); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(200, 166, 90, 0.16); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); margin-bottom: var(--space-2); }
.sign-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); margin-top: var(--space-3); }
.sign-item { padding: var(--space-3); border-radius: var(--radius-md); background: var(--ink-surface-inset); display: flex; flex-direction: column; align-items: center; gap: var(--space-1); }
.sign-label { font-size: var(--font-xs); color: var(--ink-text-muted); }
.sign-value { font-family: var(--font-seal); font-size: var(--font-base); color: var(--ink-text); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
