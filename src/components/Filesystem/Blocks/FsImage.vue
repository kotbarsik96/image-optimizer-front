<template>
  <div class="fs-image fs-block">
    <img class="img" :src="image.url" :alt="image.filename" />
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import type { IImageEntityBase } from '@/api/entities/Image/IImageEntityBase'
import { computed } from 'vue'

const props = defineProps<{
  image: IImageEntityBase
}>()

const title = computed(() => `${props.image.filename}.${props.image.extension}`)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/FilesystemBlock.scss';
</style>
