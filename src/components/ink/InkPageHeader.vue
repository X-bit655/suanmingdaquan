<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; showBack?: boolean }>()
const emit = defineEmits<{ back: [] }>()
</script>
<template>
  <view class="ink-header">
    <view v-if="showBack" class="header-back" @click="emit('back')">‹</view>
    <view class="header-titles">
      <text class="header-title">{{ title }}</text>
      <text v-if="subtitle" class="header-subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.ink-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-3);
}
.header-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 249, 237, 0.78);
  border: 1rpx solid rgba(32, 28, 24, 0.08);
  font-size: 48rpx;
  color: var(--ink-text);
  cursor: pointer;
}
.header-title {
  font-family: var(--font-seal);
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--ink-text);
  letter-spacing: 0;
}
.header-subtitle {
  margin-top: 4rpx;
  font-size: var(--font-xs);
  color: var(--ink-text-muted);
  display: block;
}
</style>
