import type { IImageEntity } from '@/api/entities/Image/IImageEntity'
import type { EStorage } from '@/enums/EStorage'

export interface IFolderEntity {
  id: number
  project_id?: number
  optimization_id?: number
  path: string
  parent_id?: number
  nested?: IFolderEntity[]
  images?: IImageEntity[]
  storage: EStorage
  created_at: string
  updated_at: string
}
