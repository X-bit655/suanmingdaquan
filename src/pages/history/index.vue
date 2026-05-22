<script setup lang="ts">
import { onMounted } from 'vue'
import { useFortuneStore } from '@/stores/fortune'
const store = useFortuneStore()
onMounted(() => store.loadHistory())
const methodNames: Record<string,string> = { bazi:'八字', zhouyi:'周易', ziwei:'紫微', astrology:'星座', tarot:'塔罗' }
</script>
<template>
  <PageShell>
    <view class="history-hero">
      <InkPageHeader title="测算历史" subtitle="回看每一次排盘与解读" />
    </view>
    <InkEmpty v-if="!store.history.length" text="暂无测算记录" />
    <view v-else class="history-list">
      <InkCard v-for="item in store.history" :key="item.id" padding>
        <view class="hist-card">
          <view class="hist-mark"><text>{{ (methodNames[item.method] || item.method).slice(0, 1) }}</text></view>
          <view class="hist-copy">
            <text class="hist-method">{{ methodNames[item.method] || item.method }}</text>
            <text class="hist-summary">{{ item.summary }}</text>
            <text class="hist-time">{{ new Date(item.timestamp).toLocaleDateString() }}</text>
          </view>
        </view>
      </InkCard>
    </view>
  </PageShell>
</template>
<style lang="scss" scoped>
.history-hero { padding-top: var(--space-2); }
.history-list { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.hist-card { display: flex; gap: var(--space-3); align-items: flex-start; }
.hist-mark {
  width: 68rpx;
  height: 68rpx;
  flex: none;
  border-radius: var(--radius-md);
  background: var(--ink-indigo);
  color: var(--ink-paper);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-seal);
  font-size: var(--font-lg);
}
.hist-copy { flex: 1; display: flex; flex-direction: column; gap: 6rpx; min-width: 0; }
.hist-method { font-family: var(--font-seal); font-size: var(--font-base); font-weight: 700; color: var(--ink-text); }
.hist-summary { font-size: var(--font-sm); color: var(--ink-text-light); display: block; line-height: 1.6; }
.hist-time { font-size: var(--font-xs); color: var(--ink-text-muted); }
</style>
