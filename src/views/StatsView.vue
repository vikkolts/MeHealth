<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
import { add, formatISO, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, format, isSameMonth } from 'date-fns'
import { onMounted, ref, watch, onUnmounted } from "vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import TheChart from '../components/TheChart.vue'

const route = useRoute()
const router = useRouter()
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
  let title = route.params.type as string;
  if (title === 'week')
    return t('WeekStats');
  else if (title === 'month')
    return t('MonthStats')
  else if (title === 'year')
    return t('YearStats')
  else return ''
})

const foundTab = statsTypes.find(t => t.id === route.params.type)
const foundTabIndex = foundTab ? statsTypes.indexOf(foundTab) : 0
const selectedTab = ref(foundTabIndex);

onMounted(async () => {
  await store.getMoodRecordsList();
  await store.getMoodsList();
})

function pushNewTab(type: periodType) {
  router.replace({ name: 'stats', params: { type: type } })
}

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

    <section class="bg-white px-4 py-[11px]">
      <TabGroup :selectedIndex="selectedTab">
        <TabList class="footnote flex rounded-lg cursor-pointer p-[2px] mood-radio-group"
          style="background-color: rgba(118, 118, 128, 0.12);">
          <Tab v-for="stat in statsTypes"
            as="template"
            :key="stat.id"
            v-slot="{ selected }">
            <button :class="[
              'w-full rounded-lg px-4 py-[6px] text-sm font-medium focus:outline-none relative',
              selected
                ? 'radio-checked'
                : '',
            ]"
              @click="pushNewTab(stat.id)">
              {{ stat.title }}
            </button>
          </Tab>
        </TabList>

        <TabPanels class="mt-2">
          <TabPanel v-for="(stat, idx) in statsTypes"
            :key="idx">
            <TheChart :data="store.moodRecordListByPeriods.week"
              :stats-type="stat.id" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </main>
</template>