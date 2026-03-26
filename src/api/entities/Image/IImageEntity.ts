import type { IImageEntityBase } from '@/api/entities/Image/IImageEntityBase'

export interface IImageEntity extends IImageEntityBase {
  folder_id: number
  key: string
  extension: string
  size_bytes: number
  width: number
  height: number
  storage: string
  created_at: string
  updated_at: string
}
