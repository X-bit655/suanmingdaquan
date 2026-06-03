<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gender, CalendarType, FortuneMethod } from '@/types/fortune'
import type { ZiWeiInput, ZiWeiCalculatedData } from '@/types/ziwei'
import { calculateZiWei } from '@/utils/ziwei-calc'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990)
const birthMonth = ref(1)
const birthDay = ref(1)
const birthHour = ref(0)
const gender = ref<Gender>(Gender.Male)
const calendarType = ref<CalendarType>(CalendarType.Solar)
const input = computed<ZiWeiInput>(() => ({ birthYear: birthYear.value, birthMonth: birthMonth.value, birthDay: birthDay.value, birthHour: birthHour.value, gender: gender.value, calendarType: calendarType.value }))
const { state, result, error, startFortune, reset } = useFortune<ZiWeiInput, ZiWeiCalculatedData>(FortuneMethod.ZiWei)

function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateZiWei) }
</script>

<template>
  <PageShell>
    <InkPageHeader title="紫微斗数" subtitle="十二宫 · 星曜排盘" showBack @back="goBack" />

    <view v-if="state !== 'success'" class="fortune-page">
      <view class="intro-panel ziwei-panel">
        <text class="intro-kicker">深度排盘</text>
        <text class="intro-title">从命宫、身宫看人生主题</text>
        <text class="intro-desc">适合想系统了解性格结构、关系模式和阶段重点时使用。</text>
      </view>

      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年份</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月份</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日期</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">出生小时</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>
        <view class="chip-section">
          <text class="chip-label">基础选项</text>
          <view class="tag-row">
            <InkTag :selected="calendarType === 'solar'" @click="calendarType = CalendarType.Solar">阳历</InkTag>
            <InkTag :selected="calendarType === 'lunar'" @click="calendarType = CalendarType.Lunar">阴历</InkTag>
            <InkTag :selected="gender === 'male'" @click="gender = Gender.Male">男</InkTag>
            <InkTag :selected="gender === 'female'" @click="gender = Gender.Female">女</InkTag>
          </view>
        </view>
      </InkCard>

      <view class="action-bar">
        <InkButton block :loading="state === 'loading'" @click="handleSubmit">开始排盘</InkButton>
      </view>
    </view>

    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地排盘结果。</view>
      <InkCard elevated>
        <view class="palace-row">
          <view>
            <text class="small-label">命宫</text>
            <text class="big-value">{{ result.calculatedData.palaces[result.calculatedData.mingGong]?.name }}</text>
          </view>
          <view>
            <text class="small-label">身宫</text>
            <text class="big-value">{{ result.calculatedData.palaces[result.calculatedData.shenGong]?.name }}</text>
          </view>
        </view>
      </InkCard>
      <InkCard elevated>
        <text class="section-title">四化</text>
        <view class="sihua-grid">
          <view class="sihua-item"><text>禄</text><text>{{ result.calculatedData.siHua.huaLu }}</text></view>
          <view class="sihua-item"><text>权</text><text>{{ result.calculatedData.siHua.huaQuan }}</text></view>
          <view class="sihua-item"><text>科</text><text>{{ result.calculatedData.siHua.huaKe }}</text></view>
          <view class="sihua-item"><text>忌</text><text>{{ result.calculatedData.siHua.huaJi }}</text></view>
        </view>
      </InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI 解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>

    <InkLoading v-if="state === 'loading'" text="AI 正在为你排盘解读..." />
  </PageShell>
</template>

<style lang="scss" scoped>
.fortune-page,
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.intro-panel { padding: var(--space-5); border-radius: var(--radius-xl); background: linear-gradient(135deg, rgba(31,39,54,0.98), rgba(25,30,55,0.96)); border: 1rpx solid var(--ink-border); box-shadow: var(--shadow-ink); display: flex; flex-direction: column; gap: var(--space-2); }
.intro-kicker, .chip-label { font-size: var(--font-xs); color: var(--ink-indigo); font-weight: 800; }
.intro-title { font-size: var(--font-xl); font-weight: 900; color: var(--ink-text); }
.intro-desc { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.65; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--font-xs); color: var(--ink-text-muted); font-weight: 700; }
.form-input { width: 100%; min-height: 88rpx; padding: 0 var(--space-3); background: rgba(255,255,255,0.07); border: 1rpx solid var(--ink-border); border-radius: var(--radius-md); font-size: var(--font-base); color: var(--ink-text); }
.chip-section { margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.tag-row { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.action-bar { position: sticky; bottom: var(--space-3); z-index: 2; }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(196,147,62,0.14); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.palace-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.small-label { display: block; font-size: var(--font-xs); color: var(--ink-text-muted); }
.big-value { display: block; margin-top: var(--space-2); font-size: var(--font-xl); color: var(--ink-indigo); font-weight: 900; }
.section-title { display: block; font-size: var(--font-lg); color: var(--ink-text); font-weight: 900; margin-bottom: var(--space-2); }
.sihua-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-top: var(--space-3); }
.sihua-item { min-height: 90rpx; padding: 0 var(--space-3); border-radius: var(--radius-md); background: rgba(255,255,255,0.06); border: 1rpx solid var(--ink-border-light); display: flex; align-items: center; justify-content: space-between; font-size: var(--font-sm); color: var(--ink-text); font-weight: 800; }
.interp-text { display: block; font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; margin-bottom: var(--space-2); }
</style>
