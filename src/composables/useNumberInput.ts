import { computed, toValue, type MaybeRefOrGetter } from 'vue'

/** composable-helper для NumberInput. Предоставляет функции для вспомогательных операций
 *
 * использует параметры (params) только для чтения, не изменяя их
 */
export function useNumberInput(params: {
  min: MaybeRefOrGetter<number>
  max: MaybeRefOrGetter<number>
  maxFractionDigits: MaybeRefOrGetter<number>
  isFocused: MaybeRefOrGetter<boolean>
  model: MaybeRefOrGetter<number>
}) {
  const min = computed(() => toValue(params.min))
  const max = computed(() => toValue(params.max))
  const maxFractionDigits = computed(() => toValue(params.maxFractionDigits))
  const isFocused = computed(() => toValue(params.isFocused))
  const model = computed(() => toValue(params.model))

  /* разрешенные символы:
   * 0-9 всегда
   * если maxFractionDigits > 0 разрешить ".",
   * если разрешен ввод отрицательных чисел, разрешить "-"
   */
  const symbolsRegexp = computed(() => {
    const minusSign = min.value < 0 ? '-?' : ''

    let integerLength = 20
    if (isFocused.value) {
      integerLength = Math.trunc(Math.abs(max.value)).toString().length
    }

    let decimalRegexpPart = ''
    if (maxFractionDigits.value > 0) {
      decimalRegexpPart += '\\.?'
      decimalRegexpPart += `\\d{0,${maxFractionDigits.value}}`
    }

    return new RegExp(`^${minusSign}\\d{0,${integerLength}}${decimalRegexpPart}$`)
  })

  function getShownValue(value: string) {
    let numValue = model.value

    if (numValue < min.value && isFocused.value) {
      value = min.value.toString()
      numValue = min.value
    }
    if (numValue > max.value && isFocused.value) {
      value = max.value.toString()
      numValue = max.value
    }

    const isOuterInput = Number(value) !== numValue && value !== '-'

    let fractionDigits = Math.min(
      numValue.toString().split('.')[1]?.length ?? 0,
      maxFractionDigits.value,
    )

    // если ввод вида "-" | "-0" | "3." | "3.0" | "3.40" - дать пользователю закончить ввод
    const isFinalValue =
      value !== '' &&
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
        .toLocaleString('en-EN', { maximumFractionDigits: maxFractionDigits.value })
        .replace(/,/g, ' ')
    }

    return value
  }

  function setShownValue(newValue: string, currentShownValue: string) {
    let shownValue = ''
    let updatedModel = model.value

    // отрезать лишнюю часть после точки (например, при вставке)
    const fractionLength = newValue.split('.').at(1)?.length ?? 0
    if (fractionLength > maxFractionDigits.value) {
      const num = Number(newValue)
      if (!isNaN(num)) newValue = round(num, maxFractionDigits.value)
    }

    // замена "0" на "-"
    if (min.value < 0 && newValue.startsWith('0-')) {
      shownValue = '-'
      Math.max(min.value, 0)
    }
    // обновление корректного числа
    else if (newValue.match(symbolsRegexp.value)) {
      if (newValue === '') {
        shownValue = ''
        updatedModel = 0
      } else {
        let num = Number(newValue)
        if (isNaN(num)) num = 0
        const handledNum = handleMinMax(num, Number(currentShownValue))
        const handledNumIsChanged = handledNum !== num

        shownValue = handledNumIsChanged ? handledNum.toString() : newValue
        updatedModel = handledNum
      }
    }
    // некорректный новый ввод - оставить предыдущее значение
    else {
    }

    return {
      shownValue,
      updatedModel,
    }
  }

  function round(num: number, maxFractionDigits: number) {
    return Number((num + Number.EPSILON).toFixed(maxFractionDigits)).toString()
  }

  /** не дать ввести меньше props.min и больше props.max */
  function handleMinMax(numValue: number, prevValue: number): number {
    let _v = handleMin(numValue, prevValue)
    _v = handleMax(_v, prevValue)
    return _v
  }

  function handleMin(numValue: number, prevValue: number): number {
    if (numValue < min.value && isFocused.value) {
      if (prevValue >= min.value) numValue = prevValue
      else numValue = min.value
    }
    return numValue
  }

  function handleMax(numValue: number, prevValue: number): number {
    if (numValue > max.value && isFocused.value) {
      if (prevValue <= max.value) numValue = prevValue
      else numValue = max.value
    }
    return numValue
  }

  return {
    getShownValue,
    setShownValue,
    round,
    handleMinMax,
    handleMin,
    handleMax,
    symbolsRegexp,
  }
}
