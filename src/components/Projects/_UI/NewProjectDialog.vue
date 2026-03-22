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
import { computed, ref } from 'vue'
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

const props = defineProps<{
  files?: Array<File>
}>()

const emit = defineEmits<{
  (e: 'update:files', files: Array<File>): void
}>()

const api = useApi()
const queryClient = useQueryClient()
const { addNotification } = useNotifications()

const shown = defineModel<boolean>()
const hideDialog = () => (shown.value = false)

const title = ref('')

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

const { mutate: createProject } = useMutation({
  mutationFn: async (title: string) => {
    const body = new FormData()
    body.append('title', title)

    if (images.value.length > 0) {
      images.value.forEach((img) => {
        body.append('images', img)
      })
    }

    const response = await api.request('/projects/new', {
      method: 'POST',
      body,
    })

    return await response?.json()
  },

  onSuccess: (data: IResponseWrapper<void>) => {
    queryClient.invalidateQueries({
      queryKey: [EQueryKeys.ProjectsList],
    })

    if (data.message) addNotification('success', data.message)

    shown.value = false
    title.value = ''
    removeAllFiles()
  },
})

const save = () => createProject(title.value)

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
}
</style>
