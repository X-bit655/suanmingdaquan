<script setup lang="ts">
defineProps<{
  type?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  size?: 'sm' | 'md'
}>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['ink-btn', `btn-${type || 'primary'}`, `btn-${size || 'md'}`, { block, disabled, loading }]"
    :disabled="disabled || loading"
    @click="emit('click')"
  >
    <span v-if="loading" class="btn-loading btn-spinner" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ink-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8rpx;
  border: none; border-radius: 999rpx;
  font-family: var(--font-primary); font-weight: 700;
  cursor: pointer; transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  box-shadow: none;

  &.block { display: flex; width: 100%; }
  &.loading { pointer-events: none; }
  &.disabled { opacity: 0.58; }

  &.btn-md { padding: 28rpx 48rpx; font-size: 30rpx; min-height: 96rpx; }
  &.btn-sm { padding: 18rpx 32rpx; font-size: 26rpx; min-height: 68rpx; }

  &.btn-primary {
    background: linear-gradient(135deg, #F1D79A, #D9AE5F 54%, #B77B2E);
    color: #16100A;
    box-shadow: var(--shadow-gold);
    &:active { transform: translateY(2rpx); opacity: 0.9; }
    &.loading { opacity: 0.8; }
  }
  &.btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: var(--ink-text);
    border: 1rpx solid var(--ink-border);
    &:active { background: rgba(255, 255, 255, 0.13); }
  }
  &.btn-ghost {
    background: transparent; color: var(--ink-gold-light);
    &:active { opacity: 0.6; }
  }
}
.btn-spinner {
  width: 28rpx; height: 28rpx; border: 3rpx solid rgba(22,16,10,0.26);
  border-top-color: #16100A; border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
