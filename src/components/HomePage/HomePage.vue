<template>
  <div class="home">
    <div class="_container">
      <LoadArea />
      <h1 class="title _h1">{{ $t('home.prevOptimizations') }}</h1>
      <div class="prev-list">
        <ProjectItem v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadArea from '@/components/_UI/LoadArea.vue'
import ProjectItem from '@/components/Projects/Blocks/ProjectItem.vue'
import { projects } from '@/mocks/projects'
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.home {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ._container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.875rem;
  }

  .prev-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>
