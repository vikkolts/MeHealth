<script setup lang="ts">
import { RouterView } from 'vue-router'
import './index.css'
import ReloadPrompt from './components/ReloadPrompt.vue'
// import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  SUPPORT_LOCALES,
  setI18nLanguage,
  loadLocaleMessages,
} from './i18n'
import TheHeader from './components/TheHeader.vue'
import { onMounted } from 'vue'

// Temporary force uk lang on startup
const { locale, availableLocales, } = useI18n()
onMounted(async () => {
  if (!availableLocales.includes('uk')) {
    await loadLocaleMessages('uk');
  }
  setI18nLanguage('uk');
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
