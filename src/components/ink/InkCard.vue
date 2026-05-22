<script setup lang="ts">
defineProps<{ elevated?: boolean; gold?: boolean; padding?: boolean }>()
</script>
<template>
  <view :class="['ink-card', { elevated, gold, 'no-pad': padding === false }]">
    <slot />
  </view>
</template>
<style lang="scss" scoped>
.ink-card {
  position: relative;
  overflow: hidden;
  background: var(--ink-surface);
  border: 1rpx solid rgba(32, 28, 24, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-ink);
  transition: var(--transition-ink);
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 4rpx;
    background: linear-gradient(90deg, var(--ink-cinnabar), var(--ink-gold), var(--ink-jade));
    opacity: 0;
  }
  &.elevated { background: var(--ink-surface-elevated); box-shadow: var(--shadow-ink-elevated); }
  &.gold {
    border-color: rgba(200, 166, 90, 0.42);
    &::after { opacity: 1; }
  }
  &.no-pad { padding: 0; }
  &:active { transform: translateY(2rpx); }
}
</style>
