<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'

const props = defineProps<{
  modelValue: boolean,
  title: string,
  isEdit?: boolean,
  formValid?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'submitClicked',): void,
}>()

const isOpen = computed({
  // getter
  get() {
    return props.modelValue;
  },
  // setter
  set(newValue: boolean) {
    emit('update:modelValue', newValue);
  }
})

const setIsOpen = (value: boolean) => {
  isOpen.value = value
}
</script>
<template>
  <TransitionRoot appear
    :show="isOpen"
    as="template">
    <Dialog as="div"
      :open="isOpen"
      class="relative z-[1000]"
      @close="setIsOpen">
      <TransitionChild as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25"></div>
      </TransitionChild>

      <!-- Full-screen container to center the panel -->
      <div class="fixed inset-0 flex items-center justify-center pt-8">
        <TransitionChild as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-y-full"
          enter-to="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-y-0"
          leave-to="translate-y-full">
          <DialogPanel class="w-full h-full max-w-3xl mx-auto rounded-t-[10px] px-4 modal-bg">
            <div class="modal-header-wrapper w-full h-[54px] text-center items-center flex">
              <div class="w-1/4 text-left">
                <button type="button"
                  class="primary"
                  @click="setIsOpen(false)">{{ $t('Actions.Cancel') }}</button>
              </div>
              <DialogTitle class="font-semibold w-1/2">
                {{ props.title }}
              </DialogTitle>
              <div class="w-1/4 text-right">
                <button type="submit"
                  class="primary font-semibold"
                  :disabled="!props.formValid"
                  @click="emit('submitClicked')">{{ props.isEdit ? $t('Edit') : $t('Actions.Add') }}</button>
              </div>
            </div>

            <slot></slot>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>