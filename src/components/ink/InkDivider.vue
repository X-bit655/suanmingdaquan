<script setup lang="ts">
defineProps<{ text?: string }>()
</script>
<template>
  <view class="ink-divider">
    <view class="divider-line" />
    <text v-if="text" class="divider-text">{{ text }}</text>
    <view class="divider-line" />
  </view>
</template>
<style lang="scss" scoped>
.ink-divider {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
}
.divider-line { flex: 1; height: 2rpx; background: var(--ink-border); }
.divider-text {
  font-family: var(--font-primary); font-size: var(--font-sm);
  font-weight: 600; color: var(--ink-text-muted); white-space: nowrap;
}
</style>
