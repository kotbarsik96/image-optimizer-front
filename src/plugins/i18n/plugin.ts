import { createI18n } from 'vue-i18n'
import ru from '@/plugins/i18n/ru.json'

export const i18nPlugin = createI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  availableLocales: ['ru'],
  messages: {
    ru,
  },
})
