<template>
  <ContextMenu class="img-cm" parent-selector=".fs-image" v-model="shown">
    <ContextMenuItem v-if="image.url" @click="openOriginal">
      <IconOpen class="icon-open" />
      {{ $t('contextMenu.openOriginal') }}
    </ContextMenuItem>

    <!-- <ContextMenuItem @click="zoomIn">
      <IconZoom class="icon-zoom" />
      {{ $t('contextMenu.zoom') }}
    </ContextMenuItem> -->

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
import { ref } from 'vue'
import FsImageDeleteDialog from '@/components/Filesystem/_UI/FsImage/FsImageDeleteDialog.vue'
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'

const props = defineProps<{
  image: IImageEntity
}>()

const shown = ref(false)

const openOriginal = () => {
  window.open(props.image.url, '_blank')
}

const zoomDialogShown = ref(false)
const zoomIn = () => (zoomDialogShown.value = true)

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
