<script setup lang="ts">
import { add, formatISO, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, format, isSameMonth, eachDayOfInterval, eachWeekOfInterval, getDay } from 'date-fns'
import { onMounted, ref, watch, onUnmounted, watchEffect } from "vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { computed } from "@vue/reactivity";
import * as d3 from "d3";

const props = defineProps<{
  data: DBMoodRecord[],
  statsType: 'week' | 'month' | 'year',
}>()


const store = useMoodTypesStore();
const d: any = ref(null);
const xScale: any = ref(null);
const yScale: any = ref(null);
const margin = {
  top: 20,
  right: 35,
  bottom: 22,
  left: 4,
};
const periodsList: any = ref([])
const chartWrapperBounding = ref({
  width: 0,
  height: 0
})

const formattedData = computed(() => store.moodRecordListByPeriods[props.statsType].map(d => ({ date: parseISO(d.date), mood_id: d.mood_id })));
const formatPeriodXAxis = computed(() => props.statsType === 'week' ? 'eee' : props.statsType === 'month' ? 'd' : "MMM")

onMounted(async () => {
  getChartWrapperDimensions();
  window.addEventListener('resize', getChartWrapperDimensions);
})

watch(formattedData, (newValue) => {
  getChartWrapperDimensions()
})

onUnmounted(() => {
  window.removeEventListener('resize', getChartWrapperDimensions);
})

function getChartWrapperDimensions() {
  const { width, height } = document.querySelector('#chart-wrapper')!.getBoundingClientRect();
  chartWrapperBounding.value.width = width;
  chartWrapperBounding.value.height = height;
  buildChart();
}

function buildChart() {
  if (formattedData.value.length === 0) return
  let startDay = formattedData.value.at(0)!.date;
  let endDay = formattedData.value.at(-1)!.date;
  if (props.statsType === 'year') {
    periodsList.value = eachMonthOfInterval({ start: startDay, end: endDay });
  } else if (props.statsType === 'month') {
    periodsList.value = eachWeekOfInterval({ start: startDay, end: endDay });
  } else if (props.statsType === 'week') {
    periodsList.value = eachDayOfInterval({ start: startDay, end: endDay });
  }

  let xScaleOrigin = d3.scaleLinear().domain(d3.extent(formattedData.value.map((d) => d.date)) as any).range([margin.left, chartWrapperBounding.value.width - margin.right]);
  let yScaleOrigin = d3.scaleLinear().domain(d3.extent(formattedData.value.map((d) => d.mood_id)) as any).range([chartWrapperBounding.value.height - margin.bottom, margin.top]);
  let line = d3
    .line()
    .x((d: any) => xScaleOrigin(d.date))
    .y((d: any) => yScaleOrigin(d.mood_id))

  yScale.value = yScaleOrigin;
  xScale.value = xScaleOrigin;
  d.value = line(formattedData.value as any);
}

</script>
<template>
  <div id="chart-wrapper"
    class="h-[311px] system-indigo-color">
    <svg v-if="yScale && d"
      :viewBox="`0 0 ${chartWrapperBounding.width} ${chartWrapperBounding.height}`">
      <!-- X axis -->
      <g v-for="(period, i) of periodsList"
        :transform="`translate(${xScale(period)},0)`"
        class="system-gray-5-color"
        :key="period">
        <line :y1="margin.top"
          :y2="chartWrapperBounding.height"
          stroke="currentColor"
          :stroke-dasharray="props.statsType === 'week' && getDay(period) === 0 ? 0 : 1.3" />
        <text v-if="!(props.statsType === 'week' && i === periodsList.length - 1)"
          x="4"
          :y="chartWrapperBounding.height - 5"
          fill="currentColor"
          class="font-semibold caption-1 system-gray-3-color">
          {{ format(period, formatPeriodXAxis) }}
        </text>
      </g>
      <!-- Y axis -->
      <g v-for="max of yScale.ticks(store.moodTypes.length)"
        :transform="`translate(0,${yScale(max)})`"
        class="system-gray-5-color"
        :key="max">
        <template v-if="store.moodTypes.find(m => m.id === max)?.emoji">
          <line :x1="margin.left"
            :x2="chartWrapperBounding.width - margin.right"
            stroke="currentColor"
            stroke-width="1" />
          <text :x="chartWrapperBounding.width - 20"
            fill="currentColor"
            alignment-baseline="middle">
            {{ store.moodTypes.find(m => m.id === max)?.emoji }}
          </text>
        </template>
      </g>
      <!-- GRAPH LINE -->
      <path :d="d"
        fill="none"
        stroke="currentColor"
        stroke-width="2"></path>
      <!-- DOTS -->
      <circle v-for="(d, i) in formattedData"
        :key="i"
        r="3"
        :cx="xScale(d.date)"
        :cy="yScale(d.mood_id)"
        :title="d.date"
        fill="var(--card-color-background)"
        stroke-width="2"
        stroke="var(--system-indigo)" />
    </svg>
  </div>
</template>