<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
import { parseISO, format } from 'date-fns'
import { onMounted, ref, } from "vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { useMoodTypesStore } from "@/stores/moodTypes";
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import TheChart from '../components/TheChart.vue'

const route = useRoute()
const { t } = useI18n()

const isOpenAddModal = ref(false);

const store = useMoodTypesStore()
type periodType = 'week' | 'month' | 'year'
type StatsType = {
  id: periodType,
  title: string,
}[]
const statsTypes: StatsType = [{ id: 'week', title: t('Week') }, { id: 'month', title: t('Month') }, { id: 'year', title: t('Year') }]

const computedTitle = computed(() => {
  const title = statsTypes[selectedTab.value].id;
  if (title === 'week')
    return t('WeekStats');
  else if (title === 'month')
    return t('MonthStats')
  else if (title === 'year')
    return t('YearStats')
  else return ''
})

const computedDateRange = computed(() => {
  if (!(selectedTab && store.moodRecords)) return;
  const firstDate: string = format(parseISO(store.moodRecordListByPeriods[statsTypes[selectedTab.value].id][0].date), 'd MMM yyyy');
  const lastDate: string = format(parseISO(store.moodRecordListByPeriods[statsTypes[selectedTab.value].id].at(-1)!.date), 'd MMM yyyy');
  return firstDate + ' - ' + lastDate;
})

const foundTab = statsTypes.find(t => t.id === route.params.type)
const foundTabIndex = foundTab ? statsTypes.indexOf(foundTab) : 0
const selectedTab = ref(foundTabIndex);

const statsLabel = computed(() => {
  const typeProp = statsTypes[selectedTab.value].id;
  const typePercent: number | undefined = store.moodPeriodsPercent[typeProp];
  if (!typePercent) return;
  return store.statsAverageLabels[Math.round(typePercent * store.statsAverageLabels.length / 100)];
})

// const tendency = computed(() => {
//   if (!store.moodRecordListByPeriods[statsTypes[selectedTab.value].id]) return;
//   const diffArray: number[] = [];
//   const moodIds = store.moodTypes.map(e => e.id)
//   const moodsCount = Math.max(...moodIds) - Math.min(...moodIds);
//   store.moodRecordListByPeriods[statsTypes[selectedTab.value].id].forEach((currEl, index) => {
//     const nextEl = store.moodRecordListByPeriods[statsTypes[selectedTab.value].id][+index + 1];
//     if (nextEl) {
//       diffArray.push(nextEl.mood_id / moodsCount + currEl.mood_id / moodsCount);
//     }
//   })

//   return (diffArray.reduce((a, b) => a + b, 0) / diffArray.length) || 0;
// })

onMounted(async () => {
  await store.getMoodRecordsList();
  await store.getMoodsList();
})

</script>

<template>
  <main class="px-0">
    <PageHeader :title="computedTitle"
      :with-add-button="true"
      :with-back-button="true"
      class="px-4"
      @button-click="isOpenAddModal = true" />
    <AddMoodModal v-model="isOpenAddModal"
      @record-created="store.getMoodRecordsList()" />

    <section v-if="statsLabel"
      class="system-white-bg px-4 py-[11px]">
      <TabGroup :selectedIndex="selectedTab"
        @change="(index) => selectedTab = index">
        <TabList class="footnote flex rounded-lg cursor-pointer p-[2px] mood-radio-group"
          style="background-color: rgba(118, 118, 128, 0.12);">
          <Tab v-for="stat in statsTypes"
            as="template"
            :key="stat.id"
            v-slot="{ selected }"
            :disabled="!store.moodRecordListByPeriods[stat.id].length">
            <button :class="[
              'w-full rounded-lg px-4 py-[6px] footnote font-medium focus:outline-none relative',
              { 'radio-checked': selected }
            ]"
              type="button">
              {{ stat.title }}
            </button>
          </Tab>
        </TabList>

        <label class="uppercase footnote system-gray-color font-semibold">{{ $t('InAverage') }}</label>
        <h2 class="large-heading font-bold font-rounded">{{ $t(`Stats.${statsLabel}`) }}</h2>
        <label class="subheadline system-gray-color font-semibold">{{ computedDateRange }}</label>

        <TabPanels class="mt-2 mb-6">
          <TabPanel v-for="(stat, idx) in statsTypes"
            :key="idx">
            <TheChart :data="store.moodRecordListByPeriods[stat.id]"
              :stats-type="stat.id" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <!-- <div class="border rounded-[10px] px-4 py-[14px] mb-4 flex items-center justify-between"
        style="border-color: var(--system-gray-5)">
        <label class="subheadline">{{ $t('Tendency') }}</label>
        <label>{{ tendency?.toFixed(2) }}</label>
      </div> -->
    </section>
  </main>
</template>