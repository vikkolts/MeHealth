<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
</script>

<template>
  <main>
    <PageHeader :title="$t('PrivacyPolicy')"
      with-back-button />
    <p>
      {{ $t('PrivacyPolicyDescription') }}
    </p>

  </main>
</template>
