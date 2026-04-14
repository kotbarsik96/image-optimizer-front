<template>
  <div class="fs-image fs-block" tabindex="0" ref="element">
    <div v-if="isUploading" class="loader-wrap">
      <SpinnerLoader />
    </div>
    <img v-else class="img" :src="src" :alt="image.filename" />
    <div class="title">{{ title }}</div>
    <ImageContextMenu v-if="image && !isUploading" :image="image" />
  </div>
</template>

<script setup lang="ts">
import IconPlaceholder from '@/assets/icons/image.svg?url'
import { computed } from 'vue'
import ImageContextMenu from '@/components/Filesystem/_UI/FsImage/ImageContextMenu.vue'
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import type { TProgressDetailItem } from '@/interfaces/Progress/IProgress'

const props = defineProps<{
  image: IImageEntity
  uploadDetails?: TProgressDetailItem
}>()

const title = computed(() => `${props.image.filename}.${props.image.extension}`)

const src = computed(() => {
  let s = IconPlaceholder

  if (props.image.url) s = props.image.url

  return s
})

const isUploading = computed(
  () => !!props.uploadDetails && !props.uploadDetails.done && !props.uploadDetails.error,
)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';
</style>
