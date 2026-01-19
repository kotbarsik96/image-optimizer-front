<template>
  <button class="button" :class="classes" :type="type" :disabled="disabled">
    <span>
      <slot />
    </span>
    <Transition name="anim-fade">
      <SpinnerLoader v-if="isLoading" class="btn-loader" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import SpinnerLoader from '@/components/_UI/SpinnerLoader.vue'
import { useButtonClass } from '@/composables/useButtonClass'
import type { ButtonStyle, ButtonTypeAttribute } from '@/interfaces/UI/Button'

const props = withDefaults(
  defineProps<{
    buttonStyle?: ButtonStyle
    disabled?: boolean
    iconOnly?: boolean
    isLoading?: boolean
    type?: ButtonTypeAttribute
  }>(),
  {
    buttonStyle: 'primary',
  },
)

const classes = useButtonClass(props)
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/Button.scss';
</style>
