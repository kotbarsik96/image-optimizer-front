import { ref, watch, type ModelRef, type Ref } from 'vue'
import { useBodyScrollLock } from '@/composables/BodyScrollLocker/useBodyScrollLock'

export function useDialog(
  closeModel: ModelRef<boolean, string, boolean, boolean>,
  dialogEl: Ref<HTMLDialogElement | null>,
) {
  const { lock: lockBody, unlock: unlockBody } = useBodyScrollLock()
  const dialogShown = ref(false)

  function openDialog() {
    if (dialogEl.value) {
      dialogShown.value = true
      lockBody()
      dialogEl.value.showModal()
      closeModel.value = true
    }
  }

  function closeDialog() {
    unlockBody()
    if (dialogEl.value) {
      dialogShown.value = false
      dialogEl.value.close()
      closeModel.value = false
    }
  }

  function closeDialogOnOuterClick(event: Event) {
    if (!dialogEl.value) return
    const target = event.target
    if (target == dialogEl.value!) closeDialog()
  }

  watch(closeModel, (value) => {
    if (value) {
      openDialog()
    } else {
      closeDialog()
    }
  })

  return {
    openDialog,
    closeDialog,
    closeDialogOnOuterClick,
  }
}
