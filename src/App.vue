<script setup lang="ts">
import { RouterView } from 'vue-router'
import './index.css'
import ReloadPrompt from './components/ReloadPrompt.vue'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  SUPPORT_LOCALES,
  setI18nLanguage,
  loadLocaleMessages,
} from './i18n'
import TheHeader from './components/TheHeader.vue'

const { locale, availableLocales, } = useI18n()
const currentLocale = ref(locale.value)

/**
 * when the changes are detected, load the locale message and set the language
 */
watch(currentLocale, async (val) => {
  if (!availableLocales.includes(val)) {
    await loadLocaleMessages(val);
  }
  setI18nLanguage(val);
})
</script>
<template>
  <TheHeader />
  <main>
    <router-view v-slot="{ Component, route }">
      <!-- Use any custom transition and fallback to `fade` -->
      <transition :name="route.meta.transition as string || 'fade'">
        <component :is="Component"
          :key="route.path" />
      </transition>
    </router-view>
  </main>
  <ReloadPrompt />
</template>

<style>
@import '@/assets/base.css';
</style>
