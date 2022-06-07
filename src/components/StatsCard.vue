<script setup lang="ts">
import IconChevronRight16Vue from './icons/IconChevronRight16.vue';
import IconDocumentLandscape20Vue from './icons/IconDocumentLandscape20.vue';

const props = defineProps<{
  title: string,
  percent: number,
}>()
const emit = defineEmits<{
  (e: 'cardClick', event: Event): void
}>()

</script>

<template>
  <div class="closable-card cursor-pointer rounded-[10px] px-4 py-[12px] flex flex-col gap-4"
    @click="emit('cardClick', $event)">
    <div class="flex gap-1 w-full system-indigo-color items-center">
      <IconDocumentLandscape20Vue />
      <p class="subheadline font-semibold flex mr-auto">{{ props.title }}</p>
      <IconChevronRight16Vue class="system-gray-3-color" />
    </div>
    <div class="custom-meter my-1">
      <div class="thumb"
        :style="{ width: props.percent + '%' }"></div>
    </div>
    <p class="title-3 font-bold font-rounded">{{ $t('Stats.Good') }}</p>
  </div>
</template>

<style>
</style>