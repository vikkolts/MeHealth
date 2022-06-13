<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import ListItem from "@/components/ListItem.vue";
import IconCheck20 from "../components/icons/IconCheck20.vue";
import { useAppSettingsStore } from "@/stores/appSettings";

const store = useAppSettingsStore();

</script>

<template>
  <main>
    <PageHeader :title="$t('Theme')"
      with-back-button />
    <div class="list-group">
      <ListItem @click="store.setTheme('System')">
        {{ $t("System") }}
        <template #side>
          <IconCheck20 v-if="store.appTheme === 'System'"
            class="system-blue-color" />
        </template>
      </ListItem>

      <ListItem @click="store.setTheme('Light')">
        {{ $t("Light") }}
        <template #side>
          <IconCheck20 v-if="store.appTheme === 'Light'"
            class="system-blue-color" />
        </template>
      </ListItem>

      <ListItem @click="store.setTheme('Dark')">
        {{ $t("Dark") }}
        <template #side>
          <IconCheck20 v-if="store.appTheme === 'Dark'"
            class="system-blue-color" />
        </template>
      </ListItem>

    </div>

  </main>
</template>
