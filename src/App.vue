<script setup lang="ts">
import { RouterView } from 'vue-router'
import './index.css'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { useI18n } from 'vue-i18n'
import {
  setI18nLanguage,
  loadLocaleMessages,
} from './i18n'
import TheHeader from './components/TheHeader.vue'
import { onMounted } from 'vue'
import { useAppSettingsStore } from './stores/appSettings'

const { availableLocales, } = useI18n()
const store = useAppSettingsStore();
// restore theme
document.documentElement.setAttribute('data-color-scheme', store.appTheme === 'Dark' ? 'dark' : store.appTheme === 'Light' ? 'light' : 'system');
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', store.appTheme === 'Dark' || store.appTheme === 'System' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#000000' : '#f2f1f6');
// restore user selected lang
const lsLang = localStorage.getItem('mehealth-lang');
onMounted(async () => {
  const lang = lsLang || 'en'
  if (!availableLocales.includes(lang)) {
    await loadLocaleMessages(lang);
  }
  setI18nLanguage(lang);
  document.documentElement.setAttribute('lang', lang);
})
</script>
<template>
  <TheHeader />
  <router-view v-slot="{ Component, route }">
    <!-- Use any custom transition and fallback to `fade` -->
    <transition :name="route.meta.transition as string || undefined"
      mode="out-in">
      <component :is="Component"
        :key="route.path" />
    </transition>
    <!-- <component :is="Component"
      :key="route.path" /> -->
  </router-view>
  <ReloadPrompt />
</template>

<style>
@import '@/assets/base.css';

.slide-left-enter-active {
  transition: all 0.1s ease-out;
}

.slide-left-leave-active {
  transition: all 0.1s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-20px);
}
</style>
