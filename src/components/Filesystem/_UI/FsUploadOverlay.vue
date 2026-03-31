<template>
  <div class="upload-overlay" :class="classes">
    <IconUpload class="icon" />
    <div class="text">{{ $t('general.dropImagesHere') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconUpload from '@/assets/icons/upload.svg'

const props = defineProps<{
  shown: boolean
}>()

const classes = computed(() => ({
  '--shown': props.shown,
}))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/mixins/animation-styles.scss';

.upload-overlay {
  position: fixed;
  pointer-events: none;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: var(--white);
  font: var(--text-h1);
  display: none;
  opacity: 0;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  animation: hide 0.25s ease-in-out;
  z-index: 999;

  .icon {
    width: 2.5rem;
    aspect-ratio: 1;
    height: auto;
  }

  &.--shown {
    display: flex;
    opacity: 1;
    animation-name: show;
  }
}

@keyframes hide {
  0% {
    display: flex;
    opacity: 1;
  }
  100% {
    display: none;
    opacity: 0;
  }
}

@keyframes show {
  0% {
    display: none;
    opacity: 0;
  }
  100% {
    display: flex;
    opacity: 1;
  }
}
</style>
