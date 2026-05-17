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
function handleSubmit() { startFortune(input.value, calculateZiWei) }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="紫微斗数" subtitle="星命预测" showBack @back="uni.navigateBack()" />
    <view v-if="state !== 'success'" class="form-area">
      <view class="form-row"><text class="form-label">出生年</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
      <view class="form-row"><text class="form-label">出生月</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
      <view class="form-row"><text class="form-label">出生日</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
      <view class="form-row"><text class="form-label">时辰(0-23)</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
      <view class="form-row">
        <InkTag :selected="gender === 'male'" @click="gender = Gender.Male">男</InkTag>
        <InkTag :selected="gender === 'female'" @click="gender = Gender.Female">女</InkTag>
      </view>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始排盘</InkButton>
      <InkError v-if="state === 'error'" :message="error || undefined" showRetry @retry="handleSubmit" />
    </view>
    <view v-else-if="result" class="result-area">
      <InkCard elevated>
        <text class="section-title">命宫：{{ result.calculatedData.palaces[result.calculatedData.mingGong]?.name }}</text>
        <text>身宫：{{ result.calculatedData.palaces[result.calculatedData.shenGong]?.name }}</text>
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
  </PageContainer>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-row { display: flex; align-items: center; gap: var(--space-3); }
.form-label { font-size: var(--font-base); color: var(--ink-text); min-width: 120rpx; }
.form-input { flex:1; padding: var(--space-3); background: var(--ink-surface-inset); border-radius: var(--radius-md); font-size: var(--font-base); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); margin-bottom: var(--space-2); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
