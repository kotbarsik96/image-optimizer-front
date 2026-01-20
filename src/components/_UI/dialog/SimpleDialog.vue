<template>
  <dialog @mousedown="closeDialogOnOuterClick" @close="closeDialog" ref="dialogEl">
    <div v-if="showCloseButton" class="close-wrapper">
      <button class="close" type="button" @click="closeDialog">
        <IconClose />
      </button>
    </div>
    <div class="dialog-body">
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { useTemplateRef } from 'vue'
import IconClose from '@/assets/icons/close.svg'

const props = defineProps<{
  showCloseButton?: boolean
}>()

const model = defineModel({ type: Boolean, default: false })
const dialogEl = useTemplateRef<HTMLDialogElement>('dialogEl')

const { closeDialogOnOuterClick, closeDialog } = useDialog(model, dialogEl)
</script>

<style lang="scss" scoped>
@use '@/css/components/Dialog.scss';

dialog {
  .close-wrapper {
    align-self: flex-start;
    display: flex;
    justify-content: flex-end;
    padding: 1px;
    margin-left: 1rem;
    order: 2;
  }

  .close {
    width: max(32px, 2rem);
    height: max(32px, 2rem);

    :deep(svg) {
      width: max(24px, 1.5rem);
      height: auto;
      aspect-ratio: 1;
      color: var(--gray-100);
    }

    &:hover {
      border-color: var(--primary-2);
    }
  }

  .dialog-body {
    flex: 1 1 auto;

    > :deep(img) {
      max-height: 90vh;
      max-width: 90vw;
      cursor: zoom-out;
      border: 4px solid var(--white);
    }
  }
}
</style>
