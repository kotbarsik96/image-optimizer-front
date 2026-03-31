<template>
  <div class="upload" :class="classes">
    <label class="button upload" :disabled="disabled">
      <input type="file" ref="uploadInputElement" multiple @change="onChange" />
      <span>
        <IconPlusCircle class="img" />
        <span>{{ $t('general.upload') }}</span>
      </span>
      <Transition name="anim-fade">
        <SpinnerLoader v-if="isLoading" class="btn-loader" />
      </Transition>
    </label>
    <FsUploadOverlay :shown="isDragging" />
    <FsUploadDialog v-model="dialogShown" :folder-id="folderId" />
  </div>
</template>

<script setup lang="ts">
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import FsUploadDialog from '@/components/Filesystem/_UI/FsUploadDialog.vue'
import FsUploadOverlay from '@/components/Filesystem/_UI/FsUploadOverlay.vue'
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import { useImagesDragNDrop } from '@/composables/useDragFiles'
import type { ButtonStyle } from '@/interfaces/UI/Button'
import { useDroppedFilesStore } from '@/stores/droppedFilesStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    folderId: number
    buttonStyle?: ButtonStyle
    isLoading?: boolean
    disabled?: boolean
  }>(),
  {
    buttonStyle: 'primary',
  },
)

const store = useDroppedFilesStore()
const { folderImageFiles } = storeToRefs(store)

const { isDragging } = useImagesDragNDrop(
  {
    dropTarget: document.body,
    onDrop() {
      dialogShown.value = true
    },
  },
  folderImageFiles,
)

const dialogShown = ref(false)

const classes = computed(() => ({
  '--dragging': isDragging.value,
}))

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const images = Array.from(target.files ?? []).filter((f) => f.type.startsWith('image/'))
  if (images.length > 0) {
    folderImageFiles.value = images
    dialogShown.value = true
  }
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/Button.scss';

.upload {
  input {
    display: none;
  }
}
</style>
