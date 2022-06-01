<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { onMounted, ref } from "vue";
import { useMoodTypesStore } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'

const store = useMoodTypesStore()
const { moodRecords } = storeToRefs(store)
const isOpenAddModal = ref(false);
onMounted(async () => {
  await store.getMoodRecordsList();
})
</script>

<template>
  <main>
    <PageHeader :title="$t('Pages.Calendar')"
      :with-add-button="true"
      @button-click="isOpenAddModal = true" />
    <AddMoodModal v-model="isOpenAddModal" />
    <div>
      <p v-for="(m, index) in moodRecords"
        :key="index">
        {{ m }}
      </p>
    </div>
  </main>
</template>
