<template>
  <div class="new-project" :class="classes">
    <button class="np-button" @click="showDialog">
      <component :is="icon" />
      {{ $t('general.newProject') }}
    </button>
    <FsUploadOverlay :shown="isDragging" />
    <NewProjectDialog v-model="dialogShown" />
  </div>
</template>

<script setup lang="ts">
import IconPlus from '@/assets/icons/plus-circle.svg'
import IconUpload from '@/assets/icons/upload.svg'
import FsUploadOverlay from '@/components/Filesystem/_UI/FsUploadOverlay.vue'
import NewProjectDialog from '@/components/Projects/_UI/NewProjectDialog.vue'
import { useImagesDragNDrop } from '@/composables/useDragFiles'
import { useToggler } from '@/composables/useToggler'
import { useDroppedFilesStore } from '@/stores/droppedFilesStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { isShown: dialogShown, show: showDialog } = useToggler()

const store = useDroppedFilesStore()
const { newProjectFiles } = storeToRefs(store)

const { isDragging } = useImagesDragNDrop(
  {
    dropTarget: document.body,
    onDrop() {
      dialogShown.value = true
    },
  },
  newProjectFiles,
)

const icon = computed(() => {
  return isDragging.value ? IconUpload : IconPlus
})

const classes = computed(() => ({
  '--drop': isDragging.value,
}))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.new-project {
  width: 200px;
  height: auto;
  aspect-ratio: 1;

  .np-button {
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
  }

  .np-button:hover,
  &.--drop .np-button {
    border-color: var(--primary);
    background-color: var(--primary);
    box-shadow: var(--shadow-2);
    color: var(--white);
  }

  .la-input {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    z-index: -999;
  }
}
</style>
