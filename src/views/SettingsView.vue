<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useMoodTypesStore } from "@/stores/moodTypes";

const store = useMoodTypesStore()

</script>

<template>
  <main>
    <PageHeader :title="$t('Pages.Settings')" />
    <button class="bg-red-600 my-2 p-2 text-white rounded-lg"
      @click="store.cleanDataBase()">CLEAR DB</button>
  </main>
</template>
