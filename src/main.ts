import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { Tooltip } from 'primevue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import './styles/main.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

const hrdPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: ' {violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
  },
})
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: hrdPreset,
    options: {
      darkModeSelector: '.hrd-dark',
    },
  },
})
app.directive('tooltip', Tooltip)
app.use(ToastService)
app.mount('#app')
