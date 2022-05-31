<script setup lang="ts">
import IconAdd28 from "../components/icons/IconAdd28.vue";
const props = defineProps<{
  withAddButton?: Boolean,
  title: String
}>()
const emit = defineEmits<{
  (e: 'buttonClick', event: Event): void
}>()

</script>

<template>
  <div class="grid gap-1 grid-rows-2">
    <div class="text-right py-2 h-[50px]">
      <button v-if="props.withAddButton"
        class="primary"
        type="button"
        @click="emit('buttonClick', $event)">
        <IconAdd28 />
      </button>
    </div>
    <h1 class="large-heading font-bold">{{ props.title }}</h1>
  </div>
</template>
