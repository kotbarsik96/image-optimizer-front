<template>
  <div class="load-area" :class="classes">
    <button class="la-button" @click="showDialog">
      <component :is="icon" />
      {{ text }}
    </button>
    <NewProjectDialog v-model="dialogShown" />
  </div>
</template>

<script setup lang="ts">
import IconPlus from '@/assets/icons/plus-circle.svg'
import IconUpload from '@/assets/icons/upload.svg'
import NewProjectDialog from '@/components/Projects/_UI/NewProjectDialog.vue'
import { useDragFiles } from '@/composables/useDragFiles'
import { useToggler } from '@/composables/useToggler'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { isShown: dialogShown, show: showDialog } = useToggler()

const { isDragging } = useDragFiles({
  onDrop: (event) => {
    event.preventDefault()
  },
})

const icon = computed(() => {
  return isDragging.value ? IconUpload : IconPlus
})

const text = computed(() => {
  return isDragging.value ? t('general.dropFilesHere') : t('general.newProject')
})

const classes = computed(() => ({
  '--drop': isDragging.value,
}))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.load-area {
  width: 200px;
  height: auto;
  aspect-ratio: 1;

  .la-button {
    cursor: pointer;
    border-radius: 8px;
    background-color: var(--gray-100);
    border: 2px solid var(--gray-400);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font: var(--text-medium-21);
    text-align: center;
    gap: 0.625rem;
    transition: var(--general-transition);

    svg {
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
    }
  }

  .la-button:hover,
  &.--drop .la-button {
    border-color: var(--primary);
    background-color: var(--primary);
    box-shadow: var(--shadow-2);
    color: var(--white);
  }

  .la-input {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    z-index: -999;
  }
}
</style>
