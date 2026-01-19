<template>
  <RouterLink class="project-item" :to="to">
    <component :is="extensionIconMap[result.extension]" />
    <div class="name">{{ result.date }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import { extensionIconMap } from '@/interfaces/_General/EExtensions'
import type { IProjectResult } from '@/interfaces/Projects/IProjectResult'
import { computed } from 'vue'

const props = defineProps<{
  result: IProjectResult
}>()

const to = computed(() => ({ name: 'ProjectResultPage', params: { id: props.result.id } }))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/ProjectItem.scss';
</style>
