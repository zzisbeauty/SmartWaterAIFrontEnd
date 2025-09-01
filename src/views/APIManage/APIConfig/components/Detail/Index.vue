<script setup lang="tsx">
import { ref } from 'vue'
import Detail from './Detail.vue'
import type { Ref } from 'vue'

interface RowData {
  id: string | number
  [key: string]: any
}

const detail: Ref<InstanceType<typeof Detail> | null> = ref(null)

const feedBackData = async (row: RowData) => {
  if (detail.value) {
    try {
      await detail.value.getPageData({
        id: row.id
      })
    } catch (error) {
      console.error('获取页面数据失败:', error)
    }
  }
}

defineExpose({
  feedBackData
})
</script>

<template>
  <div class="w-100% h-100% flex flex-col pt-10px box-border">
    <div class="w-100% flex-1 relative">
      <div class="absolute inset-0">
        <div class="flex-1 h-100% overflow-hidden">
          <el-scrollbar ref="scrollDom" class="w-100% h-100% px-18px box-border">
            <Detail ref="detail" />
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
