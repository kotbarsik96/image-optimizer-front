<template>
  <input
    inputmode="decimal"
    type="text"
    :value="shownValue"
    autocomplete="off"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInteraction"
    @change="onInteraction"
  />
</template>

<script lang="ts" setup>
import { useNumberInput } from '@/composables/useNumberInput'
import { computed, nextTick, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number // минимальное число
    max?: number // максимальное число
    maxFractionDigits?: number // количество символов после точки
    error?: string
  }>(),
  {
    min: 0,
    max: 99999999,
  },
)

const model = defineModel<number>({ default: 0 })

const _maxFractionDigits = computed(() =>
  props.maxFractionDigits && props.maxFractionDigits > 0 ? props.maxFractionDigits : 0,
)

const isFocused = ref(false)

const { getShownValue, setShownValue, round } = useNumberInput({
  min: () => props.min,
  max: () => props.max,
  isFocused,
  maxFractionDigits: _maxFractionDigits,
  model,
})

const onFocus = (event: FocusEvent) => {
  isFocused.value = true

  setTimeout(() => {
    const target = event.target as HTMLInputElement
    target.setSelectionRange(target.value.length, target.value.length)
  }, 0)
}
const onBlur = () => {
  isFocused.value = false
}

const _shownValue = ref(model.value ? round(model.value, _maxFractionDigits.value) : '')
const shownValue = computed({
  get() {
    return getShownValue(_shownValue.value)
  },
  set(value: string) {
    const { shownValue, updatedModel } = setShownValue(value, _shownValue.value)
    _shownValue.value = shownValue
    model.value = updatedModel
  },
})

function onInteraction(event: Event) {
  const target = event.target as HTMLInputElement
  const startValue = shownValue.value.replace(',', '.')
  const startPosition = target.selectionStart ?? target.value.length

  shownValue.value = target.value.replace(',', '.')
  target.value = shownValue.value
  nextTick().then(() => {
    const valueChanged = startValue !== shownValue.value
    if (target.value === '0') target.setSelectionRange(1, 1)
    else {
      if (valueChanged) target.setSelectionRange(startPosition, startPosition)
      else target.setSelectionRange(startPosition - 1, startPosition - 1)
    }
  })
}
</script>

<style lang="scss" scoped>
@use '@/css/components/TextInput.scss';
</style>
