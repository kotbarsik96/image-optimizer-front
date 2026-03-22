<template>
  <div class="project _page">
    <div class="_container">
      <div class="header">
        <div class="_page-title">
          <div class="_pt-inner">
            <h1 class="_h1">{{ $t('general.project') }}: "{{ project?.title }}"</h1>
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
        <FilesystemWrapper
          :root-folder-id="project?.root_folder?.id"
          :is-root-loading="isPending"
        />
      </div>
    </div>

    <ChangeProjectNameDialog v-if="project?.id" v-model="nameDialogOpen" :project="project" />
  </div>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconHome from '@/assets/icons/home.svg'
import IconPlusCircle from '@/assets/icons/plus-circle.svg'
import IconList from '@/assets/icons/list.svg'
import ButtonRouterLink from '@/components/_UI/buttons/ButtonRouterLink.vue'
import IconPencil from '@/assets/icons/pencil.svg'
import { computed, ref, toValue } from 'vue'
import ChangeProjectNameDialog from '@/components/Projects/_UI/ChangeProjectNameDialog.vue'
import FilesystemWrapper from '@/components/Filesystem/Sections/FilesystemWrapper.vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import { useApi } from '@/composables/useApi'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'

const api = useApi()

const nameDialogOpen = ref(false)

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

const project = computed(() => data.value?.data)
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
