<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
import ClosableCard from "../components/ClosableCard.vue"
import { formatISO } from 'date-fns'
import { onMounted, ref } from "vue";
import StatsCard from "@/components/StatsCard.vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { useMoodTypesStore } from "@/stores/moodTypes";
import { useCookies } from "vue3-cookies";

const title = ref('Pages.Summary');
const isOpenAddModal = ref(false);
const { cookies } = useCookies();

const store = useMoodTypesStore()
onMounted(async () => {
  await store.getMoodRecordsList();
})

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
      <ClosableCard v-if="!cookies.get('repeat-alert-after')"
        @click="isOpenAddModal = true"
        class="mb-2" />
      <StatsCard :title="$t('WeekStats')"
        :percent="store.moodPeriodsPercent?.week"
        @click="$router.push({ name: 'stats', params: { type: 'week' } })" />
      <StatsCard :title="$t('MonthStats')"
        :percent="store.moodPeriodsPercent?.month"
        @click="$router.push({ name: 'stats', params: { type: 'month' } })" />
      <StatsCard :title="$t('YearStats')"
        :percent="store.moodPeriodsPercent?.year"
        @click="$router.push({ name: 'stats', params: { type: 'year' } })" />
    </div>
    <AddMoodModal v-model="isOpenAddModal"
      @record-created="store.getMoodRecordsList()" />
  </main>
</template>
