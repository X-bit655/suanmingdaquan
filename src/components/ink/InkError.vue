<script setup lang="ts">
defineProps<{ message?: string; showRetry?: boolean }>()
const emit = defineEmits<{ retry: [] }>()
</script>
<template>
  <view class="ink-error">
    <view class="error-icon">&#x2716;</view>
    <text class="error-msg">{{ message || '服务暂时不可用' }}</text>
    <InkButton v-if="showRetry" type="secondary" @click="emit('retry')">重试</InkButton>
  </view>
</template>
<style lang="scss" scoped>
.ink-error { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); padding: var(--space-8) 0; }
.error-icon { font-size: var(--font-3xl); color: var(--ink-cinnabar); }
.error-msg { color: var(--ink-text-light); font-size: var(--font-sm); text-align: center; }
</style>