<template>
  <DialogWindow v-model="model">
    <div class="dialog-title">
      {{ $t('general.upload') }}
    </div>
    <FsUploadsList :title="$t('filesystem.filesToUpload')" v-model:files="uploadFolderFiles" />
    <div class="dialog-buttons">
      <ButtonGeneral button-style="primary" @click="upload">
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

const model = defineModel<boolean>()

const props = defineProps<{
  folderId: number
}>()

const store = useDroppedFilesStore()
const { uploadFolderFiles } = storeToRefs(store)

watch(
  () => uploadFolderFiles.value.length,
  (l) => {
    if (l < 1) hideDialog()
  },
)

const { mutate } = useUploadMutation(() => props.folderId)

async function upload() {
  if (uploadFolderFiles.value.length) {
    mutate(uploadFolderFiles.value, {
      onSuccess() {
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
