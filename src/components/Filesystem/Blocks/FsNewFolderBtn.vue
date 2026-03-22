<template>
  <div class="new-folder">
    <button class="fs-block btn" type="button" @click="open">
      <IconPlus class="img" />
      <span class="title">
        {{ $t('general.newFolder') }}
      </span>
    </button>
    <DialogWindow v-model="dialogShown">
      <div class="dialog-title">{{ $t('general.newFolder') }}</div>
      <TextInputWrapper :input-id="inputId" :label="$t('filesystem.folderName')">
        <TextInput v-model="name" :id="inputId" />
        <template v-if="nameError" #error>{{ nameError }}</template>
      </TextInputWrapper>
      <div class="dialog-buttons">
        <ButtonGeneral :is-loading="isPending" @click="mutate">
          <IconSave />
          {{ $t('general.save') }}
        </ButtonGeneral>
        <ButtonGeneral :is-loading="isPending" button-style="error" @click="close">
          {{ $t('general.cancel') }}
        </ButtonGeneral>
      </div>
    </DialogWindow>
  </div>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import IconPlus from '@/assets/icons/plus-circle.svg'
import IconSave from '@/assets/icons/save.svg'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, watch } from 'vue'

const props = defineProps<{
  folderId: number
}>()

const api = useApi()
const queryClient = useQueryClient()

const { addNotification } = useNotifications()

const inputId = 'new-folder'

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/folders/new/${props.folderId}`, {
      method: 'POST',
      body: {
        name: name.value,
      },
    })

    const data = (await response?.json()) as IResponseWrapper<IFolderEntity | null>

    if (response?.ok) {
      console.log(data.data?.id)
      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Folder, data?.data?.parent_id],
      })
      if (data?.message) addNotification('success', data.message)
      close()
      name.value = ''
    } else {
      if (data?.error) nameError.value = data.error
    }

    return data
  },
})

const dialogShown = ref(false)

const name = ref('')
const nameError = ref('')
watch(name, () => {
  nameError.value = ''
})

function close() {
  dialogShown.value = false
}
function open() {
  dialogShown.value = true
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';

.new-folder {
  .btn {
    cursor: pointer;
    justify-content: center;
    width: 100%;
    height: 100%;

    .img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
}
</style>
