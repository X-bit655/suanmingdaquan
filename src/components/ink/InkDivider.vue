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
.ink-divider { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; }
.divider-line { flex: 1; height: 1rpx; background: var(--ink-gold); }
.divider-text { font-family: var(--font-display); font-size: var(--font-sm); color: var(--ink-gold); white-space: nowrap; }
</style>