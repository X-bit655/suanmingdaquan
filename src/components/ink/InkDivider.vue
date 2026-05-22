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
.ink-divider { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4) var(--space-5) var(--space-2); }
.divider-line { flex: 1; height: 1rpx; background: linear-gradient(90deg, transparent, rgba(154, 123, 58, 0.55), transparent); }
.divider-text { font-family: var(--font-primary); font-size: var(--font-xs); font-weight: 600; color: var(--ink-gold-dark); white-space: nowrap; }
</style>
