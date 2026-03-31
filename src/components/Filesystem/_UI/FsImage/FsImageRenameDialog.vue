<template>
  <DialogWindow v-model="shown">
    <div class="dialog-title">{{ $t('filesystem.renameImage', [image.filename]) }}</div>
    <div class="inputs">
      <TextInputWrapper :label="$t('filesystem.newImageName')" input-id="rename-img">
        <TextInput
          v-autofocus="autofocusData"
          v-model="name"
          id="rename-img"
          :placeholder="$t('filesystem.newImageName')"
          @keyup.enter="mutate"
        />
      </TextInputWrapper>
      <Transition name="anim-fade">
        <div v-if="error" class="error">{{ error }}</div>
      </Transition>
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral @click="mutate">
        <IconSave />
        {{ $t('general.save') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import { vAutofocus } from '@/directives/vAutofocus'
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
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

const props = defineProps<{
  image: IImageEntity
}>()

const shown = defineModel<boolean>()

const autofocusData = { shown }

const { addNotification } = useNotifications()

const api = useApi()
const queryClient = useQueryClient()

const name = ref(props.image.filename)
const error = ref('')
watch(name, () => (error.value = ''))

const { mutate } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/images/rename/${props.image.id}`, {
      method: 'POST',
      body: {
        name: name.value,
      },
    })

    const data = (await response?.json()) as IResponseWrapper<{ image: IImageEntity }>

    if (response?.ok) {
      if (data.message) addNotification('success', data.message)
      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Folder, data.data?.image.folder_id],
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
