<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { useVModel } from '@vueuse/core'
const modelValue = defineModel<any>('modelValue')
const emit = defineEmits(['change'])

// 更新值的方法
function updateValue(value: any) {
  modelValue.value = value
  emit('change', value)
}
</script>

<template>
  <div class="custom-form-item">
    <slot :value="modelValue" :update:value="updateValue"> </slot>
  </div>
</template>
