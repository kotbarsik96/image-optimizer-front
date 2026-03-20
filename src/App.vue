<template>
  <div class="wrapper">
    <RouterView />
    <NotificationsContainer />
  </div>
</template>

<script setup lang="ts">
import { useBodyScrollLocker } from '@/composables/BodyScrollLocker/useBodyScrollLock'
import NotificationsContainer from '@/components/_UI/notifications/NotificationsContainer.vue'

useBodyScrollLocker()
</script>

<style>
@import '@/css/variables/colors.scss';
@import '@/css/variables/fonts-variables.scss';
@import '@/css/variables/sizes.scss';
@import '@/css/variables/transitions.scss';

@import '@/css/base/null.scss';
@import '@/css/base/fonts.scss';
@import '@/css/base/general.scss';

@import '@/css/animations/general.scss';
</style>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.wrapper {
  padding-block: 60px;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
</style>
