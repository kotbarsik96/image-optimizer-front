<template>
  <div class="ti-wrapper">
    <label v-if="label && inputId" class="label" :for="inputId">{{ label }}</label>
    <div class="ti-input">
      <slot />
    </div>
    <Transition name="anim-fade">
      <div v-if="$slots.error" class="error">
        <slot name="error" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  inputId?: string
}>()
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/TextInputWrapper.scss';
</style>
