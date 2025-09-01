<script setup lang="tsx">
import Detail from './components/Detail.vue'
import ResParams from './components/ResParams.vue'
import DetailTitle from '@/views/Components/DetailTitle.vue'
import { handleGetTableList } from './IndexApi'
import { getTableColumns, getTableButtonList } from './data'
const activeNames = ref(['1', ''])
const btnAction = async (title, row) => {
  // const elTableExpose: any = await getElTableExpose()
  // const rows = elTableExpose.getSelectionRows()
  // dialogTitle.value = title
  switch (title) {
    case '导出':
      doExport(row)
      break
    case '请求参数':
      handleShowParams(row)
      break
    case '复制':
      handleCopyVal(row)
      break
    case '详情':
      handleShowDetail(row)
      break
    default:
      break
  }
}

// 搜索表单数据
const searchForm = reactive({
  applicationName: '',
  operatorName: '',
  logType: [],
  account: '',
  operationType: '',
  clientIp: '',
  requestMethod: [],
  requestType: [],
  requestPath: '',
  timeRangeStart: null,
  timeRangeEnd: null,
  timeRange: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)] as any
})

// 查询
const handleSearch = () => {
  getList()
}

const resetForm = () => {
  refresh()
}
// 请求参数
const dialogVisibleResParams = ref(false)
const dialogTitleResParams = ref('请求参数')
const resParams = ref()
const handleShowParams = async (row) => {
  dialogVisibleResParams.value = true
  dialogTitleResParams.value = `请求参数`
  await nextTick()
  resParams.value.feedBackData(row)
}
// 详情
const dialogVisibleDetail = ref(false)
const dialogTitleDetail = ref('详情')
const detail = ref()
const handleShowDetail = async (row) => {
  dialogVisibleDetail.value = true
  dialogTitleDetail.value = `日志详情`
  await nextTick()
  detail.value.feedBackData(row)
}

import { useClipboard } from '@vueuse/core'

// 复制到剪切板
const handleCopyVal = async (val) => {
  const { copy, copied, isSupported } = useClipboard({
    source: `${val}`,
    legacy: true
  })
  if (!isSupported) {
    useMessage('error', '当前浏览器不支持复制')
  } else {
    await copy()
    if (unref(copied)) {
      useMessage('success', '复制成功')
    }
  }
}
// 导出
const doExport = async (row) => {
  // const params = await getSearchParam()
  // handleExport(params).then((res: any) => {
  //   if (res.success) {
  //     fileExport(res.result, 'api文档.xlsx')
  //     useMessage('success', res.message)
  //   } else {
  //     useMessage('error', '导出失败')
  //   }
  // })
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleGetTableList({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize)
    })
    return {
      list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods

const tableColumns = reactive<TableColumn[]>(getTableColumns(btnAction))
const tableButtonList = ref(getTableButtonList(btnAction))
</script>

<template>
  <div class="w-100% h-100% table-page-container">
    <!-- 搜索组件 -->
    <div class="p-15px mb10px card-container">
      <el-collapse v-model="activeNames" class="collapse-container">
        <DetailTitle
          :show-expand="true"
          :item="{
            titleZn: '基础条件: ',
            titleEn: '',
            name: '1',
            activeNames: activeNames
          }"
        >
          <el-form :model="searchForm" label-width="100px" class="search-form">
            <!-- 第一行 -->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="应用名称:">
                  <el-input v-model="searchForm.applicationName" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="日志类型:">
                  <el-select v-model="searchForm.logType" multiple placeholder="请选择">
                    <el-option label="操作日志" value="operation" />
                    <el-option label="系统日志" value="system" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="操作类型:">
                  <el-select v-model="searchForm.operationType" placeholder="请选择">
                    <el-option label="新增" value="add" />
                    <el-option label="更新" value="update" />
                    <el-option label="删除" value="delete" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="操作用户账号:">
                  <el-input v-model="searchForm.account" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="操作用户名称:">
                  <el-input v-model="searchForm.clientIp" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户端IP:">
                  <el-input v-model="searchForm.clientIp" placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </DetailTitle>
        <DetailTitle
          :show-expand="true"
          :item="{
            titleZn: '高级条件: ',
            titleEn: '',
            name: '2',
            activeNames: activeNames
          }"
        >
          <div>
            <!-- 高级条件表单 -->
            <el-form :model="searchForm" label-width="100px">
              <!-- 第一行 -->
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="请求方法:">
                    <el-select v-model="searchForm.requestMethod" multiple placeholder="请选择">
                      <el-option label="GET" value="GET" />
                      <el-option label="POST" value="POST" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="请求路径:">
                    <el-input v-model="searchForm.requestPath" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="请求类型:">
                    <el-select v-model="searchForm.requestType" multiple placeholder="请选择">
                      <el-option label="XHR" value="1" />
                      <el-option label="FETCH" value="2" />
                      <el-option label="APIFox" value="3" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="耗时范围:">
                    <el-input
                      v-model="searchForm.timeRangeStart"
                      :min="0"
                      placeholder="最小值"
                      type="number"
                      style="width: 47%; margin-right: 5px"
                      ><template #suffix>ms</template>
                    </el-input>
                    -
                    <el-input
                      v-model="searchForm.timeRangeEnd"
                      :min="0"
                      placeholder="最大值"
                      type="number"
                      style="width: 47%; margin-left: 5px"
                    >
                      <template #suffix>ms</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第二行 -->
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="操作时间:">
                    <el-date-picker
                      v-model="searchForm.timeRange"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </DetailTitle>
        <div class="flex justify-end mt-6px">
          <BaseButton type="primary" @click="handleSearch">
            <Icon icon="ep:search" class="mr6px" /> 查询
          </BaseButton>
          <BaseButton plain @click="resetForm">
            <Icon icon="ep:refresh-right" class="mr6px" /> 重置
          </BaseButton>
        </div>
      </el-collapse>
    </div>
    <!-- 表格 -->
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
  </div>
  <!-- 请求参数 -->
  <Dialog
    maxWidth="50%"
    maxHeight="70%"
    :title="dialogTitleResParams"
    v-model="dialogVisibleResParams"
  >
    <ResParams ref="resParams" />
    <template #footer>
      <BaseButton @click="dialogVisibleResParams = false">取消</BaseButton>
    </template>
  </Dialog>
  <!-- 详情 -->
  <Dialog maxWidth="50%" maxHeight="70%" :title="dialogTitleDetail" v-model="dialogVisibleDetail">
    <Detail ref="detail" />
  </Dialog>
</template>

<style lang="less" scoped>
.collapse-container {
  height: 100%;
  border: none;

  :deep(.el-collapse-item) {
    .el-collapse-item__wrap {
      border: none !important;
    }

    .el-collapse-item__content {
      padding-bottom: 0;

      .el-row {
        height: 48px;
        .el-form-item--default > div {
          padding-right: 12px;
        }
      }
    }
  }
}
</style>
