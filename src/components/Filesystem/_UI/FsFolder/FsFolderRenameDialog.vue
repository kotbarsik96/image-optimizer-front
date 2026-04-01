<template>
  <DialogWindow v-model="shown">
    <div class="dialog-title">
      {{ $t('filesystem.renameFolder', [Path.base(folder.path)]) }}
    </div>
    <div class="inputs">
      <TextInputWrapper :label="$t('filesystem.newFolderName')" input-id="rename-folder">
        <TextInput
          v-autofocus="autofocusData"
          v-model="name"
          id="rename-folder"
          :placeholder="$t('filesystem.newFolderName')"
          :disabled="isPending"
          @keyup.enter="mutate"
        />
      </TextInputWrapper>
      <ErrorText :error="error" />
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral :is-loading="isPending" @click="mutate">
        <IconSave />
        {{ $t('general.save') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="hide">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import { vAutofocus } from '@/directives/vAutofocus'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import IconSave from '@/assets/icons/save.svg'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, watch } from 'vue'
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { Path } from '@/utils/Path'
import ErrorText from '@/components/_UI/ErrorText.vue'

const props = defineProps<{
  folder: IFolderEntity
}>()

const shown = defineModel<boolean>()
const hide = () => (shown.value = false)

const autofocusData = { shown }

const { addNotification } = useNotifications()

const api = useApi()
const queryClient = useQueryClient()

const name = ref(Path.base(props.folder.path))
const error = ref('')
watch(name, () => (error.value = ''))

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/folders/rename/${props.folder.id}`, {
      method: 'POST',
      body: {
        name: name.value,
      },
    })

    const data = (await response?.json()) as IResponseWrapper<{ folder: IFolderEntity }>

    if (response?.ok) {
      if (data.message) addNotification('success', data.message)
      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Folder, data.data?.folder.parent_id],
      })
      shown.value = false
    } else {
      if (data?.error) error.value = data.error
    }

    return data
  },
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
