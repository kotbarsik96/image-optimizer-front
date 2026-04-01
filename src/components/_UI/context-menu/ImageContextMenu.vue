<template>
  <ContextMenu class="img-cm" parent-selector=".fs-image" v-model="shown">
    <ContextMenuItem @click="openOriginal">
      <IconOpen class="icon-open" />
      {{ $t('contextMenu.openOriginal') }}
    </ContextMenuItem>

    <ContextMenuItem @click="getPreview">
      <IconZoom class="icon-zoom" />
      {{ $t('contextMenu.zoom') }}
    </ContextMenuItem>

    <ContextMenuItem @click="showRenameDialog">
      <IconRename class="icon-rename" />
      {{ $t('contextMenu.rename') }}
    </ContextMenuItem>

    <!-- <ContextMenuItem @click="showMoreInfoDialog">
      <IconInfo class="icon-info" />
      {{ $t('contextMenu.moreInfo') }}
    </ContextMenuItem> -->

    <ContextMenuItem @click="showDeleteDialog">
      <IconDelete class="icon-delete" />
      {{ $t('contextMenu.remove') }}
    </ContextMenuItem>

    <ImagePreviewDialog v-model="previewDialogShown" :image="image" />
    <FsImageRenameDialog v-model="renameDialogShown" :image="image" />
    <FsImageDeleteDialog v-model="deleteDialogShown" :image="image" />
  </ContextMenu>
</template>

<script setup lang="ts">
import ContextMenu from '@/components/_UI/context-menu/ContextMenu.vue'
import ContextMenuItem from '@/components/_UI/context-menu/ContextMenuItem.vue'
import IconOpen from '@/assets/icons/open.svg'
import IconZoom from '@/assets/icons/zoom.svg'
import IconRename from '@/assets/icons/pencil.svg'
import IconInfo from '@/assets/icons/info.svg'
import IconDelete from '@/assets/icons/delete.svg'
import FsImageRenameDialog from '@/components/Filesystem/_UI/FsImage/FsImageRenameDialog.vue'
import { computed, ref } from 'vue'
import FsImageDeleteDialog from '@/components/Filesystem/_UI/FsImage/FsImageDeleteDialog.vue'
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
import ImagePreviewDialog from '@/components/_UI/ImagePreviewDialog.vue'
import { EStorage } from '@/enums/EStorage'
import {
  getImagePreviewUrl,
  useImagePreviewQuery,
} from '@/composables/queries/useImagePreviewQuery'
import { useNotifications } from '@/composables/useNotifications'
import { useApi } from '@/composables/useApi'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  image: IImageEntity
}>()

const { addNotification, removeNotification } = useNotifications()

const shown = ref(false)

const api = useApi()

const { t } = useI18n()

const openOriginal = async () => {
  let url = props.image.url

  switch (props.image.storage) {
    case EStorage.Local:
      try {
        // если getImagePreviewUrl выполняется довольно долго - указать в нотификации о загрузке
        let notificationId: string | undefined
        const timeout = setTimeout(() => {
          notificationId = addNotification(
            'info',
            t('filesystem.imageLoadingMoreThanExpected'),
            60000,
          )
        }, 1000)
        url = await getImagePreviewUrl(api, props.image.id)
        // изображение загрузилось - убрать нотификацию, если она была
        clearTimeout(timeout)
        if (notificationId) removeNotification(notificationId)
      } catch (error: any) {
        addNotification('error', error.message)
      }
      break
    case EStorage.S3:
      url = props.image.url
      break
  }

  window.open(url, '_blank')
}

const previewDialogShown = ref(false)
const getPreview = () => (previewDialogShown.value = true)

const renameDialogShown = ref(false)
const showRenameDialog = () => (renameDialogShown.value = true)

const moreInfoDialogShown = ref(false)
const showMoreInfoDialog = () => (moreInfoDialogShown.value = true)

const deleteDialogShown = ref(false)
const showDeleteDialog = () => (deleteDialogShown.value = true)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.img-cm {
  .icon-open {
    color: var(--primary);
  }

  .icon-info {
    color: var(--primary);
  }

  .icon-delete {
    color: var(--error);
  }
}
</style>
