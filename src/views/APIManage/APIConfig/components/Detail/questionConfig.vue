<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

// 定义问题项的接口类型
interface QuestionItem {
  id?: number | string
  questionContent?: string
}

// 定义 props 接收 data
const props = defineProps<{
  data: QuestionItem[]
}>()

// 表格数据
const dataList = ref<Array<{ id: number | string; questionContent: string }>>([])

// 监听 data 变化，并更新 dataList
watch(
  () => props.data,
  (newData) => {
    if (Array.isArray(newData)) {
      dataList.value = newData.map((item, index) => ({
        id: item.id ?? `question-${index + 1}`, // 使用空值合并操作符，确保有默认ID
        questionContent: item.questionContent || '--' // 假设字段名为 question
      }))
    } else {
      dataList.value = []
    }
  },
  { immediate: true, deep: true }
)
</script>
<template>
  <el-table :data="dataList" row-key="id" class="mt-15px" max-height="250">
    <el-table-column width="50" type="index" align="center" label="序号" />
    <el-table-column prop="questionContent" label="提问语" align="center" />
  </el-table>
</template>

<style></style>
