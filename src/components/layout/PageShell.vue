<script setup lang="ts">
</script>

<template>
  <view class="page-shell">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.page-shell {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 249, 237, 0.72) 0%, rgba(244, 239, 228, 0.96) 45%, rgba(244, 239, 228, 1) 100%);
  padding-bottom: var(--space-10);
  padding-bottom: env(safe-area-inset-bottom, var(--space-10));
}
</style>
