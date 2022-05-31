<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";

</script>

<template>
  <main>
    <PageHeader :title="$t('Pages.Calendar')"
      :with-add-button="true" />
  </main>
</template>
