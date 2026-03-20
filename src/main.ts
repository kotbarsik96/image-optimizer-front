import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18nPlugin } from '@/plugins/i18n/plugin'

import App from './App.vue'
import router from './router'
import { provideApi } from '@/composables/useApi'

const app = createApp(App)

app.use(createPinia()).use(router).use(i18nPlugin)

provideApi(app)

app.mount('#app')
