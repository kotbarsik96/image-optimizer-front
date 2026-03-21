import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'

export interface IOptimizationEntity {
  id: number
  project_id: number
  title: string
  extensions: string
  sizes: string
  folders?: IFolderEntity[]
  root_folder?: IFolderEntity
  created_at: string
  updated_at: string
}
