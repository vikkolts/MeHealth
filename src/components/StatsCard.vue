<script setup lang="ts">
import { useMoodTypesStore } from '@/stores/moodTypes';
import { computed } from '@vue/reactivity';
import IconChevronRight16Vue from './icons/IconChevronRight16.vue';
import IconDocumentLandscape20Vue from './icons/IconDocumentLandscape20.vue';

const props = defineProps<{
  title: string,
  percent?: number,
}>()

const store = useMoodTypesStore()
const statsLabel = computed(() => {
  return props.percent ? store.statsAverageLabels[Math.round(props.percent * store.statsAverageLabels.length / 100)] : null;
})
</script>

<template>
  <div v-if="props.percent && statsLabel"
    class="system-white-bg cursor-pointer rounded-[10px] px-4 py-[12px] flex flex-col">
    <div class="flex gap-1 w-full system-indigo-color items-center mb-4">
      <IconDocumentLandscape20Vue />
      <p class="subheadline font-semibold flex mr-auto">{{ props.title }}</p>
      <IconChevronRight16Vue class="system-gray-3-color" />
    </div>
    <div class="custom-meter mt-1 mb-3">
      <div class="thumb"
        :style="{ width: props.percent + '%' }"></div>
    </div>
    <p class="title-3 font-bold font-rounded">{{ $t(`Stats.${statsLabel}`) }}</p>
  </div>
</template>

<style>
</style>