<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { useEventListener } from '@vueuse/core'

// replaced dynamically
const reloadSW: any = '__RELOAD_SW__'

let checkSWUpdate: Function;

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegistered(r: any) {
    if (reloadSW === 'true') {
      checkSWUpdate = r?.update();
      r && setInterval(async () => {
        // eslint-disable-next-line no-console
        console.log('Checking for sw update')
        await r.update()
      }, 600000 /* 600s check for updates */)
    }
    else {
      // eslint-disable-next-line no-console
      console.log(`SW Registered: ${r}`)
    }
  },
});

useEventListener(document, 'visibilitychange', handleVisibilityChange);

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}

// function needsToSeePrompt() {
//   if (navigator?.standalone) {
//     return false;
//   }
//   let isApple = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
//   return isApple;
// }

function handleVisibilityChange(e: Event) {
  if ((document as Document)['hidden']) return;
  console.log(checkSWUpdate);
  if (reloadSW === 'true' && checkSWUpdate) checkSWUpdate();
}

</script>

<template>
  <TransitionRoot appear
    :show="needRefresh || offlineReady"
    as="template">
    <Dialog as="div"
      class="relative z-[1000]"
      @close="close">
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
      <div class="fixed inset-0 flex items-center justify-center"
        style="padding-top: calc(2rem + env(safe-area-inset-top))">
        <TransitionChild as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-y-full"
          enter-to="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-y-0"
          leave-to="translate-y-full">
          <DialogPanel v-if="needRefresh"
            class="w-full h-auto max-w-md mx-auto mt-auto rounded-t-[10px] px-4-safe pb-4-safe">
            <div class="rounded-xl action-sheet mb-2">
              <DialogTitle class="footnote w-full px-4 py-3 text-center items-center">
                {{ $t('NewVersionIsAvailable') }}
              </DialogTitle>
              <button type="button"
                class="primary w-full px-4 py-3 title-3"
                @click="close">
                {{ $t('Actions.Cancel') }}
              </button>
            </div>

            <button type="button"
              class="button-bg w-full px-4 py-3 rounded-xl primary title-3"
              @click="updateServiceWorker()">
              {{ $t('Actions.Update') }}
            </button>
          </DialogPanel>

          <DialogPanel v-else-if="offlineReady"
            class="w-full h-auto max-w-md mx-auto mt-auto rounded-t-[10px] px-4-safe pb-4-safe">
            <div class="rounded-xl action-sheet">
              <DialogTitle class="footnote w-full px-4 py-3 text-center items-center">
                {{ $t('OfflineReady') }}
              </DialogTitle>
              <button type="button"
                class="primary w-full px-4 py-3 title-3"
                @click="close">
                {{ $t('Actions.Cancel') }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>
</style>