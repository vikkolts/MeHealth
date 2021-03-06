<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const store = useMoodTypesStore()
const importFileInput = ref();
const { t } = useI18n()

async function exportData() {
  const data = { ...await store.getMoodRecordsList() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `MeHealth_exported_data_${new Date().toISOString()}.json`);
  link.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(link?.href);
    link?.remove();
  }, 3e4);
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
    alert(`${t('SuccessfullyImportedRecords')}: ${successCount}`)
  };
  reader.readAsText(file);
}

function confirmClearDB() {
  let isConfirmed = confirm(t('ConfirmClearDB'))
  if (isConfirmed) store.cleanDataBase()
}
</script>

<template>
  <main class="px-0">
    <PageHeader :title="$t('ManageData')"
      with-back-button
      class="px-4-safe" />

    <button type="button"
      class="primary button-bg min-h-[44px] w-full py-2 px-4-safe text-left body-text"
      @click="exportData">
      {{ $t('ExportData') }}
    </button>
    <button type="button"
      class="primary button-bg min-h-[44px] my-4 w-full py-2 px-4-safe text-left body-text"
      @click="(importFileInput as HTMLInputElement).click()">
      {{ $t('ImportData') }}
    </button>
    <input id="import-file-input"
      ref="importFileInput"
      class="hidden"
      type="file"
      accept="application/json"
      @change="importData" />
    <button type="button"
      class="danger button-bg min-h-[44px] w-full py-2 px-4-safe text-left body-text"
      @click="confirmClearDB">
      {{ $t('ClearDB') }}
    </button>
  </main>
</template>
