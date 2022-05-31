<script setup lang="ts">
import IconHeart28 from "./icons/IconHeart28.vue";
import IconCalendar28 from "./icons/IconCalendar28.vue";
import { RouterLink } from "vue-router";

</script>

<template>
  <header class="nav-header">
    <nav class="h-[49px] grid grid-cols-3 align-middle text-center system-gray-color font-medium">
      <RouterLink to="/"
        class="w-full caption-2 justify-center items-center pt-[5px]"
        activeClass="system-blue-color">
        <IconHeart28 class="flex mx-auto" />
        {{ $t('Pages.Summary') }}
      </RouterLink>

      <RouterLink to="/calendar"
        class="w-full caption-2 justify-center items-center pt-[5px]"
        activeClass="system-blue-color">
        <IconCalendar28 class="flex mx-auto" />
        {{ $t('Pages.Calendar') }}
      </RouterLink>
      <RouterLink to="/settings"
        class="w-full caption-2 justify-center items-center pt-[5px]"
        activeClass="system-blue-color">
        <IconCalendar28 class="flex mx-auto" />
        {{ $t('Pages.Settings') }}
      </RouterLink>
    </nav>

    <!-- <label for="locale-select">Language</label>
      <select id="locale-select"
        v-model="currentLocale">
        <option v-for="optionLocale in SUPPORT_LOCALES"
          :key="optionLocale"
          :value="optionLocale">
          {{ optionLocale }}
        </option>
      </select> -->
  </header>
</template>