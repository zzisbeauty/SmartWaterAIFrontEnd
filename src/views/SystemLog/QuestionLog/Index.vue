<script setup lang="tsx">
import Dialogue from './components/Dialogue.vue'
import { handleFetchData } from './IndexApi'
import { getTableColumns, getTableButtonList, getSearchSchema } from './data'
const singleTableRef = ref<{ elTableRef: any } & InstanceType<typeof Table>>()
const currentRow = ref()
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
    case '导出':
      doExport(row)
      break
    case '详情':
      handleShowDetail(row)
    default:
      break
  }
}

// 详情
const dialogVisibleDialogue = ref(false)
const dialogTitleDialogue = ref('对话详情')
const dialogue = ref()
const handleShowDetail = async (row) => {
  dialogVisibleDialogue.value = true
  dialogTitleDialogue.value = `对话详情`
  await nextTick()
  dialogue.value.feedBackData(row)
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

// 定义搜索参数，并执行搜索事件
const searchForm = ref({
  applicationName: '',
  userAccount: '',
  createTime: dayjs().format('YYYY-MM-DD'),
  dialogueTheoryStart: '',
  dialogueTheoryEnd: ''
})

const applicationOptions = [
  {
    label: '智能客服助手',
    value: '1'
  },
  {
    label: '内涝监测助手',
    value: '2'
  }
]

// 查询
const handleSearch = () => {
  getList()
}

const resetForm = () => {
  refresh()
}
const filterText = ref('')

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleFetchData({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchForm
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
  <div id="dia" class="w-100% h-100% table-page-container">
    <div class="pl30px pt15px mb10px card-container">
      <el-form :model="searchForm" label-width="" inline class="custom-form">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="应用名称">
              <el-select v-model="searchForm.applicationName" filterable placeholder="请选择">
                <el-option
                  v-for="item in applicationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户账号">
              <el-input v-model="searchForm.userAccount" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="4">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchForm.createTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              /> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="对话论数范围">
              <div class="flex w-100% h-100%">
                <el-input v-model="searchForm.dialogueTheoryStart" type="number" />
                <span class="mx-20px">—</span>
                <el-input v-model="searchForm.dialogueTheoryEnd" type="number" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4" class=" ">
            <el-form-item label="">
              <BaseButton type="primary" @click="handleSearch">
                <Icon icon="ep:search" class="mr6px" /> 查询
              </BaseButton>
              <BaseButton plain @click="resetForm">
                <Icon icon="ep:refresh-right" class="mr6px" /> 重置
              </BaseButton>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

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
  <!-- 详情 -->
  <Dialog
    maxWidth="65%"
    maxHeight="70%"
    :title="dialogTitleDialogue"
    :header-slot="true"
    v-model="dialogVisibleDialogue"
    headerClass="custom-dialog-header"
  >
    <template #title>
      <div class="dialog-title-left">
        <div class="dialog-title-text">{{ dialogTitleDialogue }}</div>
        <div class="dialog-title-content"
          >应用名称:智能客服 丨用户账号：user466丨会话编号：CHAT7353489</div
        >
      </div>
      <div class="dialog-title-right">
        <div class="dialog-title-right__num"
          ><span>总轮数:12</span> <span>总用时:2356ms</span> <span>总tokens:4450</span></div
        >
        <div class="dialog-title-right__search">
          <el-input
            style="width: 180px; margin-right: 20px"
            v-model="filterText"
            clearable
            placeholder="搜索内容"
          >
            <template #prefix>
              <Icon class="cursor-pointer" icon="ep:search" color="#000000a6" />
            </template>
          </el-input>
          <BaseButton type="primary">导出会话</BaseButton>
        </div>
      </div>
    </template>
    <Dialogue ref="dialogue" />
    <template #footer>
      <!-- <BaseButton @click="dialogVisibleDialogue = false">取消</BaseButton> -->
      <BaseButton type="primary" @click="dialogVisibleDialogue = false">关闭</BaseButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.custom-form) {
  .el-row {
    height: 48px !important;

    .el-form-item--default > div {
      padding-right: 12px;
    }
  }

  .el-form-item {
    margin: 0;
  }

  .el-form-item__label {
  }
}
</style>
<style lang="less">
.custom-dialog-header {
  min-height: 80px !important;
  height: auto !important;
  background-color: #ffffff;
  border-bottom: 1px solid var(--el-border-color);

  .dialog-title-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    height: 100%;
    gap: 13px;

    .dialog-title-content {
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: 0em;
      color: #aaaaaa;
    }
  }

  .dialog-title-right {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    &__num {
      span {
        margin: 0 5px;
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0em;
        color: #333333;
      }
    }

    &__search {
    }
  }

  #dialog-header {
    display: flex;
    justify-content: flex-start;
    min-height: 80px;
    height: auto;
    padding: 10px 60px 10px 20px;
    box-sizing: border-box;
    gap: 20px;
  }
}
</style>
