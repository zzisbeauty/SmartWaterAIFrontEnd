<script setup lang="tsx">
import Edit from './components/Edit.vue'
import { handleDeleteData, handleFetchData } from './IndexApi'
import { getTableColumns, getTableButtonList, getSearchSchema } from './data'

/**
 * 弹窗相关
 */
const setConfirmRef = ref()
/**
 * 表格相关
 */
const dictId = ref('')
const singleTableRef = ref<InstanceType<typeof Table>>()
const currentRow = ref()

const handleCurrentChange = async (val) => {
  currentRow.value = val.val
  singleTableRef.value?.elTableRef?.toggleRowSelection(val.val)
}


// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
// const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleFetchData(
      {
        pageNo: unref(currentPage),
        pageSize: unref(pageSize),
        dictId: dictId.value,
        ...dealParams(searchParams.value, searchSchema)
      }
    )
    return {
      list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods

const btnAction = async (title,row?:any) => {
  dialogTitle.value = title
  switch (title) {
    case '新增':
      setConfigDialog(true)
      break
    case '编辑':
        editDialog(row)
      break
    case '字典配置':
      break
    case '删除':
        handleDelete(row)
      break
    default:
      break
  }
}


const searchSchema = reactive<FormSchema[]>(getSearchSchema)
const tableColumns = reactive<TableColumn[]>(getTableColumns(btnAction))
const tableButtonList = ref(getTableButtonList(btnAction))

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const editRef = ref()
const setConfigDialog = (visible) => {
  dialogVisible.value = visible
}
const editDialog = async (row = null) => {
  dialogVisible.value = true
  nextTick(() => {
    editRef.value.feedBackData(row)
  })
 
}
const handleDelete = async (row) => {
  const res:any = await handleDeleteData({
    id:row.id
  })
  if(res.code === 200){
    useMessage('success', res.message)
    getList()
  }
  
}



// 弹框确认提交
const dialogConfirm = debounce(async () => {
  let res
  if (dialogTitle.value == '新增'||dialogTitle.value == '编辑') {
    res = await editRef.value.submit()
  }else if(dialogTitle.value=="自动研判"||dialogTitle.value=="辅助研判"){
    res = await setConfirmRef.value.submit()
  }
  if (res === undefined) {
    return
  } else {
    if (res) {
      useMessage('success', res)
      setConfigDialog(false)
      getList()
    } else {
      useMessage('error', '操作失败')
    }
  }
}, 200)
const setDictId = (id)=>{
    dictId.value = id
    getList()
}
defineExpose({
  setDictId
})
</script>

<template>
  <div class="w-100% h-100% table-page-container">
    <!-- 搜索组件，该组件配置如下即可，不需改变 -->
    <Search
      :schema="searchSchema"
      isCol
      @search="setSearchParams"
      @reset="setSearchParams"
      @register="searchRegister"
    />
    <div class="p-15px pb0 card-container flex-1">
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
        highlight-current-row
        sortable
        showAction
        :border="false"
        :showOverflowTooltip="true"
        @register="tableRegister"
        @refresh="refresh"
      >
        <template #buttonSlot>
          <tableTitle>
            <ButtonList :list="tableButtonList" />
          </tableTitle>
        </template>
      </Table>
    </div>
    <Dialog
      :maxWidth="500"
      :maxHeight="500"
      :title="dialogTitle"
      v-model="dialogVisible"
    >
      <Edit :dictId="dictId" ref="editRef" />
      <template #footer>
        <BaseButton @click="dialogVisible = false">取消</BaseButton>
        <BaseButton type="primary" @click="dialogConfirm"> 确定 </BaseButton>
      </template>
    </Dialog>
  </div>
</template>

<style lang="less" scoped>

</style>
