<template>
  <label class="fs-block upload" type="button">
    <IconPlusCircle class="img" />
    <span>{{ $t('general.upload') }}</span>
    <input type="file" ref="uploadInputElement" multiple @change="onChange" />
  </label>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import type { IImageUpload } from '@/api/entities/Image/IImageUpload'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import { useApi } from '@/composables/useApi'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const props = defineProps<{
  folderId: number
}>()

const emit = defineEmits<{
  // на будущее: загрузки нужно отображать в FilesystemWrapper. Необходимо учитывать, что после начала загрузки пользователь может перейти в другую папку, поэтому нужно привязывать загрузки к id папки
  // (e: 'upload-start', folderId: number, files: File[]): void
  // (e: 'upload-end', folderId: number, files: IImageUpload[]): void
}>()

const api = useApi()
const queryClient = useQueryClient()

const { mutate } = useMutation({
  mutationFn: async (images: File[]) => {
    const body = new FormData()
    images.forEach((img) => body.append('images', img))

    const response = await api.request(`/folders/upload/${props.folderId}`, {
      method: 'POST',
      body,
    })

    return (await response?.json()) as IResponseWrapper<{
      folder: IFolderEntity
      uploads: IImageUpload[]
    }>
  },
  onSuccess: async ({ data }) => {
    queryClient.invalidateQueries({
      queryKey: [EQueryKeys.Folder, data?.folder.id],
    })
  },
})

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
