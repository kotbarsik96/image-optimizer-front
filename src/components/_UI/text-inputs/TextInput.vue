<template>
  <input :type="type" v-model="model" :autocomplete="autocomplete" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'text' | 'email'
    autocomplete?: string
  }>(),
  {
    type: 'text',
    autocomplete: 'off',
  },
)

const model = defineModel({ type: String })
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/TextInput.scss';
</style>
