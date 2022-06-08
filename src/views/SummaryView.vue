<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
import ClosableCard from "../components/ClosableCard.vue"
import { add, formatISO } from 'date-fns'
import { onMounted, ref, watch } from "vue";
import StatsCard from "@/components/StatsCard.vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'

const title = ref('Pages.Summary');
const isOpenAddModal = ref(false);
const weekStatsPercent = ref(0);
const monthStatsPercent = ref(0);
const yearStatsPercent = ref(0);

const store = useMoodTypesStore()
const { moodRecords, moodTypes } = storeToRefs(store);
onMounted(async () => {
  await store.getMoodRecordsList();
})

watch(moodRecords, () => {
  setStatsInfo();
})

function setStatsInfo() {
  const today = new Date();
  const weekArray: DBMoodRecord[] = [];
  const monthArray: DBMoodRecord[] = [];
  const yearArray: DBMoodRecord[] = [];
  const minWeekDate = add(today, { days: -7 });
  const minMonthDate = add(today, { months: -1 });
  const minYearDate = add(today, { years: -1 });
  moodRecords.value.forEach(r => {
    if (new Date(r.date) >= minWeekDate && new Date(r.date) <= today) weekArray.push(r);
    if (new Date(r.date) >= minMonthDate && new Date(r.date) <= today) monthArray.push(r);
    if (new Date(r.date) >= minYearDate && new Date(r.date) <= today) yearArray.push(r);
  })
  weekStatsPercent.value = (weekArray.reduce((acc, cur) => acc + cur.mood_id, 0) / weekArray.length) * 100 / moodTypes.value.length;
  monthStatsPercent.value = (monthArray.reduce((acc, cur) => acc + cur.mood_id, 0) / monthArray.length) * 100 / moodTypes.value.length;
  yearStatsPercent.value = (yearArray.reduce((acc, cur) => acc + cur.mood_id, 0) / yearArray.length) * 100 / moodTypes.value.length;
}

function checkTimePeriod() {
  const currentTime = formatISO(new Date(), { representation: 'time' }).slice(0, 5);
  const [hours, minutes] = currentTime.split(':')
  const currentPeriod = +hours * 60 * 60 + +minutes * 60;
  const NIGHT_PERIOD_START = 21 * 60 * 60;
  const MORNING_PERIOD_START = 5 * 60 * 60;
  const AFTERNOON_PERIOD_START = 12 * 60 * 60;
  const EVENING_PERIOD_START = 18 * 60 * 60;
  if (NIGHT_PERIOD_START <= currentPeriod && currentPeriod < MORNING_PERIOD_START)
    title.value = 'GoodNight';
  else if (MORNING_PERIOD_START <= currentPeriod && currentPeriod < AFTERNOON_PERIOD_START)
    title.value = 'GoodMorning';
  else if (AFTERNOON_PERIOD_START <= currentPeriod && currentPeriod < EVENING_PERIOD_START)
    title.value = 'GoodAfternoon';
  else if (EVENING_PERIOD_START <= currentPeriod && currentPeriod < NIGHT_PERIOD_START)
    title.value = 'GoodEvening';
};
checkTimePeriod();

</script>

<template>
  <main>
    <PageHeader :title="$t(title)"
      :with-add-button="true"
      @button-click="isOpenAddModal = true" />
    <div class="flex flex-col w-full gap-[6px]">
      <ClosableCard />
      <StatsCard :title="$t('WeekStats')"
        :percent="weekStatsPercent"
        @click="$router.push({ name: 'stats', params: { type: 'week' } })" />
      <StatsCard :title="$t('MonthStats')"
        :percent="monthStatsPercent"
        @click="$router.push({ name: 'stats', params: { type: 'month' } })" />
      <StatsCard :title="$t('YearStats')"
        :percent="yearStatsPercent"
        @click="$router.push({ name: 'stats', params: { type: 'year' } })" />
    </div>
    <AddMoodModal v-model="isOpenAddModal"
      @record-created="store.getMoodRecordsList()" />
  </main>
</template>
