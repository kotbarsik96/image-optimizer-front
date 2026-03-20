<template>
  <div class="project _page">
    <div class="_container">
      <div class="header">
        <div class="_page-title">
          <div class="_pt-inner">
            <h1 class="_h1">{{ $t('general.project') }}: "18-01-2026 16:33"</h1>
            <button class="pt-button" type="button" @click="nameDialogOpen = true">
              <IconPencil />
            </button>
          </div>
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
      <div class="filesystem">
        <FilesystemWrapper />
      </div>
    </div>

    <ChangeProjectNameDialog v-model="nameDialogOpen" />
  </div>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconHome from '@/assets/icons/home.svg'
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import IconList from '@/assets/icons/list.svg'
import ButtonRouterLink from '@/components/_UI/buttons/ButtonRouterLink.vue'
import IconPencil from '@/assets/icons/pencil.svg'
import { ref } from 'vue'
import ChangeProjectNameDialog from '@/components/Projects/_UI/ChangeProjectNameDialog.vue'
import FilesystemWrapper from '@/components/Filesystem/Sections/FilesystemWrapper.vue'

const nameDialogOpen = ref(false)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.project {
  .pt-button {
    width: 2rem;
    height: auto;
    aspect-ratio: 1;
    color: var(--gray-800);
    transition: var(--general-transition);

    &:hover {
      color: var(--primary-2);
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-block-start: 2.5rem;
  }
}
</style>
