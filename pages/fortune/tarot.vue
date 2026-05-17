<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { TarotInput, TarotCalculatedData, TarotSpreadType } from '@/types/tarot'
import { ALL_TAROT_CARDS as allCards } from '@/utils/tarot-data'
import { useFortune } from '@/hooks/useFortune'

const question = ref(''); const spread = ref<TarotSpreadType>('single')
const { state, result, error, startFortune, reset } = useFortune<TarotInput, TarotCalculatedData>(FortuneMethod.Tarot)

function tarotCalc(input: TarotInput): TarotCalculatedData {
  const count = input.spread === 'single' ? 1 : input.spread === 'three-card' ? 3 : 10
  const shuffled = [...allCards].sort(() => Math.random() - 0.5)
  const positions = input.spread === 'single' ? ['核心'] : input.spread === 'three-card' ? ['过去','现在','未来'] : Array.from({length:10},(_,i)=>`位${i+1}`)
  return { spread: input.spread, cards: shuffled.slice(0, count).map((card, i) => ({ card, isReversed: Math.random() > 0.5, position: positions[i] || `牌${i+1}` })) }
}
function handleSubmit() { startFortune({ spread: spread.value, question: question.value }, tarotCalc) }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="塔罗占卜" subtitle="Tarot Reading" showBack @back="uni.navigateBack()" />
    <view v-if="state !== 'success'" class="form-area">
      <InkInput v-model="question" placeholder="请输入想问的问题 (选填)" :multiline="true" />
      <view class="form-row">
        <InkTag :selected="spread === 'single'" @click="spread = 'single'">单张</InkTag>
        <InkTag :selected="spread === 'three-card'" @click="spread = 'three-card'">三张(过去/现在/未来)</InkTag>
        <InkTag :selected="spread === 'celtic-cross'" @click="spread = 'celtic-cross'">凯尔特十字</InkTag>
      </view>
      <InkButton block :loading="state === 'loading'" @click="handleSubmit">洗牌抽牌</InkButton>
      <InkError v-if="state === 'error'" :message="error || undefined" showRetry @retry="handleSubmit" />
    </view>
    <view v-else-if="result" class="result-area">
      <InkCard v-for="dc in result.calculatedData.cards" :key="dc.card.id" elevated>
        <text class="card-pos">{{ dc.position }}</text>
        <text class="card-name">{{ dc.card.name }} ({{ dc.card.nameEn }})</text>
        <InkTag :variant="dc.isReversed ? 'default' : 'jade'">{{ dc.isReversed ? '逆位' : '正位' }}</InkTag>
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
  </PageContainer>
</template>
<style lang="scss" scoped>
.form-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.form-row { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.card-pos { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-cinnabar); }
.card-name { font-family: var(--font-display); font-size: var(--font-xl); display: block; }
.card-meaning { font-size: var(--font-sm); color: var(--ink-text-light); }
.section-title { font-family: var(--font-seal); font-size: var(--font-lg); color: var(--ink-gold); }
.interp-text { font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; }
</style>
