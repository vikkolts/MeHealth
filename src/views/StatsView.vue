<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue"
import { add, formatISO, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, format, isSameMonth } from 'date-fns'
import { onMounted, ref, watch, onUnmounted } from "vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import * as d3 from "d3";

const route = useRoute()
const { t } = useI18n()

const isOpenAddModal = ref(false);
const d: any = ref(null);
const xScale: any = ref(null);
const yScale: any = ref(null);
const dataArray: any = ref([])
const margin = {
  top: 20,
  right: 35,
  bottom: 20,
  left: 20,
};
const months: any = ref([])

const store = useMoodTypesStore()
const statsTypes = [{ id: 'week', title: t('Week') }, { id: 'month', title: t('Month') }, { id: 'year', title: t('Year') }]

const categories = ref({
  Recent: [
    {
      id: 1,
      title: 'Does drinking coffee make you smarter?',
      date: '5h ago',
      commentCount: 5,
      shareCount: 2,
    },
    {
      id: 2,
      title: "So you've bought coffee... now what?",
      date: '2h ago',
      commentCount: 3,
      shareCount: 2,
    },
  ],
  Popular: [
    {
      id: 1,
      title: 'Is tech making coffee better or worse?',
      date: 'Jan 7',
      commentCount: 29,
      shareCount: 16,
    },
    {
      id: 2,
      title: 'The most innovative things happening in coffee',
      date: 'Mar 19',
      commentCount: 24,
      shareCount: 12,
    },
  ],
  Trending: [
    {
      id: 1,
      title: 'Ask Me Anything: 10 answers to your questions about coffee',
      date: '2d ago',
      commentCount: 9,
      shareCount: 5,
    },
    {
      id: 2,
      title: "The worst advice we've ever heard about coffee",
      date: '4d ago',
      commentCount: 1,
      shareCount: 2,
    },
  ],
})

const mainBounding = ref({
  width: 0,
  height: 0
})

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

type statsType = {
  week: {
    date: string, data?: DBMoodRecord
  }[],
  month: {
    date: string, data?: DBMoodRecord
  }[],
  year: {
    date: string, data?: DBMoodRecord
  }[],
}

const today = new Date()
const statsGroup = computed(() => {
  const minWeekDate = add(today, { days: -7 });
  const minMonthDate = add(today, { months: -1 });
  const minYearDate = add(today, { years: -1 });
  const weekArray = getDaysArray(minWeekDate, today);
  const monthArray = getDaysArray(minMonthDate, today);
  //const yearArray = getDaysArray(minYearDate, today);
  const stats: statsType = {
    week: [],
    month: [],
    year: [],
  };
  for (const day of weekArray) {
    const date = formatISO(day, { representation: 'date' });
    stats.week.push({
      date: date,
      data: store.moodRecords.find(e => e.date === date)
    })
  }
  for (const day of monthArray) {
    const date = formatISO(day, { representation: 'date' });
    stats.week.push({
      date: date,
      data: store.moodRecords.find(e => e.date === date)
    })
  }
  return stats;
})

onMounted(async () => {
  await store.getMoodRecordsList();
  await store.getMoodsList();
  getChartWrapperDimensions();
  window.addEventListener('resize', getChartWrapperDimensions);
})

onUnmounted(() => {
  window.removeEventListener('resize', getChartWrapperDimensions);
})

function getChartWrapperDimensions() {
  const { width, height } = document.querySelector('#chart-wrapper')!.getBoundingClientRect();
  mainBounding.value.width = width;
  mainBounding.value.height = height;
  buildChart();
}

// watch(moodRecords, () => {
//   setStatsInfo();
// })

const getDaysArray = function (start: Date, end: Date) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

