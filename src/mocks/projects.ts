import { EExtensions } from '@/interfaces/_General/EExtensions'
import type { IProject } from '@/interfaces/Projects/IProject'

export const projects: IProject[] = [
  {
    id: 1,
    name: 'Test project',
    date: '2026-01-01 15:53',
    results: [
      {
        id: 1,
        date: '2026-01-01 15:54',
        extension: EExtensions.AVIF,
        ready_percentage: 15,
        scale_percentage: 100,
      },
    ],
  },
]
