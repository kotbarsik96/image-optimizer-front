<template>
  <dialog
    class="dialog-window"
    @mousedown="closeDialogOnOuterClick"
    @close="closeDialog"
    ref="dialogEl"
  >
    <div class="window">
      <button class="dw-close" type="button" @click="closeDialog">
        <IconClose />
      </button>
      <div class="body">
        <slot />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { useTemplateRef } from 'vue'
import IconClose from '@/assets/icons/close.svg'

const dialogEl = useTemplateRef<HTMLDialogElement>('dialogEl')

const model = defineModel({ type: Boolean, default: false })

const { closeDialog, closeDialogOnOuterClick } = useDialog(model, dialogEl)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/Dialog.scss';

.dialog-window {
  --dialog-block-padding: 30px;
  --dialog-inline-padding: 0;
  --max-window-width: 100svw;
  --max-window-height: 100svh;
  --window-block-padding: 20px;
  --window-inline-padding: 20px;

  width: 100svw;
  height: 100svh;
  overflow: visible;
  background-color: transparent;
  padding: var(--dialog-block-padding) var(--dialog-inline-padding);
  justify-content: center;
  align-items: center;

  &[open] {
    transform: scale(1);
  }

  .window {
    position: relative;
    border-radius: var(--ui-border-radius);
    background-color: var(--gray-100);
    width: 100vw;
    padding: var(--window-block-padding) var(--window-inline-padding);
    max-width: var(--max-window-width);
    max-height: var(--max-window-height);
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.25);
  }

  .dw-close {
    cursor: pointer;
    pointer-events: all;
    z-index: 50;
    color: var(--text);
    border-radius: 0;
    position: absolute;
    right: 0.625rem;
    top: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--general-transition);

    svg {
      width: max(24px, 1.5rem);
      height: auto;
      aspect-ratio: 1;
    }

    &:hover {
      color: var(--primary-2);
    }
  }

  .body {
    margin-block-start: 1rem;
    position: relative;
    z-index: 10;
    overflow: auto;
    max-height: calc(100svh - var(--window-block-padding) * 2 - var(--dialog-block-padding) * 2);
    color: var(--text);
  }

  :deep(.dialog-title) {
    font: var(--text-h3);
    margin-block-end: 1.25rem;
    text-align: center;
  }

  :deep(.dialog-buttons) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-block: 2.5rem 0.5rem;
  }

  @include mixins.adaptive(phone-min) {
    --dialog-block-padding: 15px;
    --max-window-width: 630px;
  }
}
</style>
