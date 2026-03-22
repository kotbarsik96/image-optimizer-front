import { watch, type Directive, type WatchHandle } from 'vue'

const vAutofocusWatchers = new Map<HTMLInputElement, WatchHandle>()

export const vAutofocus: Directive = {
  mounted(el: HTMLInputElement, binding) {
    const shown = binding.value.shown
    const watcher = watch(shown, async (s) => {
      setTimeout(() => {
        if (s) el.focus()
      }, 250)
    })
    vAutofocusWatchers.set(el, watcher)
  },
  unmounted(el: HTMLInputElement) {
    const watcher = vAutofocusWatchers.get(el)
    if (typeof watcher == 'function') watcher()
  },
}
