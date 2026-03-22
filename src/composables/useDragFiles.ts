import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter } from 'vue'

export function useDragFiles(options: {
  dropTarget: MaybeRefOrGetter<HTMLElement | null>
  onOver?: (event: DragEvent) => void
  onLeave?: (event: DragEvent) => void
  onDrop?: (event: DragEvent) => void
}) {
  const isDragging = ref(false)

  onMounted(() => {
    const target = toValue(options.dropTarget)
    if (!target) return

    target.addEventListener('dragover', _onOver)
    target.addEventListener('drop', _onDrop)
    window.addEventListener('drop', windowDrop)
    target.addEventListener('dragleave', _onLeave)
  })

  onUnmounted(() => {
    const target = toValue(options.dropTarget)
    if (!target) return

    target.removeEventListener('dragover', _onOver)
    target.removeEventListener('drop', _onDrop)
    window.removeEventListener('drop', windowDrop)
    target.removeEventListener('dragleave', _onLeave)
  })

  function _onOver(event: DragEvent) {
    event.preventDefault()
    isDragging.value = true
    if (typeof options.onOver == 'function') options.onOver(event)
  }

  function _onDrop(event: DragEvent) {
    isDragging.value = false
    if (typeof options.onDrop == 'function') options.onDrop(event)
  }

  function _onLeave(event: DragEvent) {
    isDragging.value = false
    if (typeof options.onLeave == 'function') options.onLeave(event)
  }

  function windowDrop(event: DragEvent) {
    const items = event.dataTransfer?.items || []
    if ([...items].some((item) => item.kind === 'file')) {
      event.preventDefault()
    }
  }

  return {
    isDragging,
  }
}
