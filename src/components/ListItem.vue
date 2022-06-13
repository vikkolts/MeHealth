<script lang="ts" setup>

</script>

<template>
  <div name="list-item"
    class="system-white-bg body-text flex gap-4 pl-4 pr-2.5 items-center py-2 first-of-type:rounded-t-2xl last-of-type:rounded-b-2xl border-b cursor-pointer min-h-[47px]">
    <slot name="icon"></slot>
    <slot></slot>
    <div class="ml-auto flex items-center gap-3 system-gray-color">
      <slot name="side">
      </slot>
    </div>
  </div>
</template>

<style>
div[name=list-item]:last-child {
  border-bottom: none;
}
</style>