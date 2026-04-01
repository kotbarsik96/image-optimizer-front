<template>
  <DialogWindow class="delete-img" v-model="shown">
    <div class="dialog-title">
      {{ $t('filesystem.deleteFolder', [folder.path]) }}
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral :is-loading="isPending" @click="mutate">
        {{ $t('general.delete') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="hide">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const shown = defineModel<boolean>()
const hide = () => (shown.value = false)

const props = defineProps<{
  folder: IFolderEntity
}>()

const { addNotification } = useNotifications()

const api = useApi()
const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/folders/${props.folder.id}`, {
      method: 'DELETE',
    })

    const data = (await response?.json()) as IResponseWrapper<void>

    hide()

    if (response?.ok) {
      if (data?.message) addNotification('info', data.message)

      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Folder, props.folder.parent_id],
      })
    } else {
      if (data.error) addNotification('error', data.error)
    }

    return data
  },
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.delete-img {
  .dialog-title {
    margin-block-end: 0;
  }

  .dialog-buttons {
    padding-block-start: 1.25rem;
  }
}
</style>
