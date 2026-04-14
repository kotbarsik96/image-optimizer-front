<template>
  <DialogWindow v-model="model">
    <div class="dialog-title">
      {{ $t('general.upload') }}
    </div>
    <FsUploadsList :title="$t('filesystem.filesToUpload')" v-model:files="folderImageFiles" />
    <div class="dialog-buttons">
      <ButtonGeneral :is-loading="isPending" button-style="primary" @click="upload">
        <IconSave />
        {{ $t('general.save') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="hideDialog">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import IconSave from '@/assets/icons/save.svg'
import FsUploadsList from '@/components/Filesystem/Blocks/FsUploadsList.vue'
import { useUploadMutation } from '@/composables/useUpload'
import { watch } from 'vue'
import { useDroppedFilesStore } from '@/stores/droppedFilesStore'
import { storeToRefs } from 'pinia'
import { useQueryClient } from '@tanstack/vue-query'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'

const model = defineModel<boolean>()

const props = defineProps<{
  folderId: number
}>()

const queryClient = useQueryClient()

const store = useDroppedFilesStore()
const { folderImageFiles } = storeToRefs(store)

watch(
  () => folderImageFiles.value.length,
  (l) => {
    if (l < 1) hideDialog()
  },
)

const { mutate, isPending } = useUploadMutation(() => props.folderId)

async function upload() {
  if (folderImageFiles.value.length) {
    mutate(folderImageFiles.value, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [EQueryKeys.Folder, props.folderId],
        })
        hideDialog()
      },
    })
  }
}

function hideDialog() {
  model.value = false
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
