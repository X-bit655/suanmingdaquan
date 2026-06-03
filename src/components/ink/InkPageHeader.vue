<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; showBack?: boolean }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <view class="ink-header">
    <view v-if="showBack" class="header-back" @click="emit('back')">
      <text class="back-arrow">‹</text>
    </view>
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
  padding: var(--space-5) var(--space-4) var(--space-2);
}
.header-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid var(--ink-border);
  box-shadow: var(--shadow-ink);
  cursor: pointer;
}
.back-arrow {
  margin-top: -4rpx;
  font-size: 52rpx;
  line-height: 1;
  color: var(--ink-gold-light);
  font-weight: 500;
}
.header-titles {
  min-width: 0;
}
.header-title {
  font-family: var(--font-display);
  font-size: var(--font-2xl);
  font-weight: 800;
  color: var(--ink-text);
  letter-spacing: 0;
}
.header-subtitle {
  margin-top: 2rpx;
  font-size: var(--font-sm);
  color: var(--ink-text-muted);
  display: block;
}
</style>
