<script setup lang="tsx">
const paramQuery = () => ({
  apiId: Number(new Date()).toString(),
  questionContent: ''
})
const handleAddQueryItem = () => {
  questionarameter.value.push(paramQuery())
}
const handleDeleteQuery = (index) => {
  questionarameter.value.splice(index, 1)
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
const questionarameter = ref([])
const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods
const submit = async () => {
  return {
    ...apiFromData.value,
    baseInfo: {
      ...apiFromData.value.baseInfo
    },
    paramInfo: [...(apiFromData.value.paramInfo || [])],
    questionInfo: [...(apiFromData.value.questionInfo || [])]
  }
}
const apiFromData: any = ref({})
const feedBackData = async (data) => {
  apiFromData.value = data
  console.log('questionConfig-----feedBackData', data)
  questionarameter.value = data?.questionInfo?.length ? data.questionInfo : [paramQuery()]
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
      :data="questionarameter"
      ref="headerTableRef"
      :max-height="tableMaxHeight"
      row-key="apiId"
      size="small"
    >
      <el-table-column prop="sort" label="序号" width="50">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="questionContent" label="提问语">
        <template #default="scope">
          <el-input class="noBorder" v-model="scope.row.questionContent" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="200" fixed="right">
        <template #default="scope">
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
      + 新建提问语
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
.noBorder {
  &:hover {
  }
  // :deep(.el-input__wrapper),:deep(.el-select__wrapper){
  //     box-shadow: none !important;
  // }
}
</style>
