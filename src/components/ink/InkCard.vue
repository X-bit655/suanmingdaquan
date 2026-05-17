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
  background: var(--ink-surface); border: 1rpx solid var(--ink-border);
  border-radius: var(--radius-lg); padding: var(--space-5);
  box-shadow: var(--shadow-ink); transition: var(--transition-ink);
  &.elevated { background: var(--ink-surface-elevated); box-shadow: var(--shadow-ink-elevated); }
  &.gold { border-color: var(--ink-gold); }
  &.no-pad { padding: 0; }
}
</style>