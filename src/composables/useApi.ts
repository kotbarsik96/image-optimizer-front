import { inject, type App } from 'vue'
import { Api } from '@/api/Api'

const API_KEY = Symbol('api')

export function provideApi(app: App): Api {
  const api = new Api(import.meta.env.VITE_API_URL)
  app.provide(API_KEY, api)
  return api
}

export function useApi(): Api {
  const api = inject(API_KEY) as Api | undefined
  if (!api) {
    throw new Error('API not provided')
  }
  return api
}
