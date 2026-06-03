<script setup lang="ts">
import { ref, computed } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { AstrologyInput, AstrologyCalculatedData } from '@/types/astrology'
import { calculateAstrology } from '@/utils/astrology-calc'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990)
const birthMonth = ref(1)
const birthDay = ref(1)
const birthHour = ref(12)
const birthMinute = ref(0)
const city = ref('北京')
const cities = ['北京', '上海', '广州', '深圳', '成都']
const input = computed<AstrologyInput>(() => ({ birthYear: birthYear.value, birthMonth: birthMonth.value, birthDay: birthDay.value, birthHour: birthHour.value, birthMinute: birthMinute.value, city: city.value }))
const { state, result, error, startFortune, reset } = useFortune<AstrologyInput, AstrologyCalculatedData>(FortuneMethod.Astrology)

function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateAstrology) }
</script>

<template>
  <PageShell>
    <InkPageHeader title="星座命盘" subtitle="太阳 · 月亮 · 上升" showBack @back="goBack" />

    <view v-if="state !== 'success'" class="fortune-page">
      <view class="intro-panel astrology-panel">
        <text class="intro-kicker">西方占星</text>
        <text class="intro-title">快速生成你的三大星座</text>
        <text class="intro-desc">出生城市用于辅助估算上升星座，先填常住或出生城市即可。</text>
      </view>

      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年份</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月份</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日期</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">出生小时</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>
        <view class="form-grid time-grid">
          <view class="field"><text class="form-label">分钟</text><input class="form-input" v-model.number="birthMinute" type="number" /></view>
          <view class="field"><text class="form-label">城市</text><input class="form-input" v-model="city" placeholder="出生城市" /></view>
        </view>
        <view class="chip-section">
          <text class="chip-label">常用城市</text>
          <view class="tag-row">
            <InkTag v-for="item in cities" :key="item" :selected="city === item" @click="city = item">{{ item }}</InkTag>
          </view>
        </view>
      </InkCard>

      <view class="action-bar">
        <InkButton block :loading="state === 'loading'" @click="handleSubmit">查看星盘</InkButton>
      </view>
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
        <text class="section-title">AI 解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>

    <InkLoading v-if="state === 'loading'" text="AI 正在为你解读星盘..." />
  </PageShell>
</template>

<style lang="scss" scoped>
.fortune-page,
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.intro-panel { padding: var(--space-5); border-radius: var(--radius-xl); background: linear-gradient(135deg, rgba(31,39,54,0.98), rgba(19,47,39,0.96)); border: 1rpx solid var(--ink-border); box-shadow: var(--shadow-ink); display: flex; flex-direction: column; gap: var(--space-2); }
.intro-kicker, .chip-label { font-size: var(--font-xs); color: var(--ink-jade); font-weight: 800; }
.intro-title { font-size: var(--font-xl); font-weight: 900; color: var(--ink-text); }
.intro-desc { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.65; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.time-grid { margin-top: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--font-xs); color: var(--ink-text-muted); font-weight: 700; }
.form-input { width: 100%; min-height: 88rpx; padding: 0 var(--space-3); background: rgba(255,255,255,0.07); border: 1rpx solid var(--ink-border); border-radius: var(--radius-md); font-size: var(--font-base); color: var(--ink-text); }
.chip-section { margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.tag-row { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.action-bar { position: sticky; bottom: var(--space-3); z-index: 2; }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(196,147,62,0.14); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.section-title { display: block; font-size: var(--font-lg); color: var(--ink-text); font-weight: 900; margin-bottom: var(--space-2); }
.sign-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); margin-top: var(--space-3); }
.sign-item { min-height: 124rpx; padding: var(--space-3); border-radius: var(--radius-md); background: rgba(255,255,255,0.06); border: 1rpx solid var(--ink-border-light); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-1); }
.sign-label { font-size: var(--font-xs); color: var(--ink-text-muted); }
.sign-value { font-size: var(--font-base); color: var(--ink-jade); font-weight: 900; text-align: center; }
.interp-text { display: block; font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; margin-bottom: var(--space-2); }
</style>
