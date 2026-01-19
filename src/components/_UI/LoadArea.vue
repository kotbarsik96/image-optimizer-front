<template>
  <div class="load-area">
    <button class="la-button" type="button">
      <IconUpload />
      {{ $t('home.upload') }}
    </button>
    <input class="la-input" type="file" />
  </div>
</template>

<script setup lang="ts">
import IconUpload from '@/assets/icons/upload.svg'
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.load-area {
  width: 200px;
  height: auto;
  aspect-ratio: 1;

  .la-button {
    border-radius: 8px;
    background-color: var(--gray-100);
    border: 2px solid var(--gray-400);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font: var(--text-medium-21);
    text-align: center;
    gap: 0.625rem;
    transition: var(--general-transition);

    svg {
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
    }

    &:hover {
      border-color: var(--primary);
      background-color: var(--primary);
      box-shadow: var(--shadow-2);
      color: var(--white);
    }
  }

  .la-input {
    opacity: 0;
    visibility: hidden;
    z-index: -999;
  }
}
</style>
