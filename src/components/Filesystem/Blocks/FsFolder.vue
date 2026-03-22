<template>
  <RouterLink class="fs-folder fs-block" :to="link">
    <IconFolder class="img" />
    <div class="title">{{ folderTitle }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import IconFolder from '@/assets/icons/folder.svg'
import { computed } from 'vue'

const props = defineProps<{
  folder: IFolderEntity
  routeName: string
}>()

const link = computed(() => ({
  name: props.routeName,
  params: {
    folder_id: props.folder.id,
  },
}))

const folderTitle = computed(() => {
  const split = props.folder.path.split('/')
  return split[split.length - 1]
})
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';
</style>
