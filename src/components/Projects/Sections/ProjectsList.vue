<template>
  <div class="projects-list">
    <template v-if="isPending">
      <SkeletonItem v-for="_ in 5" />
    </template>
    <ProjectItem v-for="project in list" :key="project.id" :project="project" />
    <div v-if="list.length < 1" class="empty">
      {{ $t('project.listIsEmpty') }}
    </div>
    <SpinnerLoader v-if="isFetching" />
  </div>
</template>

<script setup lang="ts">
import SkeletonItem from '@/components/_UI/SkeletonItem.vue'
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import ProjectItem from '@/components/Projects/Blocks/ProjectItem.vue'
import { useProjectsListQuery } from '@/composables/queries/useProjectQuery'
import { computed } from 'vue'

const { queryWrapper } = useProjectsListQuery()
const { data, isPending, isFetching } = queryWrapper()

const list = computed(() => data.value?.data ?? [])
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.projects-list {
  width: 100%;
  max-width: 650px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 400px;

  .empty {
    text-align: center;
    font: var(--text-medium-21);
  }
}
</style>
