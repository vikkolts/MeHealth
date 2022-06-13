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
// restore user selected lang
const lsLang = localStorage.getItem('mehealth-lang');
document.documentElement.setAttribute('data-color-scheme', store.appTheme === 'Dark' ? 'dark' : store.appTheme === 'Light' ? 'light' : 'system');
//document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'true' ? '#373c49' : '#ffffff');
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
    <!-- <transition :name="route.meta.transition as string || 'fade'">
      <component :is="Component"
        :key="route.path" />
    </transition> -->
    <component :is="Component"
      :key="route.path" />
  </router-view>
  <ReloadPrompt />
</template>

<style>
@import '@/assets/base.css';
</style>
