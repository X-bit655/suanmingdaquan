<script setup lang="ts">
defineProps<{ variant?: string; selected?: boolean }>()
</script>
<template>
  <view :class="['ink-tag', 'tag-' + (variant || 'default'), { selected }]">
    <slot />
  </view>
</template>
<style lang="scss" scoped>
.ink-tag { display: inline-flex; align-items: center; padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm); font-size: var(--font-xs); font-family: var(--font-primary); transition: var(--transition-ink); }
.ink-tag.tag-default { background: var(--ink-surface-inset); color: var(--ink-text-light); border: 1rpx solid var(--ink-border); }
.ink-tag.tag-gold { background: transparent; color: var(--ink-gold); border: 1rpx solid var(--ink-gold); }
.ink-tag.tag-jade { background: transparent; color: var(--ink-jade); border: 1rpx solid var(--ink-jade); }
.ink-tag.selected { background: var(--ink-cinnabar); color: #fff; border-color: var(--ink-cinnabar); }
</style>