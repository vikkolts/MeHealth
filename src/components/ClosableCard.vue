<script setup lang="ts">
import { ref } from "vue";
import IconAlertBg48 from "./icons/IconAlertBg48.vue";
import IconDismissCircleBg20 from "./icons/IconDismissCircleBg20.vue";

const emit = defineEmits<{
  (e: 'messageClick', event: Event): void
}>()

const show = ref(true)
function closeSelf() {
  show.value = false
}

</script>

<template>
  <div v-if="show"
    class="closable-card cursor-pointer rounded-[10px] px-4 py-[12px] flex gap-4"
    @click="emit('messageClick', $event)">
    <IconAlertBg48 />
    <div class="flex flex-col my-auto mr-auto">
      <p class="subheadline font-semibold">{{ $t('DailyReminder') }}</p>
      <p class="footnote system-gray-color">{{ $t('AddTodaysMood') }}</p>
    </div>
    <button type="button"
      class="flex my-auto"
      :title="$t('Actions.Close')"
      @click.stop="closeSelf">
      <IconDismissCircleBg20 class="system-gray-color" />
    </button>
  </div>
</template>
