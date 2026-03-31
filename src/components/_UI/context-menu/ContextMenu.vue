<template>
  <div class="context-menu" ref="element">
    <Transition name="context-menu-anim">
      <div v-if="shown" class="inner">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const props = defineProps<{
  parentSelector: string
}>()

const element = useTemplateRef<HTMLElement>('element')

let parent: HTMLElement | null | undefined

const shown = defineModel<boolean>()

onMounted(() => {
  parent = element.value?.closest(props.parentSelector)
  if (parent) {
    document.addEventListener('click', onClickAway)
    parent.addEventListener('contextmenu', onContextMenu)
  }
})

onUnmounted(() => {
  if (parent) {
    document.removeEventListener('click', onClickAway)
    parent.removeEventListener('contextmenu', onContextMenu)
  }
})

function onContextMenu(event: Event) {
  event.preventDefault()
  shown.value = true
}

function onClickAway(event: Event) {
  const target = event.target as HTMLElement
  if (!element.value?.contains(target)) {
    shown.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.context-menu {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .inner {
    position: absolute;
    pointer-events: all;
    border: 1px solid var(--gray-300);
    border-radius: var(--b-radius-sm);
    overflow: hidden;
  }
}

.context-menu-anim {
  &-enter-active,
  &-leave-active {
    transition: var(--general-transition);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
