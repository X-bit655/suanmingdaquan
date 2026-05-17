<script setup lang="ts">
defineProps<{ text?: string }>()
</script>
<template>
  <view class="ink-loading">
    <view class="ink-drop" />
    <text v-if="text" class="loading-text">{{ text }}</text>
  </view>
</template>
<style lang="scss" scoped>
.ink-loading { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); padding: var(--space-8) 0; }
.ink-drop { width: 60rpx; height: 60rpx; border-radius: 50%; background: var(--ink-cinnabar); animation: inkRipple 1.5s ease-in-out infinite; }
.loading-text { color: var(--ink-text-muted); font-size: var(--font-sm); }
@keyframes inkRipple { 0% { transform: scale(0.3); opacity: 0.3; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.3); opacity: 0.3; } }
</style>