import type { IImageEntityBase } from '@/api/entities/Image/IImageEntityBase'
import type { EStorage } from '@/enums/EStorage'

export interface IImageEntity extends IImageEntityBase {
  folder_id: number
  key: string
  size_bytes: number
  width: number
  height: number
  storage: EStorage
  created_at: string
  updated_at: string
}
