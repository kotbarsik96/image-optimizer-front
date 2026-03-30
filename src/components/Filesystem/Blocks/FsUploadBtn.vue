<template>
  <label class="fs-block upload" type="button">
    <IconPlusCircle class="img" />
    <span>{{ $t('general.upload') }}</span>
    <input type="file" ref="uploadInputElement" multiple @change="onChange" />
  </label>
</template>

<script setup lang="ts">
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import { useUploadMutation } from '@/composables/useUpload'

const props = defineProps<{
  folderId: number
}>()

const { mutate } = useUploadMutation(props.folderId)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const images = Array.from(target.files ?? []).filter((f) => f.type.startsWith('image/'))
  if (images.length > 0) mutate(images)
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';

.upload {
  cursor: pointer;
  justify-content: center;

  .img {
    width: 2.5rem;
    height: 2.5rem;
  }

  input {
    display: none;
  }
}
</style>
