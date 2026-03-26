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
          v-autofocus="autofocusData"
          @keyup.enter="mutate"
        />
      </TextInputWrapper>
      <div v-if="imagesPreview.length > 0" class="uploads">
        <div class="u-title">{{ $t('project.filesToUpload') }}</div>
        <div class="u-list">
          <div v-for="(img, i) in imagesPreview" class="u-wrap">
            <button class="uw-remove" type="button" @click="removeFile(i)">
              <CloseIcon />
            </button>
            <img :src="img.src" :alt="img.alt" draggable="false" />
            <div class="uw-text">{{ img.alt }}</div>
          </div>
        </div>
      </div>
      <OptionsDropdown
        v-model="storage"
        :options="availableStoragesOptions"
        :label="$t('general.storageType')"
      />
    </div>
    <ErrorText :error="error" />
    <div class="dialog-buttons">
      <ButtonGeneral button-style="primary" @click="mutate">
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
import { vAutofocus } from '@/directives/vAutofocus'
import { computed, ref, watch } from 'vue'
import IconSave from '@/assets/icons/save.svg'
import IconPencil from '@/assets/icons/pencil.svg'
import CloseIcon from '@/assets/icons/close.svg'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import ErrorText from '@/components/_UI/ErrorText.vue'
import OptionsDropdown from '@/components/_UI/OptionsDropdown.vue'
import { availableStorages, EStorage } from '@/enums/EStorage'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  files?: Array<File>
}>()

const emit = defineEmits<{
  (e: 'update:files', files: Array<File>): void
}>()

const { t } = useI18n()

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const shown = defineModel<boolean>()
const hideDialog = () => (shown.value = false)

const title = ref('')
const storage = ref(EStorage.Local)

const error = ref('')
watch(title, () => (error.value = ''))

const availableStoragesOptions = computed(() =>
  availableStorages.map((st) => ({
    label: t(`general.storages.${st}`),
    value: st,
  })),
)

const autofocusData = { shown }

const inputId = 'new-project-title'

const images = computed(() => {
  return props.files?.filter((i) => i.type.startsWith('image')) ?? []
})

const imagesPreview = computed(() =>
  images.value.map((i) => ({
    src: URL.createObjectURL(i),
    alt: i.name,
  })),
)

const { mutate } = useMutation({
  mutationFn: async () => {
    const body = new FormData()
    body.append('title', title.value)
    body.append('storage', storage.value)

    if (images.value.length > 0) {
      images.value.forEach((img) => {
        body.append('images', img)
      })
    }

    const response = await api.request('/projects/new', {
      method: 'POST',
      body,
    })

    const data = (await response?.json()) as IResponseWrapper<IProjectEntity>

    if (response?.ok) {
      if (data.message) addNotification('success', data.message)

      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.ProjectsList],
      })

      shown.value = false
      title.value = ''
      removeAllFiles()
    } else {
      if (data.error) error.value = data.error
    }

    return data
  },
})

function removeFile(index: number) {
  const updated = images.value.filter((_, i) => i !== index) ?? []
  emit('update:files', updated)
}

function removeAllFiles() {
  emit('update:files', [])
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.np-dialog {
  --max-window-width: 400px;

  .u-title {
    font: var(--text-medium-21);
    text-align: center;
    padding-block: 1rem;
  }

  .u-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  .u-wrap {
    img {
      width: 200px;
      border-radius: 4px;
    }
  }

  .uw-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 0.25rem;

    svg {
      color: var(--text);
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
    }
  }

  .uw-text {
    text-align: center;
    font: var(--text-medium-16);
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
