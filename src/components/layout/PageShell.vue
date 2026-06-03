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
  overflow-x: hidden;
  background:
    radial-gradient(circle at 18% -4%, rgba(217, 174, 95, 0.2), transparent 34%),
    radial-gradient(circle at 92% 8%, rgba(119, 134, 217, 0.16), transparent 32%),
    linear-gradient(180deg, #101722 0%, var(--ink-bg) 46%, #080B11 100%);
  padding-bottom: var(--space-10);
  padding-bottom: env(safe-area-inset-bottom, var(--space-10));
}
</style>
