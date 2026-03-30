<template>
  <DialogWindow v-model="model">
    <div class="dialog-title">
      {{ $t('general.upload') }}
    </div>
    <FsUploadsList :title="$t('filesystem.filesToUpload')" v-model:files="_files" />
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
import { computed, watch } from 'vue'

const model = defineModel<boolean>()

const props = defineProps<{
  files?: Array<File>
  folderId: number
}>()

const emit = defineEmits<{
  (e: 'update:files', files: Array<File>): void
}>()

const _files = computed({
  get() {
    return props.files
  },
  set(files: Array<File>) {
    emit('update:files', files)
  },
})

watch(_files, () => {
  if (!_files.value?.length) hideDialog()
})

const { mutate } = useUploadMutation(props.folderId)

async function upload() {
  if (_files.value) mutate(_files.value)
}

function hideDialog() {
  model.value = false
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
