<template>
  <DialogWindow class="os-dialog" v-model="shown">
    <div class="dialog-title">{{ $t('optimization.newOptimization') }}</div>
    <div class="inputs">
      <TextInputWrapper input-id="newopt-title" :label="$t('optimization.titleField')">
        <TextInput v-model="title" id="newopt-title" placeholder="2026-01-01 00:00:00" />
      </TextInputWrapper>
      <div class="extensions">
        <div class="title">{{ $t('optimization.extensions') }}:</div>
        <CheckboxLabel
          v-for="ext in Object.keys(supportedExtensions)"
          :value="ext"
          :label="ext.toUpperCase()"
          v-model="extensions"
        />
      </div>
      <div class="sizes">
        <NumberInputGroup
          v-model="sizes"
          :label="$t('optimization.sizesTitle')"
          :max-inputs-count="5"
          inputs-id="newopt-sizes"
          inputs-label="optimization.sizeNum"
        />
      </div>
      <ErrorText :error="error" />
    </div>
    <div class="dialog-buttons">
      <ButtonGeneral :is-loading="isPending" @click="mutate">
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
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import IconSave from '@/assets/icons/save.svg'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import CheckboxLabel from '@/components/_UI/CheckboxLabel.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { supportedExtensions } from '@/interfaces/_General/EExtensions'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, watch } from 'vue'
import NumberInputGroup from '@/components/_UI/text-inputs/NumberInputGroup.vue'
import ErrorText from '@/components/_UI/ErrorText.vue'
import type { IOptimizationEntity } from '@/api/entities/Optimization/IOptimizationEntity'
import { useProgressStore } from '@/stores/progressStore'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import { EProgressEntityName } from '@/interfaces/Progress/IProgress'

const props = defineProps<{
  project: IProjectEntity
}>()

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const shown = defineModel<boolean>()

const title = ref('')
const extensions = ref<Array<string>>([])
const sizes = ref([])

const progressesStore = useProgressStore()
const { startListenProgress } = progressesStore

const error = ref('')
watch(title, () => (error.value = ''))

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/optimizations/start/${props.project.id}`, {
      method: 'POST',
      body: {
        title: title.value,
        extensions: extensions.value.join('|'),
        sizes: sizes.value.join('|'),
      },
    })

    const data = (await response?.json()) as IResponseWrapper<IOptimizationEntity>

    if (response?.ok) {
      if (data.message) addNotification('info', data.message)
      title.value = ''
      shown.value = false

      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.OptimizationsList],
      })
      if (data.data?.id) startListenProgress(EProgressEntityName.Optimizations, data.data)
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

  .extensions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .title {
    margin-block-end: 0.25rem;
    font: var(--text-regular-18);
    color: var(--text);
  }

  .sizes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .ti-wrapper {
      :deep(.ti-input) {
        max-width: 4rem;
      }

      :deep(input) {
        text-align: center;
      }
    }
  }
}
</style>
