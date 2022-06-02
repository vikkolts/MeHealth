<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";

const store = useMoodTypesStore()

async function exportData() {
  const data = { ...await store.getMoodRecordsList() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `MeHealth_exported_data_${new Date().toISOString()}.json`);
  link.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(link.href);
    link.remove();
  }, 4e4);
}

async function importData(event: Event) {
  let file = (document.getElementById('import-file-input') as HTMLInputElement)?.files?.[0]; // FileList object
  if (!file) return;
  let reader = new FileReader();
  reader.onload = async function () {
    let data = typeof (reader.result) === "string" ? Object.values(JSON.parse(reader.result)) as DBMoodRecord[] : undefined;
    if (!data) return;
    let successCount = 0;
    for (const el of data) {
      try {
        if (((el.date && el.mood_id) || (el.date && el.mood_id && el.notes)) && /\d{4}-\d{2}-\d{2}/.test(el.date) && /[0-5]/.test(el.date)) {
          await store.saveMoodRecord({ date: el.date, mood_id: el.mood_id, notes: el.notes?.replace(/<[\s\S]*?>/, '') });
          successCount++;
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    console.log({ successCount });
  };
  reader.readAsText(file);
}
</script>

<template>
  <main>
    <PageHeader :title="$t('Pages.Settings')" />
    <button class="bg-red-600 m-2 p-2 text-white rounded-lg"
      @click="store.cleanDataBase()">CLEAR DB</button>
    <button class="bg-orange-600 m-2 p-2 text-white rounded-lg"
      @click="exportData">EXPORT DATA</button>
    <form @submit.prevent="importData">
      <input type="file"
        placeholder="file"
        id="import-file-input"
        accept="application/json">
      <button type="submit"
        class="bg-green-600 m-2 p-2 text-white rounded-lg">IMPORT DATA</button>
    </form>
  </main>
</template>
