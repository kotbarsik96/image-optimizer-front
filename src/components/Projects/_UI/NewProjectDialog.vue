<template>
  <DialogWindow class="np-dialog" v-model="shown">
    <div class="dialog-title">
      {{ $t('general.newProject') }}
    </div>
    <div class="inputs">
      <TextInputWrapper :label="$t('project.newProjectTitle')" :input-id="inputId">
        <IconPencil />
        <TextInput
          v-model="title"
          placeholder="2026-01-01 00:00:00"
          :id="inputId"
          @keyup.enter="save"
        />
      </TextInputWrapper>
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral button-style="primary" @click="save">
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
import { ref } from 'vue'
import IconSave from '@/assets/icons/save.svg'
import IconPencil from '@/assets/icons/pencil.svg'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useApi } from '@/composables/useApi'
import { useProjectsListQuery } from '@/composables/queries/useProjectQuery'
import { useNotifications } from '@/composables/useNotifications'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { EContentType } from '@/api/interfaces/EContentType'

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const shown = defineModel<boolean>()
const hideDialog = () => (shown.value = false)

const title = ref('')

const inputId = 'new-project-title'

const { queryKey } = useProjectsListQuery()

const { mutate: createProject } = useMutation({
  mutationFn: async (title: string) => {
    const body = new FormData()
    body.append('title', title)

    const response = await api.request('/projects/new', {
      method: 'POST',
      body,
    })

    return await response?.json()
  },

  onSuccess: (data: IResponseWrapper<void>) => {
    queryClient.invalidateQueries({
      queryKey,
    })

    if (data.message) addNotification('success', data.message)
  },
})

const save = () => createProject(title.value)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.np-dialog {
  --max-window-width: 400px;
}
</style>
