<template>
  <div class="fs-image fs-block" tabindex="0" ref="element">
    <img class="img" :src="src" :alt="image.filename" />
    <div class="title">{{ title }}</div>
    <ImageContextMenu v-if="image" :image="image" />
  </div>
</template>

<script setup lang="ts">
import IconPlaceholder from '@/assets/icons/image.svg?url'
import { computed } from 'vue'
import ImageContextMenu from '@/components/_UI/context-menu/ImageContextMenu.vue'
import type { IImageEntity } from '@/api/entities/Image/IImageEntity'

const props = defineProps<{
  image: IImageEntity
}>()

const title = computed(() => `${props.image.filename}.${props.image.extension}`)

const src = computed(() => props.image.url || IconPlaceholder)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';
</style>
