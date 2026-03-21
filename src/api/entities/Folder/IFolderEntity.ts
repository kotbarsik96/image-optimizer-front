import type { IImageEntity } from '@/api/entities/Image/IImageEntity'

export interface IFolderEntity {
  id: number
  project_id?: number
  optimization_id?: number
  path: string
  parent_id?: number
  nested?: IFolderEntity[]
  images?: IImageEntity[]
  created_at: string
  updated_at: string
}
