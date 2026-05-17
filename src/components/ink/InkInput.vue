<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string; type?: string; multiline?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <view class="ink-input-wrap">
    <textarea v-if="multiline" class="ink-textarea" :value="modelValue" :placeholder="placeholder"
      placeholder-style="color: var(--ink-text-muted)"
      @input="emit('update:modelValue', ($event.target as any).value)" />
    <input v-else class="ink-input" :type="type || 'text'" :value="modelValue"
      :placeholder="placeholder" placeholder-style="color: var(--ink-text-muted)"
      @input="emit('update:modelValue', ($event.target as any).value)" />
  </view>
</template>
<style lang="scss" scoped>
.ink-input-wrap { background: var(--ink-surface-inset); border: 1rpx solid var(--ink-border); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); transition: var(--transition-ink); }
.ink-input-wrap:focus-within { border-color: var(--ink-gold); box-shadow: var(--shadow-gold); }
.ink-input, .ink-textarea { width: 100%; background: transparent; border: none; outline: none; font-family: var(--font-primary); font-size: var(--font-base); color: var(--ink-text); }
.ink-textarea { min-height: 120rpx; resize: none; }
</style>