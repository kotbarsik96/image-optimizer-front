<template>
  <div class="project _page">
    <div class="_container">
      <div class="_page-title">
        <h1 class="_h1">{{ $t('general.project') }}: "18-01-2026 16:33"</h1>
      </div>
      <div class="buttons">
        <ButtonRouterLink :to="{ name: 'HomePage' }" button-style="primary-1">
          <IconHome />
          {{ $t('general.toHomepage') }}
        </ButtonRouterLink>
        <ButtonGeneral button-style="success">
          <IconPlusCircle />
          {{ $t('general.optimize') }}
        </ButtonGeneral>
        <ButtonGeneral>
          <IconList />
          {{ $t('general.optimizedImages') }}
        </ButtonGeneral>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconHome from '@/assets/icons/home.svg'
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import IconList from '@/assets/icons/list.svg'
import ButtonRouterLink from '@/components/_UI/buttons/ButtonRouterLink.vue'
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.project {
  .buttons {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-block-start: 2.5rem;
  }
}
</style>
