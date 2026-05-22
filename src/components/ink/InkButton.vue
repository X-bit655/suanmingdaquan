<script setup lang="ts">
defineProps<{
  type?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['ink-btn', `btn-${type || 'primary'}`, { block, disabled, loading }]"
    :disabled="disabled || loading"
    @click="emit('click')"
  >
    <span v-if="loading" class="btn-loading" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.ink-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-2); padding: var(--space-3) var(--space-6);
  border: 2rpx solid transparent; border-radius: var(--radius-lg);
  font-family: var(--font-primary); font-size: var(--font-base);
  font-weight: 600; cursor: pointer; transition: var(--transition-ink);
  min-width: 160rpx; min-height: 88rpx;

  &.block { display: flex; width: 100%; }
  &.disabled { opacity: 0.5; pointer-events: none; }
  &.btn-primary {
    background: linear-gradient(135deg, var(--ink-cinnabar), var(--ink-cinnabar-dark));
    color: #fff; box-shadow: 0 12rpx 28rpx rgba(182, 66, 50, 0.22);
    &:active { background: var(--ink-cinnabar-dark); transform: scale(0.98); }
  }
  &.btn-secondary {
    background: rgba(255, 249, 237, 0.72); border-color: rgba(200, 166, 90, 0.72); color: var(--ink-gold-dark);
    &:active { background: rgba(224, 208, 160, 0.32); }
  }
  &.btn-ghost {
    background: transparent; color: var(--ink-text-light);
    &:active { color: var(--ink-text); }
  }
}
.btn-loading {
  width: 28rpx; height: 28rpx; border: 3rpx solid currentColor;
  border-top-color: transparent; border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
