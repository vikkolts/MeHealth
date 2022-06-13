<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useAppSettingsStore } from "@/stores/appSettings";
import { useI18n } from 'vue-i18n';
import ListItem from "@/components/ListItem.vue";
import IconDarkThemeBg24 from "../components/icons/IconDarkThemeBg24.vue";
import IconChevronRight16 from "../components/icons/IconChevronRight16.vue";
import TheSwitch from "../components/TheSwitch.vue";
import IconGlobeBg24 from "../components/icons/IconGlobeBg24.vue";
import IconHandBg28 from "../components/icons/IconHandBg28.vue";
import IconDatabaseBg24 from "../components/icons/IconDatabaseBg24.vue";
import IconAlertBg24 from "../components/icons/IconAlertBg24.vue";
import IconInfoBg24 from '../components/icons/IconInfoBg24.vue';

const { locale } = useI18n()
const appStore = useAppSettingsStore();

</script>

<template>
  <main>
    <PageHeader :title="$t('Pages.Settings')" />
    <div class="list-group">
      <ListItem @click="$router.push('/settings/theme')">
        <template #icon>
          <IconDarkThemeBg24 />
        </template>
        {{ $t("Theme") }}
        <template #side>
          {{ $t(appStore.appTheme) }}
          <IconChevronRight16 />
        </template>
      </ListItem>

      <ListItem class="cursor-default">
        <template #icon>
          <IconAlertBg24 />
        </template>
        {{ $t("Notifications") }}
        <template #side>
          <TheSwitch :checked="appStore.isNotifications"
            @change="appStore.setNotificationsSettings()" />
        </template>
      </ListItem>

      <ListItem @click="$router.push('/settings/manage-data')">
        <template #icon>
          <IconDatabaseBg24 />
        </template>
        {{ $t("ManageData") }}
        <template #side>
          <IconChevronRight16 />
        </template>
      </ListItem>

      <ListItem @click="$router.push('/settings/privacy-policy')">
        <template #icon>
          <IconHandBg28 />
        </template>
        {{ $t("PrivacyPolicy") }}
        <template #side>
          <IconChevronRight16 />
        </template>
      </ListItem>

      <ListItem @click="$router.push('/settings/language')">
        <template #icon>
          <IconGlobeBg24 />
        </template>
        {{ $t("Language") }}
        <template #side>
          {{ locale === 'en' ? $t("English") : $t("Ukrainian") }}
          <IconChevronRight16 />
        </template>
      </ListItem>
      <ListItem class="cursor-default">
        <template #icon>
          <IconInfoBg24 />
        </template>
        {{ $t("Version") }}
        <template #side>
          v1.0.0
        </template>
      </ListItem>
    </div>
  </main>
</template>
