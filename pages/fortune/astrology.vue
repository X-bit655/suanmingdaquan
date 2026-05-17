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
function handleSubmit() { startFortune(input.value, calculateAstrology) }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="星座命盘" subtitle="西方占星" showBack @back="uni.navigateBack()" />
    <view v-if="state !== 'success'" class="form-area">
      <view class="form-row"><text class="form-label">出生年</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
      <view class="form-row"><text class="form-label">出生月</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
      <view class="form-row"><text class="form-label">出生日</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
      <view class="form-row"><text class="form-label">时:分</text><input class="form-input short" v-model.number="birthHour" type="number" /><text>:</text><input class="form-input short" v-model.number="birthMinute" type="number" /></view>
      <view class="form-row"><text class="form-label">城市</text><input class="form-input" v-model="city" placeholder="出生城市" /></view>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始测算</InkButton>
      <InkError v-if="state === 'error'" :message="error || undefined" showRetry @retry="handleSubmit" />
    </view>
    <view v-else-if="result" class="result-area">
      <InkCard elevated>
        <text class="section-title">三大星座</text>
        <text>太阳：{{ result.calculatedData.sunSign }}</text>
        <text>月亮：{{ result.calculatedData.moonSign }}</text>
        <text>上升：{{ result.calculatedData.risingSign }}</text>
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
  </PageContainer>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-row { display: flex; align-items: center; gap: var(--space-3); }
.form-label { font-size: var(--font-base); color: var(--ink-text); min-width: 120rpx; }
.form-input { flex:1; padding: var(--space-3); background: var(--ink-surface-inset); border-radius: var(--radius-md); font-size: var(--font-base); }
.form-input.short { flex:0; width: 80rpx; }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); margin-bottom: var(--space-2); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
