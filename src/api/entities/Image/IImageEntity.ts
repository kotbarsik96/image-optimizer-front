export interface IImageEntity {
  id: number
  folder_id: number
  s3_url: string
  bucket: string
  key: string
  extension: string
  filename: string
  url: string
  size_bytes: number
  width: number
  height: number
  created_at: string
  updated_at: string
}
