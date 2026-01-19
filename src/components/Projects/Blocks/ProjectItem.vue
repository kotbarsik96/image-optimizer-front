<template>
  <div class="pi-wrapper">
    <RouterLink class="project-item" :to="to">
      <div class="name">{{ project.name }}</div>
    </RouterLink>
    <div v-if="project.results" class="results">
      <ProjectResultItem v-for="result in project.results" :key="result.id" :result="result" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectResultItem from '@/components/Projects/Blocks/ProjectResultItem.vue'
import type { IProject } from '@/interfaces/Projects/IProject'
import { computed } from 'vue'

const props = defineProps<{
  project: IProject
}>()

const to = computed(() => ({ name: 'ProjectPage', params: { id: props.project.id } }))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/ProjectItem.scss';

.pi-wrapper {
  .results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-start: 0.625rem;
    padding-inline-start: 3rem;
  }
}
</style>
