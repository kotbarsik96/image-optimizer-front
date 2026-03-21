import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18nPlugin } from '@/plugins/i18n/plugin'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { provideApi } from '@/composables/useApi'
import { vueQueryPluginOptions } from '@/plugins/tanstack-vuequery/plugin'

const app = createApp(App)

app.use(createPinia()).use(router).use(i18nPlugin).use(VueQueryPlugin, vueQueryPluginOptions)

provideApi(app)

app.mount('#app')
