<script setup lang="ts">
defineProps<{ label: string; value: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:value': [value: string]; click: [] }>()
</script>
<template>
  <view class="ink-picker" @click="emit('click')">
    <text class="picker-label">{{ label }}</text>
    <view class="picker-value">
      <text :class="{ placeholder: !value }">{{ value || placeholder || '请选择' }}</text>
      <text class="picker-arrow">&#x203A;</text>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.ink-picker { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4) var(--space-5); background: var(--ink-surface); border: 1rpx solid var(--ink-border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition-ink); }
.ink-picker:active { border-color: var(--ink-gold); }
.picker-label { font-family: var(--font-primary); font-size: var(--font-base); color: var(--ink-text); }
.picker-value { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-base); }
.picker-value .placeholder { color: var(--ink-text-muted); }
.picker-arrow { font-size: var(--font-lg); color: var(--ink-text-muted); }
</style>