<script setup lang="ts">
defineProps<{ text?: string }>()
</script>
<template>
  <view class="ink-empty">
    <text class="empty-text">{{ text || '暂无内容' }}</text>
  </view>
</template>
<style lang="scss" scoped>
.ink-empty { display: flex; flex-direction: column; align-items: center; padding: var(--space-10) 0; }
.empty-text { color: var(--ink-text-muted); font-size: var(--font-sm); }
</style>