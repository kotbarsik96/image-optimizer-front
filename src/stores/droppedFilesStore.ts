import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDroppedFilesStore = defineStore('dropped-files', () => {
  const folderImageFiles = ref<File[]>([])
  const newProjectImageFiles = ref<File[]>([])

  return {
    folderImageFiles,
    newProjectImageFiles,
  }
})
