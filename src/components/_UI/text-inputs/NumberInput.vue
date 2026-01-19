<template>
  <div class="t-input">
    <input
      inputmode="numeric"
      type="text"
      :value="shownValue"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInteraction"
      @change="onInteraction"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number // минимальное число
    max?: number // максимальное число
    maxFractionDigits?: number // количество символов после точки
    modelValue?: number
    error?: string
  }>(),
  {
    min: 0,
    max: 99999999,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const isFocused = ref(false)
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

const _maxFractionDigits = computed(() =>
  props.maxFractionDigits && props.maxFractionDigits > 0 ? props.maxFractionDigits : 0,
)

const _modelValue = computed(() => (!!props.modelValue ? props.modelValue : 0))

const _shownValue = ref(round(_modelValue.value, _maxFractionDigits.value))
const shownValue = computed({
  get() {
    let value = _shownValue.value
    let numValue = _modelValue.value
    if (numValue < props.min && isFocused.value) {
      value = props.min.toString()
      numValue = props.min
    }
    if (numValue > props.max && isFocused.value) {
      value = props.max.toString()
      numValue = props.max
    }

    const isOuterInput = Number(value) !== numValue && value !== '-'

    let fractionDigits = Math.min(
      numValue.toString().split('.')[1]?.length ?? 0,
      _maxFractionDigits.value,
    )

    // если ввод вида "-" | "-0" | "3." | "3.0" | "3.40" - дать пользователю закончить ввод
    const isFinalValue =
      value.match(/^-0?$/) == null &&
      value.match(/(\d)+\.0*$/) == null &&
      value.match(/(\d)+\.\d*0+$/) == null

    // изменение props.modelValue извне
    if (isOuterInput) {
      value = (numValue + Number.EPSILON).toFixed(fractionDigits)
    }
    // ввод непосредственно через input
    else if (isFinalValue) {
      // если пользователь завершил ввод - корректно округлить число и вывести его
      value = round(numValue, fractionDigits)
    }

    if (isFinalValue && !isFocused.value) {
      value = Number(value)
        .toLocaleString('en-EN', { maximumFractionDigits: props.maxFractionDigits })
        .replace(/,/g, ' ')
    }

    return value
  },
  set(value: string) {
    // замена "0" на "-"
    if (props.min < 0 && value.startsWith('0-')) {
      _shownValue.value = '-'
      emit('update:modelValue', Math.max(props.min, 0))
    }
    // обновление корректного числа
    else if (value.match(symbolsRegexp.value)) {
      let num = Number(value)
      if (isNaN(num)) num = 0
      num = handleMinMax(num)

      _shownValue.value = value === '' ? '0' : value
      emit('update:modelValue', num)
    }
    // некорректный новый ввод - оставить предыдущее значение
    else {
      _shownValue.value = _shownValue.value
    }
  },
})

/* разрешенные символы:
 * 0-9 всегда
 * если _maxFractionDigits > 0 разрешить ".",
 * если разрешен ввод отрицательных чисел, разрешить "-"
 */
const symbolsRegexp = computed(() => {
  const minusSign = props.min < 0 ? '-?' : ''

  let integerLength = 20
  if (isFocused.value) {
    const maxStringified = Number(props.max.toFixed(0)).toLocaleString().replace(/\D/g, '')
    integerLength = maxStringified.length
  }

  let decimalRegexpPart = ''
  if (_maxFractionDigits.value > 0) {
    decimalRegexpPart += '\\.?'
    decimalRegexpPart += `\\d{0,${_maxFractionDigits.value}}`
  }

  return new RegExp(`^${minusSign}\\d{0,${integerLength}}${decimalRegexpPart}$`)
})

function onInteraction(event: Event) {
  const target = event.target as HTMLInputElement
  const startValue = shownValue.value
  const startPosition = target.selectionStart ?? target.value.length

  shownValue.value = target.value
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

/** не дать ввести меньше props.min и больше props.max */
function handleMinMax(numValue: number): number {
  let _v = handleMin(numValue)
  _v = handleMax(numValue)
  return _v
}

function handleMin(numValue: number): number {
  if (numValue < props.min && isFocused.value) numValue = props.min
  return numValue
}

function handleMax(numValue: number): number {
  if (numValue > props.max && isFocused.value) numValue = props.max
  return numValue
}

function round(num: number, maxFractionDigits: number) {
  return Number((num + Number.EPSILON).toFixed(maxFractionDigits)).toString()
}
</script>

<style lang="scss" scoped>
@use '@/css/components/TextInput.scss';
</style>
