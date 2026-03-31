import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export interface IDragFilesOptions {
  dropTarget: MaybeRefOrGetter<HTMLElement | null>
  onOver?: (event: DragEvent) => void
  onLeave?: (event: DragEvent) => void
  onDrop?: (event: DragEvent) => void
}

export function useDragFiles(options: IDragFilesOptions) {
  const isDragging = ref(false)

  let leaveTimeout: ReturnType<typeof setTimeout>

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
    if (leaveTimeout) clearTimeout(leaveTimeout)

    event.preventDefault()
    isDragging.value = true
    if (typeof options.onOver == 'function') options.onOver(event)
  }

  function _onDrop(event: DragEvent) {
    isDragging.value = false
    event.preventDefault()
    if (typeof options.onDrop == 'function') options.onDrop(event)
  }

  function _onLeave(event: DragEvent) {
    if (leaveTimeout) clearTimeout(leaveTimeout)

    leaveTimeout = setTimeout(() => {
      isDragging.value = false
      event.preventDefault()
      if (typeof options.onLeave == 'function') options.onLeave(event)
    }, 250)
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

export function useImagesDragNDrop(options: IDragFilesOptions, filesRef: Ref<File[]>) {
  const overrideOptions: IDragFilesOptions = {
    onDrop: (event) => {
      const images = Array.from(event.dataTransfer?.files || []).filter((i) =>
        i.type.startsWith('image'),
      )
      if (images.length < 1) return

      filesRef.value = images

      if (typeof options.onDrop == 'function') options.onDrop(event)
    },
  } as IDragFilesOptions

  const _options = Object.assign({ ...options }, overrideOptions)

  return useDragFiles(_options)
}
