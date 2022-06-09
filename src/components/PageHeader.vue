<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
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

const showSmallHeader = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

function handleScroll(e: Event) {
  window.pageYOffset > 35 ? showSmallHeader.value = true : showSmallHeader.value = false;
}
</script>

<template>
  <div class="page-header">
    <div class="flex h-[50px] fixed top-0 right-0 left-0 pl-[9px] pr-4 z-50 transition-all duration-200"
      :class="showSmallHeader ? 'nav-header-bg' : 'system-color-background'">
      <button v-if="props.withBackButton"
        class="primary mr-auto"
        type="button"
        @click="$router.go(-1)">
        <IconChevronBack24Vue />
      </button>
      <label class="page-header__label body-text fixed top-[14px] left-[50%] font-semibold z-50 translate-x-[-50%] transition-all"
        :style="{ visibility: showSmallHeader ? 'visible' : 'hidden' }">
        {{ props.title }}
      </label>
      <button v-if="props.withAddButton"
        class="primary ml-auto"
        type="button"
        @click="emit('buttonClick', $event)">
        <IconAdd28 />
      </button>
    </div>
    <h1 class="large-heading font-bold transition-all duration-100"
      :style="{ visibility: showSmallHeader ? 'hidden' : 'visible' }"
      style="margin-top: calc(54px + env(safe-area-inset-top))">{{ props.title }}</h1>
  </div>
</template>
