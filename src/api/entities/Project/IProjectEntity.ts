import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import type { IOptimizationEntity } from '@/api/entities/Optimization/IOptimizationEntity'

export interface IProjectEntity {
  id: number
  uploader_id: number
  folders: IFolderEntity[]
  optimizations: IOptimizationEntity[]
  title: string
  root_folder?: IFolderEntity
  created_at: string
  updated_at: string
}
