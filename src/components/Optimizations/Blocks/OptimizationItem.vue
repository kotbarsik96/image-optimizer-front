<template>
  <button class="project-item" type="button" :disabled="progressShown" @click="downloadZip">
    <span class="icons">
      <component v-for="icon in extensionIcons" :is="icon" class="icon" />
    </span>
    <span class="name">
      {{ optimization.title }}
    </span>
    <span v-if="progressShown" class="progress">
      {{ currentProgress }}%
      <SpinnerLoader />
    </span>
  </button>
</template>

<script setup lang="ts">
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import type { IOptimizationEntity } from '@/api/entities/Optimization/IOptimizationEntity'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { supportedExtensions } from '@/interfaces/_General/EExtensions'
import { computed } from 'vue'
import { useProgress } from '@/composables/useProgress'
import { EProgressEntityName } from '@/interfaces/Progress/IProgress'

const props = defineProps<{
  optimization: IOptimizationEntity
}>()

const api = useApi()

const { addNotification } = useNotifications()

const extensionIcons = computed(() => {
  return props.optimization.extensions.split('|').map((ext) => supportedExtensions[ext]?.icon)
})

const { source } = useProgress(EProgressEntityName.Optimizations, props.optimization)

const currentProgress = computed(() => source?.value?.progressValue)

const progressShown = computed(
  () => typeof currentProgress.value != 'undefined' && currentProgress.value < 100,
)

async function downloadZip() {
  if (progressShown.value) return

  const response = await api.request(`/optimizations/archive/${props.optimization.id}`, {
    method: 'GET',
  })

  if (response?.ok) {
    const blob = await response.blob()
    const file = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = file
    a.download = `${props.optimization.title}.zip`
    document.body.append(a)
    a.style.cssText = `position: absolute; z-index: -999; opacity: 0;`
    a.click()
    a.remove()
  } else {
    const data = (await response?.json()) as IResponseWrapper<void>
    if (data.error) addNotification('error', data.error)
  }
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/ProjectItem.scss';
</style>
