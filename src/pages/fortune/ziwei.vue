<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gender, CalendarType, FortuneMethod } from '@/types/fortune'
import type { ZiWeiInput, ZiWeiCalculatedData } from '@/types/ziwei'
import { calculateZiWei } from '@/utils/ziwei-calc'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990); const birthMonth = ref(1); const birthDay = ref(1); const birthHour = ref(0)
const gender = ref<Gender>(Gender.Male); const calendarType = ref<CalendarType>(CalendarType.Solar)
const input = computed<ZiWeiInput>(() => ({ birthYear: birthYear.value, birthMonth: birthMonth.value, birthDay: birthDay.value, birthHour: birthHour.value, gender: gender.value, calendarType: calendarType.value }))
const { state, result, error, startFortune, reset } = useFortune<ZiWeiInput, ZiWeiCalculatedData>(FortuneMethod.ZiWei)
function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateZiWei) }
</script>
<template>
  <PageShell>
    <InkPageHeader title="紫微斗数" subtitle="星命预测" showBack @back="goBack" />
    <view v-if="state !== 'success'" class="form-area">
      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">时辰</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>
        <view class="form-row">
          <InkTag :selected="gender === 'male'" @click="gender = Gender.Male">男</InkTag>
          <InkTag :selected="gender === 'female'" @click="gender = Gender.Female">女</InkTag>
        </view>
      </InkCard>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始排盘</InkButton>
    </view>
    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地排盘结果。</view>
      <InkCard elevated>
        <text class="section-title">命宫：{{ result.calculatedData.palaces[result.calculatedData.mingGong]?.name }}</text>
        <text class="result-text">身宫：{{ result.calculatedData.palaces[result.calculatedData.shenGong]?.name }}</text>
      </InkCard>
      <InkCard elevated>
        <text class="section-title">四化</text>
        <text>禄：{{ result.calculatedData.siHua.huaLu }} | 权：{{ result.calculatedData.siHua.huaQuan }}</text>
        <text>科：{{ result.calculatedData.siHua.huaKe }} | 忌：{{ result.calculatedData.siHua.huaJi }}</text>
      </InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您排盘解读..." />
  </PageShell>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.form-row { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-4); }
.form-label { font-size: var(--font-xs); color: var(--ink-text-muted); }
.form-input { width:100%; min-height:82rpx; padding: 0 var(--space-3); background: var(--ink-surface-inset); border-radius: var(--radius-md); font-size: var(--font-base); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(200, 166, 90, 0.16); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); margin-bottom: var(--space-2); }
.result-text { display: block; font-size: var(--font-base); color: var(--ink-text); margin-top: var(--space-2); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
