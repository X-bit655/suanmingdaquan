<script setup lang="ts">
defineProps<{ char?: string }>()
</script>
<template>
  <view class="ink-seal">
    <text class="seal-char">{{ char || '命' }}</text>
  </view>
</template>
<style lang="scss" scoped>
.ink-seal { display: inline-flex; align-items: center; justify-content: center; width: 72rpx; height: 72rpx; border: 4rpx solid var(--ink-cinnabar); border-radius: var(--radius-seal); background: var(--ink-cinnabar); opacity: 0.85; }
.seal-char { font-family: var(--font-seal); font-size: var(--font-2xl); color: var(--ink-paper); }
</style>