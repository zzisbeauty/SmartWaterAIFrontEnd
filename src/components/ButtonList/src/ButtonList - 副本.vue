<script setup lang="ts">
import { BaseButton } from '@/components/Button'
defineProps({
  list: {
    type: Array as any,
    default: () => {
      return []
    }
  }
})
</script>

<template>
  <BaseButton
    :disabled="item.disabled"
    v-for="item in list"
    :key="item.label"
    v-actPermission="item.code"
    :type="item.type ? item.type : 'primary'"
    @click="item.callback()"
  >
    {{ item.label }}</BaseButton
  >
</template>