function buildChart() {
  const data = store.moodRecords.map(d => ({ date: parseISO(d.date), mood_id: d.mood_id }));
  let startDay = startOfMonth(data.at(0)!.date);
  let endDay = endOfMonth(data.at(-1)!.date);
  months.value = eachMonthOfInterval({ start: startDay, end: endDay });

  let xScaleOrigin = d3.scaleLinear().domain(d3.extent(data.map((d) => d.date)) as any).range([margin.left, mainBounding.value.width - margin.right]);
  let yScaleOrigin = d3.scaleLinear().domain(d3.extent(data.map((d) => d.mood_id)) as any).range([mainBounding.value.height - margin.bottom, margin.top]);
  let line = d3
    .line()
    .x((d: any) => xScaleOrigin(d.date))
    .y((d: any) => yScaleOrigin(d.mood_id))

  yScale.value = yScaleOrigin;
  xScale.value = xScaleOrigin;
  dataArray.value = data;
  d.value = line(data as any);
}

</script>

<template>
  <main>
    <PageHeader :title="computedTitle"
      :with-add-button="true"
      @button-click="isOpenAddModal = true" />
    <AddMoodModal v-model="isOpenAddModal"
      @record-created="store.getMoodRecordsList()" />

    <div id="chart-wrapper"
      class="h-[311px] system-indigo-color">
      <svg v-if="yScale && d"
        :viewBox="`0 0 ${mainBounding.width} ${mainBounding.height}`">
        <!-- X axis -->
        <g v-for="(month, i) of months"
          :transform="`translate(${xScale(month)},0)`"
          class="text-gray-400"
          :key="month">
          <!-- <rect v-if="i % 2 === 1"
            :width="xScale(endOfMonth(month)) - xScale(month)"
            :height="mainBounding.height - margin.bottom"
            fill="currentColor"
            class="text-gray-100" /> -->
          <line :y1="margin.bottom"
            :y2="mainBounding.height - margin.bottom"
            stroke="currentColor"
            stroke-dasharray="1,3" />
          <text :x="(xScale(endOfMonth(month)) - xScale(month)) / 2"
            :y="mainBounding.height - 5"
            text-anchor="middle"
            fill="currentColor"
            class="text-[10px]">
            {{ format(month, "MMM") }}
          </text>
        </g>
        <!-- Y axis -->
        <g v-for="max of yScale.ticks(store.moodTypes.length - 1)"
          :transform="`translate(0,${yScale(max)})`"
          class="text-gray-400"
          :key="max">
          <line :x1="margin.left"
            :x2="mainBounding.width - margin.right"
            stroke="currentColor"
            stroke-dasharray="1,3" />
          <text :x="mainBounding.width - 20"
            fill="currentColor"
            alignment-baseline="middle">
            {{ store.moodTypes.find(m => m.id === max)?.emoji || max }}
          </text>
        </g>
        <path :d="d"
          fill="none"
          stroke="currentColor"></path>
        {data.map((d, i) => (
        <circle v-for="(d, i) in dataArray"
          :key="d.date"
          r="3"
          :cx="xScale(d.date)"
          :cy="yScale(d.mood_id)"
          :title="d.date"
          fill="var(--card-color-background)"
          stroke-width="2"
          stroke="var(--system-indigo)" />
        ))}
      </svg>
    </div>

    <!-- <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <Tab v-for="category in Object.keys(categories)"
          as="template"
          :key="category"
          v-slot="{ selected }">
          <button :class="[
            'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
            selected
              ? 'bg-white shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
          ]">
            {{ category }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-2">
        <TabPanel v-for="(posts, idx) in Object.values(categories)"
          :key="idx"
          :class="[
            'rounded-xl bg-white p-3',
            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          ]">
          <ul>
            <li v-for="post in posts"
              :key="post.id"
              class="relative rounded-md p-3 hover:bg-gray-100">
              <h3 class="text-sm font-medium leading-5">
                {{ post.title }}
              </h3>

              <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                <li>{{ post.date }}</li>
                <li>&middot;</li>
                <li>{{ post.commentCount }} comments</li>
                <li>&middot;</li>
                <li>{{ post.shareCount }} shares</li>
              </ul>

              <a href="#"
                :class="[
                  'absolute inset-0 rounded-md',
                  'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',
                ]" />
            </li>
          </ul>
        </TabPanel>
      </TabPanels>
    </TabGroup> -->
  </main>
</template>