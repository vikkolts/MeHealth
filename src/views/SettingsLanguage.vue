<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import ListItem from "@/components/ListItem.vue";
import IconCheck20 from "../components/icons/IconCheck20.vue";
import { useAppSettingsStore, type LangType } from "@/stores/appSettings";
import { useI18n } from "vue-i18n";
import { loadLocaleMessages, setI18nLanguage, SUPPORT_LOCALES } from "@/i18n";

const appStore = useAppSettingsStore();
const { locale, availableLocales } = useI18n()

/**
 * when the changes are detected, load the locale message and set the language
 */
async function changeLang(val: LangType) {
  if (!availableLocales.includes(val)) {
    await loadLocaleMessages(val);
  }
  setI18nLanguage(val);
  appStore.setLang(val);
}
</script>

<template>
  <main>
    <PageHeader :title="$t('Language')"
      with-back-button />
    <div class="list-group">
      <ListItem v-for="optionLocale in SUPPORT_LOCALES"
        :key="optionLocale"
        @click="changeLang(optionLocale as LangType)">
        {{ optionLocale === 'en' ? $t("English") : $t("Ukrainian") }}
        <template #side>
          <IconCheck20 v-if="optionLocale === locale"
            class="system-blue-color" />
        </template>
      </ListItem>
    </div>
  </main>
</template>
