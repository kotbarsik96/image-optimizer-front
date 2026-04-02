<template>
  <div class="ni-group">
    <div v-if="label" class="label">{{ label }}</div>
    <div class="inputs">
      <TextInputWrapper
        v-for="i in inputsCount"
        :input-id="`${inputsId}-${i}`"
        :label="getLabel(i)"
      >
        <NumberInput
          v-model="model[i - 1]"
          :id="`${inputsId}-${i}`"
          :min="0"
          :max="100"
          placeholder="50"
          autocomplete="off"
        />
        <ButtonGeneral
          v-if="i !== 1"
          class="ir-button --delete"
          type="button"
          button-style="error"
          @click="removeInput(i - 1)"
        >
          <IconDelete />
        </ButtonGeneral>
      </TextInputWrapper>
    </div>
    <ButtonGeneral v-if="inputsCount < maxInputsCount" class="new-row-btn" @click="addInput">
      {{ $t('general.addValue') }}
    </ButtonGeneral>
  </div>
</template>

<script setup lang="ts">
import ButtonGeneral from '@/components/_UI/buttons/ButtonGeneral.vue'
import TextInputWrapper from '@/components/_UI/text-inputs/TextInputWrapper.vue'
import NumberInput from '@/components/_UI/text-inputs/NumberInput.vue'
import IconDelete from '@/assets/icons/delete.svg'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  label?: string
  maxInputsCount: number
  defaultInputCount?: number
  inputsId: string
  inputsLabel: string
}>()

const { t, te } = useI18n()

const inputsCount = ref(props.defaultInputCount ?? 1)

const model = defineModel<number[]>({ default: [] })

function addInput() {
  inputsCount.value++
}

function removeInput(index: number) {
  if (index === 0) return
  inputsCount.value--
  model.value = model.value.filter((_, i) => i !== index)
}

function getLabel(n: number) {
  if (te(props.inputsLabel)) return t(props.inputsLabel, [n])
  else return `${props.inputsLabel} ${n}`
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';

.ni-group {
  .inputs {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .ir-button {
    flex-shrink: 0;
    padding: 0;
    width: 2rem;
    height: auto;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      position: relative;
      top: 0;
      left: 0;
      color: var(--white);
    }
  }

  :deep(.ti-input) {
    display: flex;
    align-items: center;
    gap: 0.625rem;

    input {
      max-width: 5rem;
      padding-inline-start: 15px;
      padding-inline-end: 15px;
      text-align: center;
    }
  }

  .new-row-btn {
    margin-block-start: 1rem;
  }
}
</style>
