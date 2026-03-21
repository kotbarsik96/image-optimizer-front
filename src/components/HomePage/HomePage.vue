<template>
  <div class="home">
    <div class="_container">
      <NewProjectButton />
      <h1 class="title _h1">{{ $t('home.projects') }}</h1>
      <ProjectsList />
    </div>
  </div>
</template>

<script setup lang="ts">
import NewProjectButton from '@/components/_UI/NewProjectButton.vue'
import ProjectsList from '@/components/Projects/Sections/ProjectsList.vue'
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
}
</style>
