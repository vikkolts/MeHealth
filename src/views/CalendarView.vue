<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import AddMoodModal from "../components/AddMoodModal.vue";
import { onMounted, ref } from "vue";
import { useMoodTypesStore } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  formatISO,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  getWeekOfMonth,
} from 'date-fns'
import IconChevronLeft24 from '../components/icons/IconChevronLeft24.vue'
import IconChevronRight24 from '../components/icons/IconChevronRight24.vue'
import { computed } from "@vue/reactivity";

const store = useMoodTypesStore()
const { moodRecords } = storeToRefs(store)
const isOpenAddModal = ref(false);
const isAddModal = ref(true);
onMounted(async () => {
  await store.getMoodRecordsList();
})
const modalData = ref();

let today = startOfToday()
const selectedDay = ref(today)
const currentMonth = computed(() => format(selectedDay.value, 'MMM-yyyy'))
const firstDayCurrentMonth = computed(() => parse(currentMonth.value, 'MMM-yyyy', new Date()))
const days = computed(() => eachDayOfInterval({
  start: firstDayCurrentMonth.value,
  end: endOfMonth(firstDayCurrentMonth.value),
}))
const selectedDayRecord = computed(() => moodRecords.value.find((record) =>
  isSameDay(parseISO(record.date), selectedDay.value)
))

function previousMonth() {
  selectedDay.value = add(firstDayCurrentMonth.value, { months: -1 })
}

function nextMonth() {
  selectedDay.value = add(firstDayCurrentMonth.value, { months: 1 })
}

let colStartClasses = [
  'col-start-7',
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
]

function openAddModal() {
  isAddModal.value = true;
  modalData.value = {
    date: formatISO(selectedDay.value, { representation: 'date' })
  };
  isOpenAddModal.value = true
}

function openEditModal() {
  isAddModal.value = false;
  modalData.value = selectedDayRecord.value;
  isOpenAddModal.value = true
}

async function deleteRecord(id: number) {
  await store.deleteMoodRecord(id);
  await store.getMoodRecordsList();
}
</script>

<template>
  <main class="px-0"
    style="padding-bottom: calc(49px + env(safe-area-inset-bottom));">
    <PageHeader :title="$t('Pages.Calendar')"
      class="px-4"
      :with-add-button="true"
      @button-click="openAddModal()" />
    <AddMoodModal v-model="isOpenAddModal"
      :edit-data="modalData"
      @record-created="store.getMoodRecordsList()" />

    <div class="mx-auto">
      <div>
        <div class="flex items-center py-2 px-4">
          <h2 class="flex-auto font-semibold body-text">
            {{ $t(format(firstDayCurrentMonth, 'MMMM')) }} {{ format(firstDayCurrentMonth, 'yyyy') }}
          </h2>
          <button type="button"
            @click="previousMonth"
            class="flex flex-none items-center justify-center primary"
            :title="$t('PrevMonth')">
            <IconChevronLeft24 />
          </button>
          <button @click="nextMonth"
            type="button"
            class="ml-4 flex flex-none items-center justify-center primary"
            :title="$t('NextMonth')">
            <IconChevronRight24 />
          </button>
        </div>
        <div class="grid grid-cols-7 text-center caption-1 font-semibold system-gray-color sticky top-[50px] border-b-[0.5px] modal-bg">
          <div class="pl-4">{{ $t('Mon') }}</div>
          <div>{{ $t('Tue') }}</div>
          <div>{{ $t('Wed') }}</div>
          <div>{{ $t('Thu') }}</div>
          <div>{{ $t('Fri') }}</div>
          <div>{{ $t('Sat') }}</div>
          <div class="pr-4">{{ $t('Sun') }}</div>
        </div>
        <div class="grid grid-cols-7 system-gray-6-bg">
          <div v-for="(day, dayIdx) in days"
            :key="day.toString()"
            :class="[
              dayIdx === 0 && colStartClasses[getDay(day)],
              { 'pr-4': getDay(day) === 0 },
              { 'pl-4': getDay(day) === 1 },
              { 'border-t-[0.5px]': getWeekOfMonth(day, { weekStartsOn: 1 }) !== 1 },
              'pt-1 pb-1.5'
            ]">
            <button type="button"
              @click="() => selectedDay = day"
              :class="[
                { 'text-white': isEqual(day, selectedDay) },
                {
                  'text-red-500': !isEqual(day, selectedDay) &&
                    isToday(day)
                },
                // {
                //   'text-gray-900': !isEqual(day, selectedDay) &&
                //     !isToday(day) &&
                //     isSameMonth(day, firstDayCurrentMonth)
                // },
                { 'bg-red-500': isEqual(day, selectedDay) && isToday(day) },
                {
                  'selected-calendar-day': isEqual(day, selectedDay) &&
                    !isToday(day)
                },
                { 'hover:bg-gray-200': !isEqual(day, selectedDay) },
                { 'font-semibold': (isEqual(day, selectedDay) || isToday(day)) },
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full body-text'
              ]">
              <time :dateTime="format(day, 'yyyy-MM-dd')">
                {{ format(day, 'd') }}
              </time>
            </button>

            <div class="w-1 h-1 mx-auto mt-1">
              <div v-if="moodRecords.some((record) => isSameDay(parseISO(record.date), day))"
                class="w-1 h-1 rounded-full system-gray-2-bg"></div>
            </div>
          </div>
        </div>
      </div>
      <section class="p-4 chart-bg flex flex-col"
        style="min-height: calc(100vh - 464px);">
        <div v-if="selectedDayRecord"
          class="flex items-center pb-4">
          <h2 class="font-semibold body-text">
            <time :dateTime="format(selectedDay, 'yyyy-MM-dd')">
              {{ $t('MoodOfDay') }}:
            </time>
            {{ store.moodTypes.find(t => t.id === selectedDayRecord?.mood_id)?.emoji }}
          </h2>
          <button class="ml-auto primary"
            type="button"
            @click="openEditModal()">{{ $t('Edit') }}</button>
        </div>
        <pre v-if="selectedDayRecord?.notes"
          class="body-text">
          {{ selectedDayRecord.notes }}
        </pre>
        <p v-else-if="selectedDayRecord"
          class="system-gray-color flex m-auto">
          {{ $t('NoNotes') }}
        </p>
        <p v-else
          class="system-gray-color flex m-auto">
          {{ $t('NoData') }}
        </p>
      </section>
      <button v-if="selectedDayRecord"
        type="button"
        class="danger item-white-bg my-4 w-full py-2 px-4 text-left body-text"
        @click="deleteRecord(selectedDayRecord!.id as number)">
        {{ $t('Delete') }}
      </button>
    </div>

  </main>
</template>
