<script setup lang="ts">
import { ref } from 'vue'
import { FortuneMethod } from '@/types/fortune'
import type { TarotInput, TarotCalculatedData, TarotSpreadType } from '@/types/tarot'
import { ALL_TAROT_CARDS as allCards } from '@/utils/tarot-data'
import { useFortune } from '@/hooks/useFortune'

const question = ref('')
const spread = ref<TarotSpreadType>('single')
const spreads: Array<{ key: TarotSpreadType; name: string; desc: string; count: string }> = [
  { key: 'single', name: '单张指引', desc: '适合快速看重点', count: '1 张' },
  { key: 'three-card', name: '三张牌阵', desc: '过去、现在、未来', count: '3 张' },
  { key: 'celtic-cross', name: '凯尔特十字', desc: '适合复杂议题', count: '10 张' },
]
const examples = ['我现在最该注意什么？', '这段关系接下来如何？', '这个选择值得继续吗？']
const { state, result, error, startFortune, reset } = useFortune<TarotInput, TarotCalculatedData>(FortuneMethod.Tarot)

function goBack() { uni.navigateBack() }
function tarotCalc(input: TarotInput): TarotCalculatedData {
  const count = input.spread === 'single' ? 1 : input.spread === 'three-card' ? 3 : 10
  const shuffled = [...allCards].sort(() => Math.random() - 0.5)
  const positions = input.spread === 'single' ? ['核心'] : input.spread === 'three-card' ? ['过去', '现在', '未来'] : Array.from({ length: 10 }, (_, i) => `位${i + 1}`)
  return { spread: input.spread, cards: shuffled.slice(0, count).map((card, i) => ({ card, isReversed: Math.random() > 0.5, position: positions[i] || `牌${i + 1}` })) }
}
function handleSubmit() { startFortune({ spread: spread.value, question: question.value }, tarotCalc) }
</script>

<template>
  <PageShell>
    <InkPageHeader title="塔罗占卜" subtitle="抽牌 · 看当下指引" showBack @back="goBack" />

    <view v-if="state !== 'success'" class="fortune-page">
      <view class="intro-panel tarot-panel">
        <text class="intro-kicker">今日牌阵</text>
        <text class="intro-title">先确认问题，再抽牌</text>
        <text class="intro-desc">问题可以很短，越贴近当下，解读越有行动感。</text>
      </view>

      <InkCard elevated>
        <text class="form-title">占卜问题</text>
        <InkInput v-model="question" placeholder="例如：这件事下一步该怎么做？" :multiline="true" />
        <view class="example-row">
          <InkTag v-for="item in examples" :key="item" @click="question = item">{{ item }}</InkTag>
        </view>

        <view class="spread-list">
          <view
            v-for="item in spreads"
            :key="item.key"
            :class="['spread-card', { active: spread === item.key }]"
            @click="spread = item.key"
          >
            <view>
              <text class="spread-name">{{ item.name }}</text>
              <text class="spread-desc">{{ item.desc }}</text>
            </view>
            <text class="spread-count">{{ item.count }}</text>
          </view>
        </view>
      </InkCard>

      <view class="action-bar">
        <InkButton block :loading="state === 'loading'" @click="handleSubmit">洗牌抽牌</InkButton>
      </view>
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
        <text class="section-title">AI 解读</text>
        <text class="interp-text">{{ result.interpretation.summary }}</text>
        <text class="interp-text">{{ result.interpretation.analysis }}</text>
        <text class="interp-text">{{ result.interpretation.advice }}</text>
      </InkCard>
      <InkButton block type="secondary" @click="reset">重新占卜</InkButton>
    </view>

    <InkLoading v-if="state === 'loading'" text="AI 正在为你解读塔罗..." />
  </PageShell>
</template>

<style lang="scss" scoped>
.fortune-page,
.result-area { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
.intro-panel { padding: var(--space-5); border-radius: var(--radius-xl); background: linear-gradient(135deg, rgba(31,39,54,0.98), rgba(80,50,31,0.96)); border: 1rpx solid rgba(217,174,95,0.26); box-shadow: var(--shadow-ink-elevated); display: flex; flex-direction: column; gap: var(--space-2); }
.intro-kicker { font-size: var(--font-xs); color: var(--ink-gold-light); font-weight: 800; }
.intro-title { font-size: var(--font-xl); font-weight: 900; color: #fff; }
.intro-desc { font-size: var(--font-sm); color: rgba(255,252,247,0.76); line-height: 1.65; }
.form-title { display: block; margin-bottom: var(--space-3); font-size: var(--font-lg); font-weight: 900; color: var(--ink-text); }
.example-row { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
.spread-list { margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.spread-card { min-height: 104rpx; padding: 0 var(--space-4); border-radius: var(--radius-lg); background: rgba(255,255,255,0.06); border: 1rpx solid var(--ink-border); display: flex; align-items: center; justify-content: space-between; }
.spread-card.active { background: linear-gradient(135deg, rgba(217,174,95,0.22), rgba(255,255,255,0.08)); color: #fff; border-color: rgba(217,174,95,0.42); box-shadow: var(--shadow-gold); }
.spread-name { display: block; font-size: var(--font-sm); font-weight: 900; }
.spread-desc { display: block; margin-top: 4rpx; font-size: var(--font-xs); color: var(--ink-text-muted); }
.spread-card.active .spread-desc { color: rgba(255,252,247,0.68); }
.spread-count { font-size: var(--font-xs); font-weight: 900; color: var(--ink-cinnabar); }
.spread-card.active .spread-count { color: var(--ink-gold-light); }
.action-bar { position: sticky; bottom: var(--space-3); z-index: 2; }
.local-note { padding: var(--space-3); border-radius: var(--radius-md); background: rgba(196,147,62,0.14); color: var(--ink-gold-dark); font-size: var(--font-xs); }
.tarot-head { display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-3); }
.tarot-mark { width: 78rpx; height: 110rpx; flex: none; border-radius: var(--radius-md); background: linear-gradient(160deg, var(--ink-night), var(--ink-indigo)); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--font-seal); font-size: var(--font-xl); box-shadow: 0 12rpx 26rpx rgba(35,40,50,0.18); }
.tarot-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6rpx; }
.card-pos { font-size: var(--font-xs); color: var(--ink-cinnabar); font-weight: 900; }
.card-name { font-size: var(--font-sm); color: var(--ink-text); display: block; font-weight: 800; }
.card-meaning { font-size: var(--font-sm); color: var(--ink-text-light); line-height: 1.7; }
.section-title { display: block; font-size: var(--font-lg); color: var(--ink-text); font-weight: 900; margin-bottom: var(--space-2); }
.interp-text { display: block; font-size: var(--font-base); color: var(--ink-text); line-height: 1.8; margin-bottom: var(--space-2); }
</style>
