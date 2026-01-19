import type { EExtensions } from '@/interfaces/_General/EExtensions'

export interface IProjectResult {
  id: number
  date: string
  ready_percentage: number
  extension: EExtensions
  scale_percentage: number
}
