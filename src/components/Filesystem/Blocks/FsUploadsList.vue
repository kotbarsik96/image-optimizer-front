<template>
  <div v-if="imagesPreview.length > 0" class="uploads">
    <div v-if="title" class="u-title">{{ title }}</div>
    <div class="u-list">
      <div v-for="(img, i) in imagesPreview" class="u-wrap">
        <button class="uw-remove" type="button" @click="removeFile(i)">
          <CloseIcon />
        </button>
        <img :src="img.src" :alt="img.alt" draggable="false" />
        <div class="uw-text">{{ img.alt }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CloseIcon from '@/assets/icons/close.svg'

const props = defineProps<{
  title?: string
  files?: Array<File>
}>()

const emit = defineEmits<{
  (e: 'update:files', files: Array<File>): void
}>()

const imagesPreview = computed(() =>
  images.value.map((i) => ({
    src: URL.createObjectURL(i),
    alt: i.name,
  })),
)

const images = computed(() => {
  return props.files?.filter((i) => i.type.startsWith('image')) ?? []
})

function removeFile(index: number) {
  const updated = images.value.filter((_, i) => i !== index) ?? []
  emit('update:files', updated)
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.uploads {
  .u-title {
    font: var(--text-medium-21);
    text-align: center;
    padding-block: 1rem;
  }

  .u-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  .u-wrap {
    img {
      width: 200px;
      border-radius: 4px;
    }
  }

  .uw-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 0.25rem;

    svg {
      color: var(--text);
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
    }
  }

  .uw-text {
    text-align: center;
    font: var(--text-medium-16);
  }
}
</style>
