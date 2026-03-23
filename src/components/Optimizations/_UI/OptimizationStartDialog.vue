<template>
  <DialogWindow class="os-dialog" v-model="shown">
    <div class="dialog-title">{{ $t('optimization.newOptimization') }}</div>
    <div class="inputs">
      <TextInputWrapper input-id="newopt-title" :label="$t('optimization.titleField')">
        <TextInput v-model="title" id="newopt-title" placeholder="2026-01-01 00:00:00" />
      </TextInputWrapper>
      <TextInputWrapper input-id="newopt-extensions" label="Расширения (пример: avif|webp|jpg)">
        <TextInput v-model="extensions" id="newopt-extensions" placeholder="avif|webp|jpg" />
      </TextInputWrapper>
      <TextInputWrapper input-id="newopt-sizes" label="Размеры (пример: 25|50|75)">
        <TextInput v-model="sizes" id="newopt-sizes" placeholder="25|50|75" />
      </TextInputWrapper>
      <Transition name="anim-fade">
        <div v-if="error" class="error">{{ error }}</div>
      </Transition>
    </div>
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
</template>

<script setup lang="ts">
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
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
  project: IProjectEntity
}>()

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const shown = defineModel<boolean>()

const title = ref('')
const extensions = ref('')
const sizes = ref('')

const error = ref('')
watch(title, () => (error.value = ''))

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/optimizations/start/${props.project.id}`, {
      method: 'POST',
      body: {
        title: title.value,
        extensions: extensions.value,
        sizes: sizes.value,
      },
    })

    const data = (await response?.json()) as IResponseWrapper<void>

    if (response?.ok) {
      if (data.message) addNotification('info', data.message)
      title.value = ''
      shown.value = false
    } else {
      if (data.error) error.value = data.error
    }

    return data
  },
})

function close() {
  shown.value = false
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.os-dialog {
  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .error {
    text-align: center;
    font: var(--text-medium-18);
    color: var(--error);
  }
}
</style>
