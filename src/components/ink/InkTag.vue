<script setup lang="ts">
defineProps<{ variant?: string; selected?: boolean }>()
</script>
<template>
  <view :class="['ink-tag', 'tag-' + (variant || 'default'), { selected }]">
    <slot />
  </view>
</template>
<style lang="scss" scoped>
.ink-tag {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 56rpx;
  padding: 0 var(--space-3);
  border-radius: 999rpx; font-size: var(--font-xs); font-weight: 700;
  font-family: var(--font-primary); transition: var(--transition-ink);
  border: 1rpx solid transparent;
}
.ink-tag.tag-default { background: rgba(255, 255, 255, 0.08); color: var(--ink-text-light); border-color: var(--ink-border); }
.ink-tag.tag-gold { background: rgba(217, 174, 95, 0.14); color: var(--ink-gold-light); border-color: rgba(217, 174, 95, 0.2); }
.ink-tag.tag-jade { background: rgba(95, 201, 163, 0.12); color: var(--ink-jade-light); }
.ink-tag.selected { background: linear-gradient(135deg, var(--ink-gold-light), var(--ink-gold)); color: #16100A; border-color: transparent; box-shadow: var(--shadow-gold); }
</style>
