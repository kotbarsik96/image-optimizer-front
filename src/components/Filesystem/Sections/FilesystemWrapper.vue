<template>
  <div class="fs-wrapper">
    <template v-if="rootFolder">
      <div class="header">
        <ButtonGeneral :aria-label="$t('filesystem.goBack')">
          <IconChevronDown />
        </ButtonGeneral>
        <div class="path">{{ path }}</div>
      </div>
      <div class="body">
        <FsFolder
          v-for="nestedFolder in rootFolder.nested"
          :key="nestedFolder.id"
          :folder="nestedFolder"
          :routeName="routeName"
        />
        <FsImage v-for="image in rootFolder.images" :key="image.id" :image="image" />
      </div>
    </template>
    <div v-else class="fw-error">
      {{ $t('filesystem.couldNotLoadContents') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconChevronDown from '@/assets/icons/chevron-down.svg'
import FsFolder from '@/components/Filesystem/Blocks/FsFolder.vue'
import FsImage from '@/components/Filesystem/Blocks/FsImage.vue'
import { useRoute } from 'vue-router'
import { computed, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useApi } from '@/composables/useApi'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'

const props = defineProps<{
  rootFolder: IFolderEntity | undefined
}>()

const api = useApi()

const route = useRoute()
const routeName = computed(() => route.name as string)

const currentFolderId = computed(() => Number(route.params.folder_id) ?? props.rootFolder?.id)

const isNotRootFolder = computed(() => {
  return !!props.rootFolder && currentFolderId.value !== props.rootFolder?.id
})

const { data } = useQuery({
  queryKey: [EQueryKeys.Folder, currentFolderId],
  queryFn: async () => {
    const response = await api.request(`/folders/${toValue(currentFolderId)}`, {
      method: 'GET',
    })

    return await response?.json()
  },
  enabled: isNotRootFolder,
})

const path = computed(() => (props.rootFolder?.path == '.' ? '/' : props))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
