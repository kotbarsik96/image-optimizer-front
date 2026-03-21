<template>
  <div class="skeleton"></div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.skeleton {
  width: 100%;
  height: 50px;
  border-radius: var(--b-radius-sm) var(--b-radius-big) var(--b-radius-sm) var(--b-radius-big);
  animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: #c2cfd6;
  }
  100% {
    background-color: #d7e2e9;
  }
}
</style>
