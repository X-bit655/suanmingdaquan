<script setup lang="ts">
import { onMounted } from 'vue'
import { useFortuneStore } from '@/stores/fortune'
const store = useFortuneStore()
onMounted(() => store.loadHistory())
const methodNames: Record<string,string> = { bazi:'八字', zhouyi:'周易', ziwei:'紫微', astrology:'星座', tarot:'塔罗' }
</script>
<template>
  <PageContainer>
    <InkPageHeader title="测算历史" />
    <InkEmpty v-if="!store.history.length" text="暂无测算记录" />
    <view v-else class="history-list">
      <InkCard v-for="item in store.history" :key="item.id" padding>
        <text class="hist-method">{{ methodNames[item.method] || item.method }}</text>
        <text class="hist-summary">{{ item.summary }}</text>
        <text class="hist-time">{{ new Date(item.timestamp).toLocaleDateString() }}</text>
      </InkCard>
    </view>
  </PageContainer>
</template>
<style lang="scss" scoped>
.history-list { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.hist-method { font-family: var(--font-display); font-size: var(--font-base); color: var(--ink-cinnabar); }
.hist-summary { font-size: var(--font-sm); color: var(--ink-text-light); display: block; }
.hist-time { font-size: var(--font-xs); color: var(--ink-text-muted); }
</style>
