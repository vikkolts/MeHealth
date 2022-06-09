<script setup lang="ts">
import IconAdd28 from "../components/icons/IconAdd28.vue";
import IconChevronBack24Vue from "./icons/IconChevronBack24.vue";
const props = defineProps<{
  withAddButton?: boolean,
  withBackButton?: boolean,
  title: string
}>()
const emit = defineEmits<{
  (e: 'buttonClick', event: Event): void
}>()

</script>

<template>
  <div class="grid gap-1 grid-rows-2">
    <div class="flex py-2 h-[50px]">
      <button v-if="props.withBackButton"
        class="primary"
        type="button"
        @click="$router.go(-1)">
        <IconChevronBack24Vue />
      </button>
      <button v-if="props.withAddButton"
        class="primary ml-auto"
        type="button"
        @click="emit('buttonClick', $event)">
        <IconAdd28 />
      </button>
    </div>
    <h1 class="large-heading font-bold">{{ props.title }}</h1>
  </div>
</template>
