<script setup lang="tsx">
const requiredOptions = ref([])
const queryFieldTypeOptions = ref([])
const queryFieldparamLocation = ref([])

onMounted(async () => {
  requiredOptions.value = await getDictById({ code: 'yes_no' })
  queryFieldTypeOptions.value = await getDictById({ code: 'param_type' })
  queryFieldparamLocation.value = await getDictById({ code: 'param_location' })
})

const paramQuery = () => ({
  apiId: Number(new Date()).toString(),
  paramName: '',
  paramType: 'string',
  paramDesc: '',
  paramLocation: 'query',
  paramOrder: 0,
  required: '0',
  sample: '',
  createBy: '',
  createTime: '',
  updateBy: '',
  updateTime: ''
})
const handleAddQueryItem = () => {
  queryParameter.value.push(paramQuery())
}
const handleDeleteQuery = (index) => {
  queryParameter.value.splice(index, 1)
}
const handleUp = (index) => {
  const temp = queryParameter.value[index]
  queryParameter.value.splice(index, 1, queryParameter.value[index - 1])
  queryParameter.value.splice(index - 1, 1, temp)
}
const handleDown = (index) => {
  const temp = queryParameter.value[index]
  queryParameter.value.splice(index, 1, queryParameter.value[index + 1])
  queryParameter.value.splice(index + 1, 1, temp)
}

const headerBoxRef = ref()
const headerTableRef = ref()
const tableMaxHeight = ref(200) // 默认值，后面会重新计算

const calcTableMaxHeight = () => {
  nextTick(() => {
    if (headerBoxRef.value) {
      const boxHeight = headerBoxRef.value.clientHeight
      const buttonHeight = 40 // .add-btn 大概的高度
      const paddingOffset = 10 // 表头和padding偏移
      const maxHeight = boxHeight - buttonHeight - paddingOffset
      tableMaxHeight.value = maxHeight > 0 ? maxHeight : 200
    }
  })
}

onMounted(() => {
  calcTableMaxHeight()
  window.addEventListener('resize', calcTableMaxHeight)
})
onActivated(() => {
  // 如果使用了 keep-alive 缓存组件，这里也要重新计算
  calcTableMaxHeight()
})

// 组件卸载时移除监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', calcTableMaxHeight)
})

const handleParentResize = () => {
  calcTableMaxHeight()
}
const queryParameter = ref([])
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods
const submit = async () => {
  return {
    ...apiFromData.value,
    baseInfo: {
      ...apiFromData.value.baseInfo
    },
    paramInfo: [...(apiFromData.value.paramInfo || [])]
  }
}
const apiFromData: any = ref({})
const feedBackData = async (data) => {
  apiFromData.value = data
  console.log('paramsConfig-----feedBackData', data)
  queryParameter.value = data?.paramInfo.length ? data.paramInfo : [paramQuery()]
}
defineExpose({
  handleParentResize,
  submit,
  feedBackData
})
</script>
<template>
  <div class="h-100%" ref="headerBoxRef">
    <el-table
      :data="queryParameter"
      ref="headerTableRef"
      :max-height="tableMaxHeight"
      row-key="id"
      size="small"
    >
      <el-table-column prop="sort" label="序号" width="50">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="paramName" label="参数名" width="120">
        <template #default="scope">
          <el-input class="noBorder" v-model="scope.row.paramName" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="paramType" label="参数类型" width="120">
        <template #default="scope">
          <el-select
            class="noBorder"
            v-model="scope.row.paramType"
            :clearable="false"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in queryFieldTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="paramLocation" label="参数位置" width="120">
        <template #default="scope">
          <el-select
            class="noBorder"
            v-model="scope.row.paramLocation"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in queryFieldparamLocation"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="paramDesc" label="参数描述">
        <template #default="scope">
          <el-input class="noBorder" v-model="scope.row.paramDesc" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="paramOrder" label="参数排序">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="required" label="是否必填">
        <template #default="scope">
          <el-select
            class="noBorder"
            v-model="scope.row.required"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in requiredOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sample" label="示例">
        <template #default="scope">
          <el-input class="noBorder" v-model="scope.row.sample" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="200" fixed="right">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleUp(scope.$index)">上移</el-button>
          <el-button type="text" size="small" @click="handleDown(scope.$index)">下移</el-button>
          <el-button type="text" size="small" @click="handleDeleteQuery(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="mt-4 w-100% add-btn"
      color="var(--el-color-primary)"
      plain
      @click="handleAddQueryItem"
    >
      + 新建参数
    </el-button>
  </div>
</template>

<style lang="less" scoped>
.add-btn {
  border-style: dashed;
  background-color: rgba(255, 255, 255, 0) !important;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
