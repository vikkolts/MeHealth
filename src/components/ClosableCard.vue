<script setup lang="ts">
import { addDays, endOfDay, setHours, setMinutes, setSeconds } from "date-fns";
import { ref } from "vue";
import IconAlertBg48 from "./icons/IconAlertBg48.vue";
import IconDismissCircleBg20 from "./icons/IconDismissCircleBg20.vue";
import { useCookies } from "vue3-cookies";

const emit = defineEmits<{
  (e: 'messageClick', event: Event): void
}>()

const { cookies } = useCookies();
const show = ref(true)
function closeSelf() {
  const today = new Date();
  const repeatYesterday = setSeconds(setMinutes(setHours(addDays(today, 1), 19), 0), 0);
  show.value = false;
  cookies.set('repeat-alert-after', repeatYesterday.toISOString(), repeatYesterday);
}

</script>

<template>
  <div v-if="show"
    class="system-white-bg cursor-pointer rounded-[10px] px-4 py-[12px] flex gap-4"
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
