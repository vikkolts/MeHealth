<script setup lang="ts">
import IconHeart28 from "./icons/IconHeart28.vue";
import IconCalendar28 from "./icons/IconCalendar28.vue";
import { RouterLink } from "vue-router";
import IconSettings28 from "./icons/IconSettings28.vue";


function toggleAnimClass(e: Event) {
  const el = (e.target as HTMLAnchorElement);
  setTimeout(() => { el.classList.add('router-ling-svg-anim') }, 100);
  setTimeout(() => { el.classList.remove('router-ling-svg-anim') }, 500);
}
</script>

<template>
  <header class="nav-header nav-header-bg">
    <nav class="h-[49px] max-w-3xl mx-auto grid grid-cols-3 align-middle text-center system-gray-color font-medium">
      <RouterLink to="/"
        class="w-full caption-3 justify-center items-center pt-[5px]"
        activeClass="system-blue-color"
        @click="toggleAnimClass">
        <IconHeart28 class="mx-auto mb-[2px] pointer-events-none" />
        {{ $t('Pages.Summary') }}
      </RouterLink>

      <RouterLink to="/calendar"
        class="w-full caption-3 justify-center items-center pt-[5px]"
        activeClass="system-blue-color"
        @click="toggleAnimClass">
        <IconCalendar28 class="mx-auto mb-[2px] pointer-events-none" />
        {{ $t('Pages.Calendar') }}
      </RouterLink>

      <RouterLink to="/settings"
        class="w-full caption-3 justify-center items-center pt-[5px]"
        activeClass="system-blue-color"
        @click="toggleAnimClass">
        <IconSettings28 class="mx-auto mb-[2px] pointer-events-none" />
        {{ $t('Pages.Settings') }}
      </RouterLink>
    </nav>
  </header>
</template>