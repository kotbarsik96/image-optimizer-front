import { onMounted, onUnmounted, ref } from 'vue'

export function useDragFiles(callbacks: {
  onOver?: (event: DragEvent) => void
  onLeave?: (event: DragEvent) => void
  onDrop?: (event: DragEvent) => void
}) {
  const isDragging = ref(false)

  onMounted(() => {
    document.body.addEventListener('dragover', _onOver)
    document.body.addEventListener('drop', _onDrop)
    window.addEventListener('drop', windowDrop)
    document.body.addEventListener('dragleave', _onLeave)
  })

  onUnmounted(() => {
    document.body.removeEventListener('dragover', _onOver)
    document.body.removeEventListener('drop', _onDrop)
    window.removeEventListener('drop', windowDrop)
    document.body.removeEventListener('dragleave', _onLeave)
  })

  function _onOver(event: DragEvent) {
    event.preventDefault()
    isDragging.value = true
    if (typeof callbacks.onOver == 'function') callbacks.onOver(event)
  }

  function _onDrop(event: DragEvent) {
    isDragging.value = false
    if (typeof callbacks.onDrop == 'function') callbacks.onDrop(event)
  }

  function _onLeave(event: DragEvent) {
    isDragging.value = false
    if (typeof callbacks.onLeave == 'function') callbacks.onLeave(event)
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
