<script setup lang="ts">
import TheModal from "../components/TheModal.vue";
import { computed, reactive, watch } from "vue";
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from "@headlessui/vue";
import { useMoodTypesStore } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia'

const props = defineProps<{
  modelValue: boolean,
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpenAddModal = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: boolean) {
    emit('update:modelValue', newValue);
  }
})
const store = useMoodTypesStore()
const { moodTypes } = storeToRefs(store)
const modal = reactive({
  mood: '',
  date: '',
  notes: '',
});

function clearModalData() {
  modal.date = '';
  modal.mood = '';
  modal.notes = '';
}

watch(isOpenAddModal, (newValue) => {
  if (newValue === false)
    clearModalData();
})

async function addMood() {
  if (!(modal.date && modal.mood)) return;
  const formData = {
    date: modal.date,
    mood_id: +modal.mood,
    notes: modal.notes || undefined,
  };
  try {
    await store.saveMoodRecord(formData);
  } catch (e) {
    console.log(e)
  }
  isOpenAddModal.value = false;
}
</script>

<template>
  <TheModal v-model="isOpenAddModal"
    :title="$t('HowAreYou')"
    @submit-clicked="addMood">
    <form>
      <div class="bg-white px-4 py-[5px] flex justify-between items-center rounded-[10px] mb-8">
        <label class="body-text"
          for="modal-date-picker">{{ $t('Date') }}</label>
        <input v-model="modal.date"
          type="date"
          class="px-[12px] py-[6px] rounded-lg body-text"
          style="background-color: var(--system-gray-5);"
          id="modal-date-picker"
          required>
      </div>
      <RadioGroup v-model="modal.mood"
        aria-required="true"
        class="items-center mb-8">
        <RadioGroupLabel class="footnote block ml-2 mb-[6px] uppercase system-gray-color">{{ $t('SelectMood') }}</RadioGroupLabel>
        <div class="grid grid-flow-col justify-around rounded-lg cursor-pointer py-[2px] mood-radio-group"
          style="background-color: rgba(118, 118, 128, 0.12);">
          <RadioGroupOption v-for="(m, index) in moodTypes"
            :key="index"
            v-slot="{ checked }"
            :value="index"
            class="body-text relative">
            <span :class="[checked ? 'radio-checked' : '', 'px-4 py-[6px]']">{{ m }}</span>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <label class="footnote w-full ml-2 mb-[6px] uppercase system-gray-color"
        for="modal-notes">{{ $t('AdditionalInformation') }}</label>
      <textarea v-model="modal.notes"
        id="modal-notes"
        class="resize-none rounded-[10px] p-4 body-text w-full"
        rows="15"
        :placeholder="$t('Notes')"></textarea>
    </form>
  </TheModal>
</template>