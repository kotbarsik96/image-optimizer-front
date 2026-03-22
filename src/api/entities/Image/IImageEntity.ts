import type { IImageEntityBase } from '@/api/entities/Image/IImageEntityBase'

export interface IImageEntity extends IImageEntityBase {
  folder_id: number
  s3_url: string
  bucket: string
  key: string
  extension: string
  size_bytes: number
  width: number
  height: number
  created_at: string
  updated_at: string
}
