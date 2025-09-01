<script setup lang="tsx">
import Detail from './components/Detail.vue'
import Edit from './components/Edit.vue'
import { handleDelete, handleFetchData, handleExport } from './IndexApi'
import { getTableColumns, getTableButtonList, getSearchSchema } from './data'

const singleTableRef = ref<{ elTableRef: any } & InstanceType<typeof Table>>()
const currentRow = ref()
const edit = ref()
const handleCurrentChange = async (val) => {
  currentRow.value = val.val
  singleTableRef.value?.elTableRef?.toggleRowSelection(val.val)
}

/**
 * 执行按钮操作的异步函数
 * 根据提供的标题和行数据执行相应的操作
 * @param {string} title - 操作的标题，决定执行哪种操作（例如 '新增', '详情', '编辑', '删除'）
 * @param {Object} row - 表格中的一行数据，用于 '编辑' 和 '删除' 操作
 */
const btnAction = async (title, row) => {
  // const elTableExpose: any = await getElTableExpose()
  // const rows = elTableExpose.getSelectionRows()
  // dialogTitle.value = title
  switch (title) {
    case '新增':
      editDialog()
      break
    case '导出':
      doExport(row)
      break
    case '详情':
      handleShowDetail(row)
      break
    case '编辑':
      editDialog(row)
      break
    case '删除':
      doDelete(row)
      break
    default:
      break
  }
}

// 新增-编辑
const dialogEditTitle = ref('新增')
const dialogEditVisible = ref(false)
const editDialog = async (row: any = {}) => {
  dialogEditTitle.value = `${row?.id ? '编辑' : '新增'}`
  dialogEditVisible.value = true
  await nextTick()
  edit.value.feedBackData(row)
}
const dialogEditConfirm = debounce(
  async () => {
    if (await edit.value.submit()) {
      dialogEditVisible.value = false
      getList()
    }
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)
// 详情
const dialogVisibleDetail = ref(false)
const dialogDetailTitle = ref('详情')
const detail = ref()
const handleShowDetail = async (row) => {
  dialogVisibleDetail.value = true
  dialogDetailTitle.value = `详情`
  await nextTick()
  detail.value.feedBackData(row)
}
// 行删除
const doDelete = (row) => {
  handleDelete({ id: row.id }).then((res) => {
    if (res.success) {
      getList()
      useMessage('success', res.message)
    } else {
      useMessage('error', '删除失败')
    }
  })
}
// 导出
const doExport = async (row) => {
  const params = await getSearchParam()
  const elTableExpose = await getElTableExpose()
  const rows = elTableExpose.getSelectionRows()
  handleExport(params).then((res) => {
    if (res.success) {
      fileExport(res.result, 'ASR基础信息.xlsx')
      useMessage('success', res.message)
    } else {
      useMessage('error', '导出失败')
    }
  })
}

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = async (params: any) => {
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleFetchData(
      {
        pageNo: unref(currentPage),
        pageSize: unref(pageSize),
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

const searchSchema = reactive<FormSchema[]>(getSearchSchema)
const tableColumns = reactive<TableColumn[]>(getTableColumns(btnAction))
const tableButtonList = ref(getTableButtonList(btnAction))
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
  </div>
  <!-- 新增 -->
  <Dialog maxWidth="40%" maxHeight="50%" :title="dialogEditTitle" v-model="dialogEditVisible">
    <Edit ref="edit" />
    <template #footer>
      <BaseButton @click="dialogEditVisible = false">取消</BaseButton>
      <BaseButton type="primary" @click="dialogEditConfirm">确定</BaseButton>
    </template>
  </Dialog>
  <!-- 详情 -->
  <Dialog maxWidth="30%" maxHeight="35%" :title="dialogDetailTitle" v-model="dialogVisibleDetail">
    <Detail ref="detail" />
  </Dialog>
</template>

<style lang="less" scoped></style>
