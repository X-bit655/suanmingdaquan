<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { TarotInput, TarotCalculatedData, TarotSpreadType } from '@/types/tarot'
import { ALL_TAROT_CARDS as allCards } from '@/utils/tarot-data'
import { useFortune } from '@/hooks/useFortune'

const question = ref(''); const spread = ref<TarotSpreadType>('single')
const { state, result, error, startFortune, reset } = useFortune<TarotInput, TarotCalculatedData>(FortuneMethod.Tarot)
function goBack() { uni.navigateBack() }

function tarotCalc(input: TarotInput): TarotCalculatedData {
  const count = input.spread === 'single' ? 1 : input.spread === 'three-card' ? 3 : 10
  const shuffled = [...allCards].sort(() => Math.random() - 0.5)
  const positions = input.spread === 'single' ? ['核心'] : input.spread === 'three-card' ? ['过去','现在','未来'] : Array.from({length:10},(_,i)=>`位${i+1}`)
  return { spread: input.spread, cards: shuffled.slice(0, count).map((card, i) => ({ card, isReversed: Math.random() > 0.5, position: positions[i] || `牌${i+1}` })) }
}
function handleSubmit() { startFortune({ spread: spread.value, question: question.value }, tarotCalc) }
</script>
<template>
  <PageShell>
    <InkPageHeader title="塔罗占卜" subtitle="Tarot Reading" showBack @back="goBack" />
    <view v-if="state !== 'success'" class="form-area">
      <InkCard elevated>
        <text class="form-title">占卜问题</text>
        <InkInput v-model="question" placeholder="请输入想问的问题 (选填)" :multiline="true" />
        <view class="form-row">
          <InkTag :selected="spread === 'single'" @click="spread = 'single'">单张</InkTag>
          <InkTag :selected="spread === 'three-card'" @click="spread = 'three-card'">三张</InkTag>
          <InkTag :selected="spread === 'celtic-cross'" @click="spread = 'celtic-cross'">凯尔特十字</InkTag>
        </view>
      </InkCard>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">洗牌抽牌</InkButton>
    </view>
    <view v-else-if="result" class="result-area">
      <view v-if="error && !result.interpretation" class="local-note">AI 解读暂不可用，以下为本地抽牌结果。</view>
      <InkCard v-for="dc in result.calculatedData.cards" :key="dc.card.id" elevated>
        <view class="tarot-head">
          <view class="tarot-mark"><text>{{ dc.card.name.slice(0, 1) }}</text></view>
          <view class="tarot-copy">
            <text class="card-pos">{{ dc.position }}</text>
            <text class="card-name">{{ dc.card.name }} · {{ dc.card.nameEn }}</text>
          </view>
          <InkTag :variant="dc.isReversed ? 'default' : 'jade'">{{ dc.isReversed ? '逆位' : '正位' }}</InkTag>
        </view>
        <text class="card-meaning">{{ dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright }}</text>
      </InkCard>
      <InkCard elevated v-if="result.interpretation">
        <text class="section-title">AI解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新占卜</InkButton>
    </view>
    <InkLoading v-if="state === 'loading'" text="AI正在为您解读塔罗..." />
  </PageShell>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-title { display: block; margin-bottom: var(--space-3); font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-text); }
.form-row { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4); }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(200, 166, 90, 0.16); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.tarot-head { display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-3); }
.tarot-mark { width: 76rpx; height: 104rpx; flex:none; border-radius: var(--radius-md); background: var(--ink-night); color: var(--ink-paper); display:flex; align-items:center; justify-content:center; font-family: var(--font-seal); font-size: var(--font-xl); }
.tarot-copy { flex: 1; min-width: 0; display:flex; flex-direction:column; gap: 6rpx; }
.card-pos { font-family: var(--font-seal); font-size: var(--font-base); color: var(--ink-cinnabar); }
.card-name { font-family: var(--font-primary); font-size: var(--font-sm); color: var(--ink-text); display: block; }
.card-meaning { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.7; }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
