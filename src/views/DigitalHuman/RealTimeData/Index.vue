<script setup lang="tsx">
import { handleGetTableList } from './IndexApi'
import { getTableColumns, getTableButtonList, getSearchSchema } from './data'
const singleTableRef: any = ref<InstanceType<typeof Table>>()
const currentRow = ref()
const handleCurrentChange = async (val) => {
  currentRow.value = val.val
  singleTableRef.value?.elTableRef?.toggleRowSelection(val.val)
}
// 复制到剪切板
const { copy, copied } = useClipboard()
const btnAction = async (title, row) => {
  switch (title) {
    case '下线':
      handleOffline(row)
      break
    case '预览':
      handlePreview(row)
      break
    case '复制':
      copy(row)
      if (copied) useMessage('success', '复制成功')
  }
}

// 下线
const handleOffline = debounce(
  (row) => {
    useMessage('success', '下线成功')
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)
const dialogImgTitle = ref('数字人')
const dialogVisibleImg = ref(false)
const dialogImgAvatar = ref('')
/* 图片预览 */
const handlePreview = (row) => {
  dialogImgTitle.value = row.name
  dialogVisibleImg.value = true
  dialogImgAvatar.value = row.image
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
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleGetTableList({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchParams.value
    })
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
  <!-- 图片预览 -->
  <Dialog
    :isMask="false"
    maxWidth="35%"
    maxHeight="70%"
    :title="dialogImgTitle"
    v-model="dialogVisibleImg"
  >
    <div class="bg-#FAFAFA h-100% w-100% box-border flex-center">
      <ElImage
        :src="dialogImgAvatar"
        fit="contain"
        style="
          width: 100%;
          height: 99%;
          padding: 40px;
          box-sizing: border-box;
          object-position: center;
        "
      />
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
// :deep(.el-table__row) {
//   td:last-child {
//     .cell {
//       padding: 0;
//     }
//   }
// }
</style>
