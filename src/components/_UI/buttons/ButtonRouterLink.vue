<template>
  <RouterLink class="button" :class="classes" :type="type" :disabled="disabled" :to="to">
    <span>
      <slot />
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { useButtonClass } from '@/composables/useButtonClass'
import type { ButtonStyle, ButtonTypeAttribute } from '@/interfaces/UI/Button'
import type { RouteLocation } from 'vue-router'

const props = withDefaults(
  defineProps<{
    buttonStyle: ButtonStyle
    disabled?: boolean
    iconOnly?: boolean
    isLoading?: boolean
    type: ButtonTypeAttribute
    to: RouteLocation
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
