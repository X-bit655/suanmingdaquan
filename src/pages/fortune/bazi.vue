<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gender, CalendarType, FortuneMethod } from '@/types/fortune'
import type { BaziInput, BaziCalculatedData } from '@/types/bazi'
import { calculateBazi } from '@/utils/bazi-calc'
import { getShiChenIndex } from '@/utils/ganzhi'
import { useFortune } from '@/hooks/useFortune'

const birthYear = ref(1990)
const birthMonth = ref(1)
const birthDay = ref(1)
const birthHour = ref(0)
const gender = ref<Gender>(Gender.Male)
const calendarType = ref<CalendarType>(CalendarType.Solar)
const input = computed<BaziInput>(() => ({
  birthYear: birthYear.value,
  birthMonth: birthMonth.value,
  birthDay: birthDay.value,
  birthHour: birthHour.value,
  gender: gender.value,
  calendarType: calendarType.value,
}))
const { state, result, error, startFortune, reset } = useFortune<BaziInput, BaziCalculatedData>(FortuneMethod.Bazi)
const SHI_CHEN = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时']
const hourPresets = [0, 6, 9, 12, 15, 18, 21]
const shiChenIdx = computed(() => getShiChenIndex(birthHour.value))

function goBack() { uni.navigateBack() }
function handleSubmit() { startFortune(input.value, calculateBazi) }
</script>

<template>
  <PageShell>
    <InkPageHeader title="八字命理" subtitle="四柱五行 · AI 解读" showBack @back="goBack" />

    <view v-if="state !== 'success'" class="fortune-page">
      <view class="intro-panel">
        <text class="intro-kicker">出生信息</text>
        <text class="intro-title">排出四柱，看你的五行气质</text>
        <text class="intro-desc">年份、月份、日期和出生小时即可开始，时辰不确定可以先选接近的时间。</text>
      </view>

      <InkCard elevated>
        <view class="form-grid">
          <view class="field"><text class="form-label">出生年份</text><input class="form-input" v-model.number="birthYear" type="number" /></view>
          <view class="field"><text class="form-label">出生月份</text><input class="form-input" v-model.number="birthMonth" type="number" /></view>
          <view class="field"><text class="form-label">出生日期</text><input class="form-input" v-model.number="birthDay" type="number" /></view>
          <view class="field"><text class="form-label">出生小时</text><input class="form-input" v-model.number="birthHour" type="number" /></view>
        </view>

        <view class="hint-card">
          <text class="hint-value">{{ SHI_CHEN[shiChenIdx] }}</text>
          <text class="hint-label">{{ birthHour }} 时左右</text>
        </view>

        <view class="chip-section">
          <text class="chip-label">快捷时段</text>
          <view class="tag-row">
            <InkTag v-for="hour in hourPresets" :key="hour" :selected="birthHour === hour" @click="birthHour = hour">{{ hour }}时</InkTag>
          </view>
        </view>

        <view class="chip-section">
          <text class="chip-label">历法与性别</text>
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
      <view class="pillar-grid">
        <InkCard elevated v-for="(p, key) in result.calculatedData.pillars" :key="key">
          <text class="pillar-title">{{ { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' }[key] }}</text>
          <text class="pillar-ganzhi">{{ p.heavenlyStem }}{{ p.earthlyBranch }}</text>
          <text class="pillar-hidden">藏干 {{ p.hiddenStems.join(' ') }}</text>
        </InkCard>
      </view>
      <InkCard elevated>
        <text class="section-title">日主</text>
        <text class="result-text">{{ result.calculatedData.dayMaster }}</text>
      </InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI 解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
        <view v-if="result.interpretation.tags.length" class="tag-row">
          <InkTag v-for="t in result.interpretation.tags" :key="t" variant="gold">{{ t }}</InkTag>
        </view>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新测算</InkButton>
    </view>

    <InkLoading v-if="state === 'loading'" text="AI 正在为你解读..." />
  </PageShell>
</template>

<style lang="scss" scoped>
.fortune-page,
.result-area {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.intro-panel {
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(31, 39, 54, 0.98), rgba(20, 26, 37, 0.96));
  border: 1rpx solid var(--ink-border);
  box-shadow: var(--shadow-ink);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.intro-kicker,
.chip-label {
  font-size: var(--font-xs);
  color: var(--ink-cinnabar);
  font-weight: 800;
}
.intro-title {
  font-size: var(--font-xl);
  font-weight: 900;
  color: var(--ink-text);
}
.intro-desc {
  font-size: var(--font-sm);
  color: var(--ink-text-light);
  line-height: 1.65;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.form-label {
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
  font-weight: 700;
}
.form-input {
  width: 100%;
  min-height: 88rpx;
  padding: 0 var(--space-3);
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid var(--ink-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  color: var(--ink-text);
}
.hint-card {
  margin-top: var(--space-4);
  min-height: 96rpx;
  padding: 0 var(--space-4);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(217, 174, 95, 0.18), rgba(255, 255, 255, 0.06));
  border: 1rpx solid rgba(217, 174, 95, 0.24);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hint-value {
  color: var(--ink-gold-light);
  font-size: var(--font-lg);
  font-weight: 900;
}
.hint-label {
  color: var(--ink-text-muted);
  font-size: var(--font-sm);
}
.chip-section {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.tag-row {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.action-bar {
  position: sticky;
  bottom: var(--space-3);
  z-index: 2;
}
.local-note {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: rgba(196, 147, 62, 0.14);
  color: var(--ink-gold-dark);
  font-size: var(--font-xs);
}
.pillar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.pillar-title {
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
}
.pillar-ganzhi {
  display: block;
  margin-top: var(--space-2);
  font-family: var(--font-seal);
  font-size: var(--font-xl);
  color: var(--ink-cinnabar);
}
.pillar-hidden {
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
  display: block;
  margin-top: var(--space-2);
}
.section-title {
  display: block;
  font-size: var(--font-lg);
  color: var(--ink-text);
  font-weight: 900;
  margin-bottom: var(--space-2);
}
.result-text {
  font-size: var(--font-xl);
  color: var(--ink-cinnabar);
  font-weight: 900;
}
.interp-text {
  display: block;
  font-size: var(--font-base);
  color: var(--ink-text);
  line-height: 1.8;
  margin-bottom: var(--space-2);
}
</style>
