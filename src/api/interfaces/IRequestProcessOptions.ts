import type { ServerStatuses } from '@/api/ServerStatuses'

export interface IRequestProcessOptions {
  /** true == не показывать нотификацию при ошибке */
  noErrorNotifications?: boolean

  /** Уточнение ошибки: для каждого кода указывается отдельный текст */
  errorMessages?: TErrorMessages
}

export type TErrorMessages = Record<ServerStatuses, string>
