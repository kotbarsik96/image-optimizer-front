<template>
  <div class="pi-wrapper">
    <RouterLink class="project-item" :to="to">
      <div class="name">{{ project.title }}</div>
    </RouterLink>
    <div v-if="project.optimizations" class="optimizations">
      <OptimizationItem v-for="opt in project.optimizations" :key="opt.id" :optimization="opt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import OptimizationItem from '@/components/Projects/Blocks/OptimizationItem.vue'
import { computed } from 'vue'

const props = defineProps<{
  project: IProjectEntity
}>()

const to = computed(() => ({ name: 'ProjectPage', params: { id: props.project.id } }))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/ProjectItem.scss';

.pi-wrapper {
  .optimizations {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-start: 0.625rem;
    padding-inline-start: 3rem;
  }
}
</style>
