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
  border: 2rpx solid transparent; border-radius: var(--radius-md);
  font-family: var(--font-primary); font-size: var(--font-base);
  font-weight: 500; cursor: pointer; transition: var(--transition-ink);
  min-width: 160rpx;

  &.block { display: flex; width: 100%; }
  &.disabled { opacity: 0.5; pointer-events: none; }
  &.btn-primary {
    background: var(--ink-cinnabar); color: #fff; box-shadow: var(--shadow-gold);
    &:active { background: var(--ink-cinnabar-dark); transform: scale(0.98); }
  }
  &.btn-secondary {
    background: transparent; border-color: var(--ink-gold); color: var(--ink-gold);
    &:active { background: var(--ink-gold-light); }
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
