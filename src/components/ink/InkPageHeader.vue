<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; showBack?: boolean }>()
const emit = defineEmits<{ back: [] }>()
</script>
<template>
  <view class="ink-header">
    <view v-if="showBack" class="header-back" @click="emit('back')">&lt;</view>
    <view class="header-titles">
      <text class="header-title">{{ title }}</text>
      <text v-if="subtitle" class="header-subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.ink-header { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4) var(--space-5); }
.header-back { font-size: var(--font-xl); color: var(--ink-text); padding: var(--space-2); cursor: pointer; }
.header-title { font-family: var(--font-display); font-size: var(--font-xl); color: var(--ink-text); }
.header-subtitle { font-size: var(--font-xs); color: var(--ink-text-muted); display: block; }
</style>