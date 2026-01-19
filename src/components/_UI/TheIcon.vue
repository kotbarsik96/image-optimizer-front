<template>
  <img v-if="typeof icon === 'string'" class="icon" :src="icon" role="presentation" />
  <component v-else-if="!!icon" :is="icon" class="icon" role="presentation" />
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: any
}>()
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
