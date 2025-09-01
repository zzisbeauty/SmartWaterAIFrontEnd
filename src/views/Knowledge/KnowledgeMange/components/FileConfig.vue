<script setup lang="tsx">
import AddFile from './AddFile.vue'
// import FileEdit from './FileEdit.vue'
import FileDetail from './FileDetail.vue'
import {
  handleDeleteFile,
  handleDownloadFile,
  handleFetchFileData,
  handleParseFile,
  switchStatusFile
} from '../IndexApi'
import { getFileTableColumns, getFileTableAction, getFileSearchSchema } from '../data'
import download from 'downloadjs'
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
/**
 * 执行按钮操作的异步函数
 * 根据提供的标题和行数据执行相应的操作
 * @param {string} title - 操作的标题，决定执行哪种操作（例如 '新增', '详情', '编辑', '删除'）
 * @param {Object} row - 表格中的一行数据，用于 '编辑' 和 '删除' 操作
 */
const btnAction = (title, row) => {
  switch (title) {
    case '新增':
      handleAddFile()
      break
    case '详情':
      handleFileSlice(row)
      break
    case '启停':
      handleStartAndStop(row)
      break
    case '解析':
      handleAnalysis(row)
      break
    case '停止':
      handleAnalysis(row)
      break
    case '下载':
      handleDownload(row)
      break
    case '删除':
      doDelete(row)
      break
    default:
      break
  }
}

// 新增文件
const addFile = ref(null)
const dialogVisibleAdd = ref(false)
const handleAddFile = async (row: any = {}) => {
  dialogVisibleAdd.value = true
}
const dialogAddConfirm = async () => {
  if (await addFile.value.submit()) {
    dialogVisibleAdd.value = false
    getList()
  }
}

// 文件切片详情
const dialogVisibleDetail = ref(false)
const dialogDetailTitle = ref('详情')
const fileDetail = ref()
const handleFileSlice = async (row) => {
  dialogVisibleDetail.value = true
  dialogDetailTitle.value = row.name
  await nextTick()
  fileDetail.value.feedBackData(row)
}
// 启停控制
const handleStartAndStop = (row) => {
  const params = {
    docId: row.id,
    status: row.status ? 0 : 1
  }
  switchStatusFile(params).then((res: any) => {
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      getList()
    } else {
      useMessage('error', res.message || '操作失败')
    }
  })
}
// 下载
const handleDownload = async (row: any = {}) => {
  handleDownloadFile({ fileId: row.id }).then((res: any) => {
    if (res.success) {
      fileExportBlob(res.result)
      useMessage('success', res.message)
    } else {
      useMessage('error', '下载失败')
    }
  })
}
// 文档删除
const doDelete = (row) => {
  handleDeleteFile({ docIdLis: row.id }).then((res) => {
    if (res.success) {
      getList()
      useMessage('success', res.message)
    } else {
      useMessage('error', '删除失败')
    }
  })
}

let progInterval = null
// 解析
const handleAnalysis = (row) => {
  const targetItem = dataList.value.find((e) => e.id === row.id)
  targetItem.parserStatus = '解析中'
  updataProgress(targetItem)
}
// 更新进度
const updataProgress = async (targetItem) => {
  if (!targetItem) return
  debugger

  const postData = {
    docIdList: [targetItem.id],
    deleteFlag: targetItem.parserStatus == '解析中' ? 'false' : 'true',
    runModel: targetItem.parserStatus == '解析中' ? '2' : '1'
  }

  // if (!targetItem.progress) {
  //   targetItem.progress = 0
  // }
  await handleParseFile(postData).then((res: any) => {
    if (res.success) {
      targetItem.progress = res.result.progress
      useMessage('success', res.message || '开始解析')
    } else {
      useMessage('error', res.message || '解析失败')
    }
  })

  try {
    const intervalCallback = async () => {
      if (targetItem.progress! >= 100) {
        targetItem.parserStatus = '已解析'
        clearInterval(progInterval)
      } else {
        // targetItem.progress! += 10
        updataDataList(targetItem)
      }
    }
    // 立即执行一次
    intervalCallback()
    progInterval = setInterval(intervalCallback, 5000)
  } catch (error) {
    console.error('解析失败', error)
    if (progInterval) {
      clearInterval(progInterval)
    }
    updataDataList(targetItem)
  }
}
const updataDataList = async (targetItem) => {
  const { currentPage, pageSize } = tableState
  const res: any = await handleFetchFileData({
    pageNo: unref(currentPage),
    pageSize: unref(pageSize),
    ragId: props.item.id,
    ...dealParams(searchParams.value, searchSchema)
  })
  targetItem.progress = res.result.records.find((e) => e.id === targetItem.id)
}
// 停止解析
const handleStopAnalysis = (row) => {
  const targetItem = dataList.value.find((e) => e.id === row.id)
  if (targetItem.parserStatus === '解析中') {
    targetItem.parserStatus = '已解析'
    // targetItem.status_dictText = '成功'
  }
}

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = async (params: any) => {
  if (params.timeRange?.length > 0) {
    params.openingTime = params?.timeRange[0] || ''
    params.expirationTime = params?.timeRange[1] || ''
    delete params.timeRange
  }
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleFetchFileData({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize),
      ragId: props.item.id,
      ...dealParams(searchParams.value, searchSchema)
    })
    return {
      list: res.result.records,
      // list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods

const searchSchema = reactive<FormSchema[]>(getFileSearchSchema)
const tableColumns = reactive<TableColumn[]>(getFileTableColumns(btnAction))
const tableButtonList = reactive(getFileTableAction(btnAction))
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
    <!-- 新增文件 -->
    <Dialog maxWidth="30%" maxHeight="50%" title="添加文件" v-model="dialogVisibleAdd">
      <AddFile ref="addFile" :item="props.item" />
      <template #footer>
        <BaseButton @click="dialogVisibleAdd = false">取消</BaseButton>
        <BaseButton type="primary" @click="dialogAddConfirm">确定</BaseButton>
      </template>
    </Dialog>
    <!-- 切片详情 -->
    <Dialog maxWidth="65%" maxHeight="85%" :title="dialogDetailTitle" v-model="dialogVisibleDetail">
      <FileDetail ref="fileDetail" />
    </Dialog>
  </div>
</template>
<style lang="less"></style>
<style lang="less" scoped></style>
