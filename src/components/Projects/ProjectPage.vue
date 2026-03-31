<template>
  <div class="project _page">
    <div class="_container">
      <div class="header">
        <div class="_page-title">
          <div v-if="project" class="_pt-inner">
            <h1 class="_h1 pt-text">{{ $t('general.project') }}: "{{ project.title }}"</h1>
            <button class="pt-button" type="button" @click="nameDialogOpen = true">
              <IconPencil />
            </button>
            <button class="pt-button" type="button" @click="deleteDialogOpen = true">
              <IconDelete />
            </button>
          </div>
          <SkeletonItem v-else-if="isPending" />
        </div>
        <div class="storage-type">
          <div v-if="storageType" class="text">{{ storageType }}</div>
          <SkeletonItem v-else-if="isPending" />
        </div>
        <div class="buttons">
          <ButtonRouterLink :to="{ name: 'HomePage' }" button-style="primary-1">
            <IconHome />
            {{ $t('general.toHomepage') }}
          </ButtonRouterLink>
          <ButtonGeneral button-style="success" @click="optimizationDialogOpen = true">
            <IconPlusCircle />
            {{ $t('general.optimize') }}
          </ButtonGeneral>
        </div>
      </div>
      <div class="filesystem">
        <FilesystemWrapper
          :root-folder-id="project?.root_folder?.id"
          :is-root-loading="isPending"
        />
      </div>
      <div class="p-opts">
        <div class="po-title">{{ $t('project.optimizations') }}</div>
        <OptimizationsList v-if="project" :project="project" />
      </div>
    </div>

    <ChangeProjectNameDialog v-if="project?.id" v-model="nameDialogOpen" :project="project" />
    <DeleteProjectDialog v-if="project?.id" v-model="deleteDialogOpen" :project="project" />
    <OptimizationStartDialog
      v-if="project?.id"
      v-model="optimizationDialogOpen"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconHome from '@/assets/icons/home.svg'
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import ButtonRouterLink from '@/components/_UI/buttons/ButtonRouterLink.vue'
import IconPencil from '@/assets/icons/pencil.svg'
import IconDelete from '@/assets/icons/delete.svg'
import { computed, ref, toValue } from 'vue'
import ChangeProjectNameDialog from '@/components/Projects/_UI/ChangeProjectNameDialog.vue'
import FilesystemWrapper from '@/components/Filesystem/Sections/FilesystemWrapper.vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import { useApi } from '@/composables/useApi'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import DeleteProjectDialog from '@/components/Projects/_UI/DeleteProjectDialog.vue'
import OptimizationStartDialog from '@/components/Optimizations/_UI/OptimizationStartDialog.vue'
import OptimizationsList from '@/components/Optimizations/Sections/OptimizationsList.vue'
import { useI18n } from 'vue-i18n'
import SkeletonItem from '@/components/_UI/SkeletonItem.vue'

const { t } = useI18n()

const api = useApi()

const nameDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const optimizationDialogOpen = ref(false)

const route = useRoute()

const projectId = computed(() => Number(route.params.project_id))

const { data, isPending } = useQuery<IResponseWrapper<IProjectEntity>>({
  queryKey: [EQueryKeys.Project, projectId],
  queryFn: async () => {
    const response = await api.request(`/projects/${toValue(projectId)}`, {
      method: 'GET',
    })

    return await response?.json()
  },
})

const test = ref(false)

const project = computed(() => data.value?.data)
const rootFolder = computed(() => project.value?.root_folder)
const storageType = computed(() => {
  if (!rootFolder.value) return undefined
  return `${t('general.storageType')}: ${t(`general.storages.${rootFolder.value?.storage}`)}`
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.project {
  .header {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .storage-type {
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      color: var(--text);
      font: var(--text-h3);
      text-align: center;
      min-height: 2rem;
    }

    .skeleton {
      width: 20rem;
      height: 2rem;
    }
  }

  ._page-title {
    .skeleton {
      width: 46rem;
      height: 5.25rem;
    }
  }

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
  }

  .p-opts {
    margin-block-start: 2.5rem;

    .po-title {
      margin-block-end: 0.5rem;
      font: var(--text-h2);
      text-align: center;
    }

    .optimizations {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      max-width: 500px;
      margin-inline: auto;
    }
  }
}
</style>
