<template>
  <div class="load-area">
    <label class="la-button">
      <IconUpload />
      {{ $t('home.upload') }}
      <input
        class="la-input"
        type="file"
        ref="inputElement"
        multiple
        webkitdirectory
        @change="onChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import IconUpload from '@/assets/icons/upload.svg'
import { useTemplateRef } from 'vue'

const inputElement = useTemplateRef<HTMLInputElement>('inputElement')

function onChange(event: any) {
  console.log(inputElement.value?.files)
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.load-area {
  width: 200px;
  height: auto;
  aspect-ratio: 1;

  .la-button {
    cursor: pointer;
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
    position: absolute;
    z-index: -999;
  }
}
</style>
