<template>
  <label class="checkbox">
    <input type="checkbox" v-model="model" :value="value" />
    <span class="body">
      <span class="box"></span>
      <span class="text">{{ label ?? value }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  value: any
}>()

const model = defineModel<Array<any>>()
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.checkbox {
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    z-index: -999;
  }

  .body {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: auto;
    aspect-ratio: 1;
    border-radius: 4px;
    border: 1px solid var(--gray-700);

    &::before {
      content: '';
      width: 80%;
      height: 80%;
      background-image: url('@/assets/icons/checkmark.svg');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
    }
  }

  input:checked + .body {
    .box {
      &::before {
        opacity: 1;
      }
    }
  }
}
</style>
