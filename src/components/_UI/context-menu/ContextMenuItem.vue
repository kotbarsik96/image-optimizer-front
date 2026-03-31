<template>
  <button class="cm-item" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.cm-item {
  display: flex;
  align-items: center;
  gap: 0.325rem;
  color: var(--text);
  font: var(--text-regular-16);
  background-color: var(--gray-50);
  width: 100%;
  padding: 0.325rem;
  transition: var(--general-transition);

  :deep(svg) {
    width: 1.5rem;
    height: auto;
    aspect-ratio: 1;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-300);
  }

  &:hover {
    background-color: var(--gray-200);
  }
}
</style>
