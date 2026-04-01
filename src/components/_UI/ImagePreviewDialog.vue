<template>
  <SimpleDialog class="image-preview" v-model="shown">
    <img v-if="src" class="img" :src="src" :alt="image.filename" />
    <SkeletonItem v-else-if="isPending" />
    <div v-else class="error">{{ error?.message || $t('filesystem.couldNotLoadImage') }}</div>
  </SimpleDialog>
</template>

<script setup lang="ts">
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import SimpleDialog from '@/components/_UI/dialog/SimpleDialog.vue'
import SkeletonItem from '@/components/_UI/SkeletonItem.vue'
import { useImagePreviewQuery } from '@/composables/queries/useImagePreviewQuery'
import { useApi } from '@/composables/useApi'
import { EStorage } from '@/enums/EStorage'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

const props = defineProps<{
  image: IImageEntity
}>()

const shown = defineModel<boolean>()

const imageId = computed(() => props.image.id)

const { data, isPending, error } = useImagePreviewQuery(imageId, {
  enabled: () => shown.value && props.image.storage === EStorage.Local,
})

const src = computed(() => {
  let s: string | undefined
  switch (props.image.storage) {
    case EStorage.Local:
      s = data.value
      break
    case EStorage.S3:
      s = props.image.url
      break
  }
  return s
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.image-preview {
  background: transparent;

  :deep(.dialog-body) > .img {
    max-width: 90svw;
    max-height: 90svh;
    border: none;
  }

  .skeleton {
    width: 90svw;
    height: 50svh;
    border-radius: var(--b-radius-sm);
  }

  .error {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font: var(--text-h2);
    background: var(--gray-200);
    border-radius: var(--b-radius-sm);
  }

  @include mixins.adaptive(desktop-small-min) {
    .skeleton {
      width: 50svw;
    }
  }
}
</style>
