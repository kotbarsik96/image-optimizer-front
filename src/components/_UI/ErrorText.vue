<template>
  <div class="error" :class="classes">
    <Transition name="anim-dropdown">
      <div v-if="error" class="inner">{{ error }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  error?: string
}>()

const classes = computed(() => ({
  '--shown': !!props.error,
}))
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.error {
  text-align: center;
  font: var(--text-medium-18);
  color: var(--error);

  .inner {
    padding-block-start: 1rem;
  }
}
</style>
