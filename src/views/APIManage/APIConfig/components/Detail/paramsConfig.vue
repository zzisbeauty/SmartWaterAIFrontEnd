<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

// 定义参数项接口，增强类型安全
interface ParamItem {
  id?: number | string
  paramName?: string
  paramType?: string
  paramLocation?: string
  paramDesc?: string
  required?: boolean
  sample?: string
  paramOrder?: number
}

interface ProcessedParamItem {
  id: number | string
  paramName: string
  paramType: string
  paramLocation: string
  paramDesc: string
  required: string
  sample: string
  paramOrder: number
}

// 定义 props 接收 data
const props = defineProps<{
  data: ParamItem[]
}>()

// 表格数据
const dataList = ref<ProcessedParamItem[]>([])

// 监听 data 变化，并更新 dataList
watch(
  () => props.data,
  (newData) => {
    if (Array.isArray(newData)) {
      dataList.value = newData.map((item, index) => ({
        id: item.id ?? index + 1,
        paramName: item.paramName ?? '--',
        paramType: item.paramType ?? '--',
        paramLocation: item.paramLocation ?? '--',
        paramDesc: item.paramDesc ?? '--',
        required: item.required ? '是' : '否',
        sample: item.sample ?? '--',
        paramOrder: item.paramOrder ?? index + 1
      }))
    } else {
      dataList.value = []
    }
  },
  { immediate: true }
)
</script>
<template>
  <el-table :data="dataList" row-key="id" class="mt-15px" max-height="250">
    <el-table-column width="50" type="index" align="center" label="序号" />
    <el-table-column prop="paramName" label="参数名" align="center" />
    <el-table-column prop="paramType" label="参数类型" align="center" />
    <el-table-column prop="paramDesc" label="参数描述" align="center" />

    <el-table-column prop="paramLocation" label="参数位置" align="center" />
    <el-table-column prop="paramOrder" label="参数排序" align="center" />
    <el-table-column prop="required" label="是否必填" align="center" />
    <el-table-column prop="sample" label="示例" align="center" />
  </el-table>
</template>

<style></style>
