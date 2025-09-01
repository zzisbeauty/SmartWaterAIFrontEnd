<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

// 定义数据接口类型
interface LinkConfigItem {
  id?: number | string
  questionContent?: string
  isSystem?: number | boolean
  apiName?: string
  categoryId_dictText?: string
  businessSystemCode_dictText?: string
}

interface ProcessedLinkConfigItem {
  id: number | string
  questionContent: string
  isSystem: string
  apiName: string
  categoryId_dictText: string
  businessSystemCode_dictText: string
}

// 定义 props 接收 data
const props = defineProps<{
  data: LinkConfigItem[]
}>()

// 表格数据
const dataList = ref<ProcessedLinkConfigItem[]>([])

// 监听 data 变化，并更新 dataList
watch(
  () => props.data,
  (newData) => {
    if (Array.isArray(newData)) {
      debugger
      dataList.value = newData.map((item, index) => ({
        id: item.id ?? `temp-${index + 1}`,
        questionContent: item.questionContent || '--',
        isSystem: item.isSystem_dictText,
        apiName: item.apiName || '--',
        categoryId_dictText: item.categoryId_dictText || '--',
        businessSystemCode_dictText: item.businessSystemCode_dictText || '--'
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
    <el-table-column prop="questionContent" label="提示语" align="center" />
    <el-table-column prop="isSystem" label="是否系统内API" align="center" />
    <el-table-column prop="apiName" label="接口名称" align="center" />
    <el-table-column prop="categoryId_dictText" label="所属分类" align="center" />
    <el-table-column prop="businessSystemCode_dictText" label="业务系统编码" align="center" />
  </el-table>
</template>

<style></style>
