<template>
  <div class="fs-wrapper">
    <div class="header">
      <div class="buttons">
        <ButtonRouterLink
          v-if="linkBack"
          class="--back"
          :aria-label="$t('filesystem.goBack')"
          :to="linkBack"
        >
          <IconChevronDown />
        </ButtonRouterLink>

        <FsUpload v-if="currentFolderId" :folder-id="currentFolderId" />

        <FsNewFolderBtn v-if="currentFolderId" :folder-id="currentFolderId" />
      </div>

      <div class="path">{{ path }}</div>
    </div>
    <div v-if="folder" class="contents">
      <FsFolder
        v-for="nestedFolder in folder.nested"
        :key="nestedFolder.id"
        :folder="nestedFolder"
        :routeName="routeName"
      />
      <FsImage v-for="image in folder.images" :key="image.id" :image="image" />
    </div>

    <div v-else-if="isPending" class="contents">
      <SkeletonItem v-for="_ in 10" />
    </div>

    <div v-else class="fw-error">
      {{ $t('filesystem.couldNotLoadContents') }}
    </div>

    <SpinnerLoader v-if="isFetching && isEnabled" />
  </div>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import ButtonRouterLink from '@/components/_UI/buttons/ButtonRouterLink.vue'
import IconChevronDown from '@/assets/icons/chevron-down.svg'
import FsFolder from '@/components/Filesystem/Blocks/FsFolder.vue'
import FsImage from '@/components/Filesystem/Blocks/FsImage.vue'
import { useRoute } from 'vue-router'
import { computed, ref, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useApi } from '@/composables/useApi'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import SkeletonItem from '@/components/_UI/SkeletonItem.vue'
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import FsUpload from '@/components/Filesystem/Blocks/FsUpload.vue'
import FsNewFolderBtn from '@/components/Filesystem/Blocks/FsNewFolderBtn.vue'

const props = defineProps<{
  rootFolderId?: number
  isRootLoading?: boolean
}>()

const api = useApi()

const route = useRoute()
const routeName = computed(() => route.name as string)

const currentFolderId = computed(() => {
  let id = Number(route.params.folder_id)
  if (isNaN(id) || !id) id = props.rootFolderId ?? 0
  return id
})

const isRootFolder = computed(
  () => !!currentFolderId.value && currentFolderId.value === props.rootFolderId,
)

const {
  data,
  isFetching,
  isPending: _isPending,
  isEnabled,
} = useQuery<IResponseWrapper<IFolderEntity>>({
  queryKey: [EQueryKeys.Folder, currentFolderId],
  queryFn: async () => {
    const response = await api.request(`/folders/${toValue(currentFolderId)}`, {
      method: 'GET',
    })

    return await response?.json()
  },
  enabled: () => !!currentFolderId.value,
})

const isPending = computed(() => {
  let state = false

  if (isRootFolder.value) state = props.isRootLoading || _isPending.value
  else state = _isPending.value

  return state
})

const folder = computed(() => data.value?.data)

const path = computed(() => (folder.value?.path == '.' ? '/' : (folder.value?.path ?? '')))

const linkBack = computed(() => {
  let link = undefined
  if (folder.value?.parent_id) {
    link = {
      name: routeName.value,
      params: {
        project_id: route.params.project_id,
        folder_id: folder.value.parent_id,
      },
    }
  }
  return link
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.fs-wrapper {
  border: 1px solid var(--gray-500);
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  margin-block-start: 2.5rem;
  position: relative;
  overflow: hidden;

  .header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.875rem;
    margin-block-end: 1rem;
  }

  .path {
    font: var(--text-regular-21);
    color: var(--text);
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 1rem;

    .button {
      padding: 0;
      width: 2.75rem;
      height: auto;
      aspect-ratio: 1;

      svg {
        width: 1.5rem;
        height: auto;
        aspect-ratio: 1;
      }
    }

    .button.--back {
      svg {
        transform: rotate(90deg);
      }
    }
  }

  .contents {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .fs-block,
  :deep(.fs-block),
  .skeleton {
    width: 190px;
    min-height: 160px;
    border-radius: var(--b-radius-sm);
  }
}
</style>
