<script setup lang="ts">
</script>
<template>
  <view class="page-container">
    <slot />
  </view>
</template>
<style lang="scss" scoped>
.page-container { min-height: 100vh; background: var(--ink-bg); padding-bottom: var(--space-10); padding-bottom: env(safe-area-inset-bottom, var(--space-10)); }
</style>