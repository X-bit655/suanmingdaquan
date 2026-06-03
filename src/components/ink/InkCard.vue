<script setup lang="ts">
defineProps<{ elevated?: boolean; gold?: boolean; padding?: boolean }>()
</script>

<template>
  <view :class="['ink-card', { elevated, gold, pad: padding !== false }]">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.ink-card {
  background: var(--ink-surface);
  border-radius: var(--radius-lg);
  border: 1rpx solid var(--ink-border);
  overflow: hidden;
  transition: var(--transition-ink);
  backdrop-filter: blur(18rpx);

  &.pad { padding: var(--space-4); }
  &.elevated { box-shadow: var(--shadow-ink); background: var(--ink-surface-elevated); }
  &.gold {
    background:
      linear-gradient(135deg, rgba(34, 43, 58, 0.98), rgba(24, 31, 43, 0.96));
    border: 1rpx solid rgba(217, 174, 95, 0.3);
    box-shadow: 0 16rpx 46rpx rgba(0, 0, 0, 0.3);
  }
}
</style>
