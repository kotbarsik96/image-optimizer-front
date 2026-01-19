import type { IProjectResult } from '@/interfaces/Projects/IProjectResult'

export interface IProject {
  id: number
  name: string
  date: string
  results?: IProjectResult[]
}
