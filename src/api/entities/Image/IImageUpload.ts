import type { IImageEntity } from '@/api/entities/Image/IImageEntity'

export interface IImageUpload {
  error?: string
  image: IImageEntity
}
