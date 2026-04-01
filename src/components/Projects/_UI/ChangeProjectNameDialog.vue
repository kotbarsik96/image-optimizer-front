<template>
  <DialogWindow class="cp-nd" v-model="shown">
    <div class="dialog-title">{{ $t('project.changeName') }}</div>
    <TextInputWrapper :input-id="inputId" :label="$t('project.newName')">
      <TextInput
        v-model="title"
        :id="inputId"
        :placeholder="$t('project.newName')"
        v-autofocus="autofocusData"
        @keyup.enter="save"
      />
      <template #error v-if="error">{{ error }}</template>
    </TextInputWrapper>
    <div class="dialog-buttons">
      <ButtonGeneral :is-loading="isPending" @click="save">
        <IconSave />
        {{ $t('general.save') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="close">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import { vAutofocus } from '@/directives/vAutofocus'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import { ref, watch } from 'vue'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconSave from '@/assets/icons/save.svg'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useApi } from '@/composables/useApi'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps<{
  project: IProjectEntity
}>()

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const inputId = 'change-project-name'

const shown = defineModel({ type: Boolean, default: false })
const title = ref(props.project.title)

const error = ref('')
watch(title, () => (error.value = ''))

const autofocusData = { shown }

const { mutate: save, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/projects/rename/${props.project.id}`, {
      method: 'POST',
      body: {
        title: title.value,
      },
    })

    const data = (await response?.json()) as IResponseWrapper<IProjectEntity>

    if (response?.ok && data) {
      await queryClient.invalidateQueries({
        queryKey: [EQueryKeys.Project, data.data?.id],
      })

      if (data.message) addNotification('success', data.message)

      close()
    } else {
      if (data.error) error.value = data.error
    }

    return data
  },
})

function close() {
  shown.value = false
  title.value = props.project.title
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.cp-nd {
  --max-window-width: 500px;
}
</style>
