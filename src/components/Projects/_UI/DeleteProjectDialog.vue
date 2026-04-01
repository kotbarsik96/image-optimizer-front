<template>
  <DialogWindow v-model="shown">
    <div class="dialog-title">{{ $t('project.doYouWantToRemove', [project.title]) }}</div>
    <TextInputWrapper :input-id="inputId" :label="$t('project.repeatToDelete', [project.title])">
      <TextInput
        v-model="repeat"
        :id="inputId"
        :placeholder="project.title"
        v-autofocus="autofocusData"
      />
      <template #error v-if="error">{{ error }}</template>
    </TextInputWrapper>
    <div class="dialog-buttons">
      <ButtonGeneral :disabled="isDisabled" :is-loading="isPending" @click="deleteProject">
        {{ $t('general.delete') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="close">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import { vAutofocus } from '@/directives/vAutofocus'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import { useApi } from '@/composables/useApi'
import { useMutation } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '@/composables/useNotifications'
import { useRouter } from 'vue-router'

const props = defineProps<{
  project: IProjectEntity
}>()

const inputId = 'delete-project-repeat'

const api = useApi()
const { addNotification } = useNotifications()

const router = useRouter()

const { t } = useI18n()

const shown = defineModel({ type: Boolean })

const autofocusData = { shown }

const repeat = ref('')

const error = computed(() => {
  if (customError.value) return customError.value
  else if (repeat.value !== props.project.title) return t('project.repeatIsIncorrect')
  return undefined
})

const customError = ref('')
watch(repeat, () => (customError.value = ''))

const isDisabled = computed(() => !!error.value)

const { mutate: deleteProject, isPending } = useMutation({
  mutationFn: async () => {
    const response = await api.request(`/projects/${props.project.id}`, {
      method: 'DELETE',
    })

    const data = (await response?.json()) as IResponseWrapper<void>

    close()

    if (response?.ok) {
      if (data.message) addNotification('success', data.message)
      router.push({ name: 'HomePage' })
    } else {
      if (data?.error) addNotification('error', data.error)
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
</style>
