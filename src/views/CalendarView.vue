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
    <AddMoodModal v-model="isOpenAddModal"
      @record-created="store.getMoodRecordsList()" />
    <div>
      <div v-for="m in moodRecords"
        :key="m.id">
        {{ m }}
        <!-- <button class="p-1 m-1 inline-block bg-gray-700"
          @click="[store.saveMoodRecord({ id: m.id, date: m.date, mood_id: 5 }), store.getMoodRecordsList()]">Edit</button> -->
        <button class="p-1 m-1 inline-block bg-red-600"
          @click="store.deleteMoodRecord(m.id)">Delete</button>
      </div>
    </div>
  </main>
</template>
