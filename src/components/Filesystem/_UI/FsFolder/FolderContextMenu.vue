<template>
  <ContextMenu class="fcm" parent-selector=".fs-folder" v-model="shown">
    <ContextMenuItem @click="showRenameDialog">
      <IconRename class="icon-rename" />
      {{ $t('contextMenu.rename') }}
    </ContextMenuItem>

    <ContextMenuItem @click="showDeleteDialog">
      <IconDelete class="icon-delete" />
      {{ $t('contextMenu.remove') }}
    </ContextMenuItem>

    <FsFolderRenameDialog :folder="folder" v-model="renameDialogShown" />
    <FsFolderDeleteDialog :folder="folder" v-model="deleteDialogShown" />
  </ContextMenu>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import ContextMenu from '@/components/_UI/context-menu/ContextMenu.vue'
import ContextMenuItem from '@/components/_UI/context-menu/ContextMenuItem.vue'
import FsFolderDeleteDialog from '@/components/Filesystem/_UI/FsFolder/FsFolderDeleteDialog.vue'
import FsFolderRenameDialog from '@/components/Filesystem/_UI/FsFolder/FsFolderRenameDialog.vue'
import IconRename from '@/assets/icons/pencil.svg'
import IconDelete from '@/assets/icons/delete.svg'
import { ref } from 'vue'

const props = defineProps<{
  folder: IFolderEntity
}>()

const shown = ref(false)

const renameDialogShown = ref(false)
const showRenameDialog = () => (renameDialogShown.value = true)
const deleteDialogShown = ref(false)
const showDeleteDialog = () => (deleteDialogShown.value = true)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.fcm {
  cursor: auto;
}
</style>
