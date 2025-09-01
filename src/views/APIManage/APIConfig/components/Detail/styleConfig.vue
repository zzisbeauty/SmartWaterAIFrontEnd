<script setup lang="tsx">
import { ref, defineProps, watch } from 'vue'

// 定义 props 接收 data
const props = defineProps<{
  data: any
}>()
console.log('styleConfig props', props)
console.log('styleConfig props', props.data[0])
// const importUrl = (url: string) => {
//   return new URL(`/src/assets/imgs/mockimg/style${url}.png`, import.meta.url).href
// }
</script>
<template>
  <div>
    <div class="flex items-center mb-10px">
      <div class="bold label-text m-r-10px"> 样式选择 : </div>
      <div class="flex-1">{{ data && data.length > 0 ? data[0].styleName : '' }}</div>
    </div>
    <div class="flex">
      <div class="bold m-r-30px">预览:</div>
      <div class="el-card max-w-400px max-h-400px flex-1 card p-20px">
        <div class="w-100% h-100% img bg-[var(--el-color-primary-light-11)] text-center">
          <img class="v-mid w-100% h-100%" v-if="data && data.length > 0" :src="data[0].iconUrl" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
