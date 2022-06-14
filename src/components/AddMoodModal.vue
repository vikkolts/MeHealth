<script setup lang="ts">
import TheModal from "../components/TheModal.vue";
import { computed, onMounted, reactive, watch } from "vue";
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from "@headlessui/vue";
import { useMoodTypesStore, type DBMoodRecord } from "@/stores/moodTypes";
import { storeToRefs } from 'pinia';
import { formatISO } from "date-fns";

const props = defineProps<{
  modelValue: boolean,
  editData?: DBMoodRecord,
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'recordCreated'): void,
}>()

const today = new Date();

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
  id: null as any,
  mood: '' as '' | number,
  date: formatISO(new Date(), { representation: 'date' }),
  notes: '',
});

const formValid = computed(() => !!(modal.date && modal.mood !== '' && new Date(modal.date) <= today))

onMounted(() => store.getMoodsList())

function clearModalData() {
  modal.id = null;
  modal.date = formatISO(new Date(), { representation: 'date' });
  modal.mood = '';
  modal.notes = '';
}

watch(isOpenAddModal, (newValue) => {
  if (newValue === false)
    clearModalData();
  else if (newValue && props.editData) {
    modal.id = props.editData?.id;
    modal.date = props.editData?.date || '';
    modal.mood = props.editData?.mood_id ?? '';
    modal.notes = props.editData?.notes || '';
  }
})

async function addMoodRecord() {
  if (!(formValid.value)) return;
  const formData = {
    date: modal.date,
    mood_id: +modal.mood,
    notes: modal.notes || undefined,
  };
  if (modal.id) Object.assign(formData, { id: +modal.id });
  try {
    await store.saveMoodRecord(formData);
  } catch (e: any) {
    alert(e?.message || 'Error occurred')
  }
  isOpenAddModal.value = false;
  emit("recordCreated");
}
</script>

<template>
  <TheModal v-model="isOpenAddModal"
    :is-edit="props.editData?.id ? true : false"
    :title="$t('HowAreYou')"
    @submit-clicked="addMoodRecord"
    :form-valid="formValid">
    <form @submit.prevent="addMoodRecord">
      <div class="item-white-bg px-4 py-[5px] flex justify-between items-center rounded-[10px] mb-8 item-white-bg">
        <label class="body-text"
          for="modal-date-picker">{{ $t('Date') }}</label>
        <input v-model="modal.date"
          type="date"
          class="px-[12px] py-[6px] rounded-lg body-text input-datepicker"
          id="modal-date-picker"
          required>
      </div>
      <RadioGroup v-model="modal.mood"
        aria-required="true"
        class="items-center mb-8">
        <RadioGroupLabel class="footnote block ml-2 mb-[6px] uppercase system-gray-color">{{ $t('SelectMood') }}</RadioGroupLabel>
        <div class="grid grid-cols-6 rounded-lg cursor-pointer p-[2px] mood-radio-group radio-group-bg">
          <RadioGroupOption v-for="m in moodTypes"
            :key="m.id"
            v-slot="{ checked }"
            :value="m.id"
            class="body-text relative">
            <div :class="[checked ? 'radio-checked' : '', 'text-center w-full px-4 py-[6px] align-middle items-center']">{{ m.emoji }}</div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <label class="footnote w-full ml-2 mb-[6px] uppercase system-gray-color"
        for="modal-notes">{{ $t('AdditionalInformation') }}</label>
      <textarea v-model="modal.notes"
        id="modal-notes"
        class="item-white-bg resize-none rounded-[10px] p-4 body-text w-full mb-4"
        rows="15"
        :placeholder="$t('Notes')"></textarea>
    </form>
  </TheModal>
</template>