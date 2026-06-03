<script setup lang="ts">
import { onMounted } from 'vue'
import { useFortuneStore } from '@/stores/fortune'

const store = useFortuneStore()
const methodNames: Record<string, string> = { bazi: '八字', zhouyi: '周易', ziwei: '紫微', astrology: '星座', tarot: '塔罗' }

onMounted(() => store.loadHistory())
</script>

<template>
  <PageShell>
    <InkPageHeader title="测算历史" subtitle="回看每一次排盘与解读" />
    <view class="history-summary">
      <text class="summary-value">{{ store.history.length }}</text>
      <text class="summary-label">已保存记录</text>
    </view>
    <InkEmpty v-if="!store.history.length" text="暂无测算记录" />
    <view v-else class="history-list">
      <InkCard v-for="item in store.history" :key="item.id" padding elevated>
        <view class="hist-card">
          <view class="hist-mark"><text>{{ (methodNames[item.method] || item.method).slice(0, 1) }}</text></view>
          <view class="hist-copy">
            <view class="hist-top">
              <text class="hist-method">{{ methodNames[item.method] || item.method }}</text>
              <text class="hist-time">{{ new Date(item.timestamp).toLocaleDateString() }}</text>
            </view>
            <text class="hist-summary">{{ item.summary }}</text>
          </view>
        </view>
      </InkCard>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.history-summary {
  margin: var(--space-3) var(--space-4) 0;
  min-height: 150rpx;
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  background: var(--ink-night);
  box-shadow: var(--shadow-ink-elevated);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.summary-value { color: #fff; font-size: var(--font-3xl); font-weight: 900; }
.summary-label { color: rgba(255,252,247,0.72); font-size: var(--font-sm); }
.history-list { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.hist-card { display: flex; gap: var(--space-3); align-items: flex-start; }
.hist-mark { width: 72rpx; height: 72rpx; flex: none; border-radius: 22rpx; background: var(--ink-indigo); color: var(--ink-paper); display: flex; align-items: center; justify-content: center; font-family: var(--font-seal); font-size: var(--font-lg); box-shadow: 0 10rpx 24rpx rgba(68,91,141,0.18); }
.hist-copy { flex: 1; display: flex; flex-direction: column; gap: 8rpx; min-width: 0; }
.hist-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.hist-method { font-size: var(--font-base); font-weight: 900; color: var(--ink-text); }
.hist-summary { font-size: var(--font-sm); color: var(--ink-text-light); display: block; line-height: 1.6; }
.hist-time { flex: none; font-size: var(--font-xs); color: var(--ink-text-muted); }
</style>
