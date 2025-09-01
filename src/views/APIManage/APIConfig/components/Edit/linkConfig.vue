<script setup lang="tsx">
import { da } from 'element-plus/es/locale'
import { handleGetlinkTableList } from '../../IndexApi'

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods

const searchParams = ref({})

const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: false, //设置为立即请求，默认为false
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = dealParams(searchParams.value, searchSchema)
    const res: any = await handleGetlinkTableList({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize),
      ...params
    })
    return {
      list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods
/**
 * 定义搜索表单项配置集合，每个对象表示一个搜索条件字段
 * 包含字段标识、显示标签、组件类型及组件属性配置
 */
const searchSchema = reactive<FormSchema[]>([
  {
    label: '',
    field: 'questionContent',
    component: 'Input',
    ConditionalType: '*',
    componentProps: { span: 6, placeholder: '请输入提示语' }
  },
  {
    label: '',
    field: 'apiName',
    component: 'Input',
    ConditionalType: '*',
    componentProps: { span: 6, placeholder: '请输入接口名称' }
  },
  {
    label: '',
    field: 'categoryId',
    component: 'Select',
    componentProps: { span: 6, placeholder: '请选择所属分类' },
    optionApi: async () => {
      const res = await getDictById({ code: 'api_categray' })
      return res || []
    }
  },
  {
    label: '',
    field: 'businessSystemCode',
    component: 'Select',
    componentProps: { span: 6, placeholder: '请选择业务系统' },
    optionApi: async () => {
      const res = await getDictById({ code: 'business_code' })
      return res || []
    }
  }
])

/**
 * 定义表格列配置集合
 * 每个对象表示一列
 * 包含字段映射、显示标签、样式设置及自定义插槽组件
 */
const tableColumns = reactive<TableColumn[]>([
  {
    type: 'selection',
    fixed: 'left',
    field: ''
  },
  {
    field: 'index',
    label: '序号',
    type: 'index'
  },

  {
    label: '提示语',
    field: 'questionContent'
  },

  {
    label: '接口名称',
    field: 'apiName'
  },

  {
    label: '所属分类',
    field: 'categoryId_dictText'
  },

  {
    label: '业务系统',
    field: 'businessSystemCode_dictText'
  }
])
const singleTableRef = ref<InstanceType<typeof Table>>()
const currentRow = ref()
const isSystem = ref(1)
const handleCurrentChange = async (val) => {
  currentRow.value = val.currentRow
}
const selection = ref([]) // 存储所有选中的行

// 处理勾选变化事件
const handleSelectionChange = (val) => {
  //将val里面的id重命名为apiId
  const processedVal = val.map((item) => {
    const newItem = { ...item }
    newItem.questionId = newItem.id
    newItem.isSystem = '1'
    return newItem
  })
  selection.value = Array.isArray(processedVal) ? [...processedVal] : []
  console.log('selectionChange', selection.value)
  apiFromData.value.linkInfo = [...selection.value]
}
const { formRegister, formMethods } = useForm()
const submit = async () => {
  return {
    ...apiFromData.value,
    baseInfo: {
      ...apiFromData.value.baseInfo
    },
    paramInfo: [...(apiFromData.value.paramInfo || [])],
    questionInfo: [...(apiFromData.value.questionInfo || [])],
    linkInfo: [...(apiFromData.value.linkInfo || [])],
    linkInfoNo: isSystem.value
  }
}
const apiFromData: any = ref({})
const feedBackData = async (data) => {
  apiFromData.value = data
  console.log('linkConfig-----feedBackData', data)
  isSystem.value = data && 'linkInfoNo' in data ? data.linkInfoNo : 1
  await getList()
  const elTableExpose: any = await getElTableExpose()
  // 获取当前表格选中的行
  const selectedRows = data.linkInfo
  // 清除之前的选中状态
  elTableExpose.clearSelection()
  console.log('selectedRows', selectedRows)
  console.log('dataList', dataList.value)
  // 根据 data.linkInfo 设置选中状态
  if (Array.isArray(selectedRows) && selectedRows.length > 0) {
    dataList.value.forEach((row) => {
      console.log('row', row)
      const isSelected = selectedRows.some((selectedRow) => {
        return selectedRow.questionId === row.id
      })
      console.log('isSelected', isSelected)
      if (isSelected) {
        elTableExpose.toggleRowSelection(row, true)
      }
    })
  }
}
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="flex flex-col h-100%">
    <div class="flex items-center">
      <div class="p-x-20px color-#333">关联内部API</div>
      <div>
        <ElRadioGroup v-model="isSystem">
          <ElRadio :label="1">是</ElRadio>
          <ElRadio :label="0">否</ElRadio>
        </ElRadioGroup>
      </div>
    </div>
    <div class="py-10px" v-if="isSystem == 1">提示语：</div>
    <div class="w-100% flex-1 table-page-container el-card box-border" v-if="isSystem == 1">
      <!-- 搜索组件，该组件配置如下即可，不需改变 -->
      <Search
        :schema="searchSchema"
        marginBottom="0"
        isCol
        @search="setSearchParams"
        @reset="setSearchParams"
        @register="searchRegister"
      />
      <div class="px-15px pb0 card-container flex-1">
        <!-- 表格组件，该组件配置如下即可，不需改变 -->
        <Table
          ref="singleTableRef"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="tableColumns"
          :data="dataList"
          :loading="loading"
          :pagination="{
            total: total
          }"
          @handle-row-click="handleCurrentChange"
          @selection-change="handleSelectionChange"
          highlight-current-row
          sortable
          :showAction="false"
          :border="false"
          :showOverflowTooltip="true"
          @register="tableRegister"
          @refresh="refresh"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
