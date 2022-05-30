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
  <header>

    <form class="language">
      <label for="locale-select">Language</label>
      <select id="locale-select"
        v-model="currentLocale">
        <option v-for="optionLocale in SUPPORT_LOCALES"
          :key="optionLocale"
          :value="optionLocale">
          {{ optionLocale }}
        </option>
      </select>
    </form>
  </header>

  <main>
    <RouterView />
  </main>
  <ReloadPrompt />
</template>

<style>
@import '@/assets/base.css';
</style>
