import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { registerSW } from 'virtual:pwa-register';
import { i18n } from './i18n';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Need refresh');
  },
  onOfflineReady() {
    console.log('Offline ready');
  },
  onRegisterError(error: any) {
    console.log('Error occurred');
  },
});

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount('#app');
