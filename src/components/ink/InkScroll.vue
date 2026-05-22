<script setup lang="ts">
</script>
<template>
  <view class="ink-scroll">
    <view class="scroll-top" />
    <view class="scroll-content"><slot /></view>
    <view class="scroll-bottom" />
  </view>
</template>
<style lang="scss" scoped>
.ink-scroll { background: var(--ink-surface); border: 1rpx solid var(--ink-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-ink); }
.scroll-top, .scroll-bottom { height: 16rpx; background: linear-gradient(90deg, transparent, var(--ink-gold-light), transparent); }
.scroll-content { padding: var(--space-4); }
</style>