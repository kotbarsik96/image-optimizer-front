import type { ButtonStyle } from '@/interfaces/UI/Button'
import { computed } from 'vue'

export function useButtonClass(props: {
  buttonStyle: ButtonStyle
  disabled?: boolean
  iconOnly?: boolean
  isLoading?: boolean
}) {
  return computed(() => [
    `--${props.buttonStyle}`,
    { '--disabled': props.disabled, '--icon-only': props.iconOnly, '--loading': props.isLoading },
  ])
}
