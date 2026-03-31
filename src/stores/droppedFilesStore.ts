import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDroppedFilesStore = defineStore('dropped-files', () => {
  const uploadFolderFiles = ref<File[]>([])
  const newProjectFiles = ref<File[]>([])

  return {
    uploadFolderFiles,
    newProjectFiles,
  }
})
