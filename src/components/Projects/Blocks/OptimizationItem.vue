<template>
  <RouterLink class="project-item" :to="to">
    <component v-if="extensionIcon" :is="extensionIcon" />
    <div class="name">{{ optimization.title }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { IOptimizationEntity } from '@/api/entities/Optimization/IOptimizationEntity'
import { extensionIconMap } from '@/interfaces/_General/EExtensions'
import { computed } from 'vue'

const props = defineProps<{
  optimization: IOptimizationEntity
}>()

const to = computed(() => ({ name: 'OptimizationPage', params: { id: props.optimization.id } }))

const extensionIcon = computed(() => {
  const ext = props.optimization.extensions.split('|')?.[0]
  let icon
  if (ext) {
    icon = extensionIconMap[ext]
  }
  return icon
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/ProjectItem.scss';
</style>
