<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gender, CalendarType, FortuneMethod } from '@/types/fortune'
import type { BaziInput, BaziCalculatedData } from '@/types/bazi'
import { calculateBazi } from '@/utils/bazi-calc'
import { getShiChenIndex } from '@/utils/ganzhi'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990); const birthMonth = ref(1); const birthDay = ref(1)
const birthHour = ref(0); const gender = ref<Gender>(Gender.Male)
const calendarType = ref<CalendarType>(CalendarType.Solar)
const input = computed<BaziInput>(() => ({ birthYear: birthYear.value, birthMonth: birthMonth.value, birthDay: birthDay.value, birthHour: birthHour.value, gender: gender.value, calendarType: calendarType.value }))
const { state, result, error, startFortune, reset } = useFortune<BaziInput, BaziCalculatedData>(FortuneMethod.Bazi)
function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateBazi) }
const SHI_CHEN = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时']
const shiChenIdx = computed(() => getShiChenIndex(birthHour.value))
</script>
<template>
  <PageShell>
    <InkPageHeader title="八字命理" subtitle="四柱预测" showBack @back="goBack" />
    <view v-if="state !== 'success'" class="form-area">
      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年份</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月份</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日期</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">出生时辰</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>
        <view class="hint-line">{{ SHI_CHEN[shiChenIdx] }} · {{ birthHour }}时</view>
        <view class="tag-row">
          <InkTag :selected="calendarType === 'solar'" @click="calendarType = CalendarType.Solar">阳历</InkTag>
          <InkTag :selected="calendarType === 'lunar'" @click="calendarType = CalendarType.Lunar">阴历</InkTag>
          <InkTag :selected="gender === 'male'" @click="gender = Gender.Male">男</InkTag>
          <InkTag :selected="gender === 'female'" @click="gender = Gender.Female">女</InkTag>
        </view>
      </InkCard>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始测算</InkButton>
    </view>
    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地排盘结果。</view>
      <view class="pillar-grid">
        <InkCard elevated v-for="(p, key) in result.calculatedData.pillars" :key="key">
          <text class="pillar-title">{{ {year:'年柱',month:'月柱',day:'日柱',hour:'时柱'}[key] }}</text>
          <text class="pillar-ganzhi">{{ p.heavenlyStem }}{{ p.earthlyBranch }}</text>
          <text class="pillar-hidden">藏干 {{ p.hiddenStems.join(' ') }}</text>
        </InkCard>
      </view>
      <InkCard elevated><text class="section-title">日主</text><text class="result-text">{{ result.calculatedData.dayMaster }}</text></InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
        <view v-if="result.interpretation.tags.length" class="tag-row">
          <InkTag v-for="t in result.interpretation.tags" :key="t" variant="gold">{{ t }}</InkTag>
        </view>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您解读..." />
  </PageShell>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--font-xs); color: var(--ink-text-muted); }
.form-input { width: 100%; min-height: 82rpx; padding: 0 var(--space-3); background: var(--ink-surface-inset); border-radius: var(--radius-md); font-size: var(--font-base); color: var(--ink-text); }
.hint-line { margin-top: var(--space-3); font-size: var(--font-sm); color: var(--ink-text-light); }
.tag-row { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-4); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(200, 166, 90, 0.16); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.pillar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.pillar-title { font-size: var(--font-xs); color: var(--ink-text-muted); }
.pillar-ganzhi { font-family: var(--font-display); font-size: var(--font-xl); color: var(--ink-cinnabar); }
.pillar-hidden { font-size: var(--font-xs); color: var(--ink-text-muted); display: block; margin-top: var(--space-2); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); margin-bottom: var(--space-2); }
.result-text { font-size: var(--font-xl); color: var(--ink-text); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; margin-bottom: var(--space-2); }
</style>
