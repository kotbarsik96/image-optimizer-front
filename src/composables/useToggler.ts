import { ref } from 'vue'

export function useToggler() {
  const isShown = ref(false)

  function toggle() {
    isShown.value ? hide() : show()
  }

  function show() {
    isShown.value = true
  }

  function hide() {
    isShown.value = false
  }

  return { isShown, toggle, show, hide }
}
