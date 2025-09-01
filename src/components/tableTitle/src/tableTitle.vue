<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def('')
})
</script>
<template>
  <!-- <div class="flex flex-row flex-justify-between mb10px"> -->
  <div class="flex flex-row mb0px whitespace-nowrap">
    <div class="font-size-16px">{{ title }} </div>
    <div class="btn">
      <slot></slot>
    </div>
  </div>
</template>
