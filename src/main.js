import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import { Button, InputText, Select, Textarea, Dialog, DataTable, Column, Message, Tag, Toast } from 'primevue';
import ToastService from 'primevue/toastservice';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './style.css';
import App from './app.vue';
import router from './router.js';
import pinia from './pinia.js';
import i18n from './i18n.js';

const FleetProof = definePreset(Material, {
  semantic: { primary: { 50: '#E8F2FF', 100: '#E8F2FF', 200: '#E8F2FF', 300: '#0B6FE8', 400: '#0B6FE8', 500: '#0B6FE8', 600: '#0B6FE8', 700: '#08254A', 800: '#08254A', 900: '#0B2447', 950: '#0B2447' } }
});
const app = createApp(App).use(pinia).use(i18n).use(router)
  .use(PrimeVue, { theme: { preset: FleetProof, options: { darkModeSelector: false } }, ripple: true, license: import.meta.env.VITE_PRIME_UI_LICENSE_KEY })
  .use(ToastService);
for (const [name, component] of Object.entries({ Button, InputText, Select, Textarea, Dialog, DataTable, Column, Message, Tag, Toast })) {
  app.component('pv-' + name.replace(/[A-Z]/g, (letter, index) => (index ? '-' : '') + letter.toLowerCase()), component);
}
app.mount('#app');
