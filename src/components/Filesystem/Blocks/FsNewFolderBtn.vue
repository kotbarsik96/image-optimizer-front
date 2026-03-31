<template>
  <div class="new-folder">
    <ButtonGeneral class="btn" type="button" @click="open">
      <IconFolder class="img" />
      <span class="title">
        {{ $t('general.newFolder') }}
      </span>
    </ButtonGeneral>
    <DialogWindow v-model="shown">
      <div class="dialog-title">{{ $t('general.newFolder') }}</div>
      <TextInputWrapper :input-id="inputId" :label="$t('filesystem.folderName')">
        <TextInput v-model="name" :id="inputId" v-autofocus="autofocusData" @keyup.enter="mutate" />
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
import { vAutofocus } from '@/directives/vAutofocus'
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import IconFolder from '@/assets/icons/folder-2.svg'
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

const shown = ref(false)

const autofocusData = { shown }

const name = ref('')
const nameError = ref('')
watch(name, () => {
  nameError.value = ''
})

function close() {
  shown.value = false
}
function open() {
  shown.value = true
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
