<template>
  <DialogWindow class="cp-nd" v-model="model">
    <div class="dialog-title">{{ $t('project.changeName') }}</div>
    <TextInputWrapper>
      <TextInput v-model="name" placeholder="Название проекта" />
    </TextInputWrapper>
    <div class="dialog-buttons">
      <ButtonGeneral @click="save">
        <IconSave />
        {{ $t('general.save') }}
      </ButtonGeneral>
      <ButtonGeneral button-style="error" @click="close">
        {{ $t('general.cancel') }}
      </ButtonGeneral>
    </div>
  </DialogWindow>
</template>

<script setup lang="ts">
import DialogWindow from '@/components/_UI/dialog/DialogWindow.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import TextInput from '@/components/_UI/text-inputs/TextInput.vue'
import { ref } from 'vue'
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import IconSave from '@/assets/icons/save.svg'

const model = defineModel({ type: Boolean, default: false })
const name = ref('')

function close() {
  model.value = false
}

function save() {
  close()
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.cp-nd {
  --max-window-width: 320px;
}
</style>
