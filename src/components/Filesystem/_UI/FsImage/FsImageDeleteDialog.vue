<template>
  <DialogWindow class="delete-img" v-model="model">
    <div class="dialog-title">
      {{ $t('filesystem.deleteImage', [`${image.filename}.${image.extension}`]) }}
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral @click="mutate">
        {{ $t('general.delete') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const model = defineModel<boolean>()

const props = defineProps<{
  image: IImageEntity
}>()

const { addNotification } = useNotifications()

const api = useApi()
const queryClient = useQueryClient()

const { mutate } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/images/${props.image.id}`, {
      method: 'DELETE',
    })

    const data = (await response?.json()) as IResponseWrapper<void>

    if (response?.ok) {
      if (data?.message) addNotification('info', data.message)

      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Folder, props.image.folder_id],
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
