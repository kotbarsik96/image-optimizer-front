<template>
  <div class="upload-area" :class="classes">
    <div class="text">{{ $t('general.dropImagesHere') }}</div>
    <FsUploadDialog v-model="dialogShown" v-model:files="droppedImages" :folder-id="folderId" />
  </div>
</template>

<script setup lang="ts">
import FsUploadDialog from '@/components/Filesystem/_UI/FsUploadDialog.vue'
import { useDragFiles } from '@/composables/useDragFiles'
import { computed, ref } from 'vue'

const props = defineProps<{
  folderId: number
}>()

const dialogShown = ref(false)

const droppedImages = ref<Array<File>>()

const { isDragging } = useDragFiles({
  dropTarget: document.body,
  onDrop: (event) => {
    const images = Array.from(event.dataTransfer?.files || []).filter((i) =>
      i.type.startsWith('image'),
    )
    if (images.length < 1) return

    droppedImages.value = images
    dialogShown.value = true
  },
})

const classes = computed(() => ({
  '--dragging': isDragging.value,
  '--dialog-shown': dialogShown.value,
}))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.upload-area {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 500;
  display: none;
  align-items: center;
  justify-content: center;

  &.--dragging {
    display: flex;
  }

  &.--dialog-shown {
    display: flex;

    .text {
      display: none;
    }
  }

  .text {
    color: var(--white);
    font: var(--text-medium-21);
  }
}
</style>
