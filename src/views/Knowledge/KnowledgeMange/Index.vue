<template>
  <div class="w-100% h-100% table-page-container p-10px box-border">
    <!-- 搜索组件 -->
    <Search
      :schema="searchSchema"
      isCol
      @search="setSearchParams"
      @reset="setSearchParams"
      @register="searchRegister"
    />
    <!-- 应用列表 -->
    <el-scrollbar class="flex-1">
      <div class="w-100% h-100%">
        <div class="w-100% h-32px py-10px flex justify-between items-center">
          <div class="color-#333 bold">共{{ cardList.length }}个知识库</div>
          <BaseButton type="primary" @click="() => (dialogVisible = true)"
            ><Icon icon="svg-icon:app-plus" :size="16"/> <span>新增</span></BaseButton
          >
        </div>
        <div class="app-cards-container">
          <div class="app-card" v-for="(item, index) in cardList" :key="index">
            <div class="flex justify-between items-center mb0px">
              <div class="flex items-center gap-20px">
                <img
                  :src="importImg(`knowledge/知识库图标.png`)"
                  alt="Icon"
                  width="44px"
                  height="44px"
                />
                <div class="app-card-title">{{ item.name }}</div>
              </div>
              <div>
                <el-button @click="doDelete(item)" class="w-76px">删除</el-button>
                <el-button @click="editDialog(item)" class="w-76px" type="primary">编辑</el-button>
              </div>
            </div>
            <el-scrollbar :noresize="true" class="flex-1">
              <div class="app-card-introduction">{{ item.description || '暂无表述' }}</div>
            </el-scrollbar>
            <!-- 下方按钮 -->
            <div class="card-btn flex items-center text-center p-y-5px box-border">
              <div class="flex-1" v-actPermission="permissionCode.VIEW">
                <el-button type="primary" link @click="fullDialog('检索测试', item)">
                  <Icon icon="svg-icon:app-test" :size="22" class="m-3px" />
                  检索测试</el-button
                >
              </div>
              <div class="flex-1" v-actPermission="permissionCode.EDIT">
                <el-button type="primary" link @click="fullDialog('文件配置', item)">
                  <Icon icon="svg-icon:app-file" :size="22" class="m-3px" />
                  文件配置</el-button
                >
              </div>
              <div class="flex-1" v-actPermission="permissionCode.DELETE">
                <el-button type="primary" link @click="fullDialog('知识图谱', item)">
                  <Icon icon="svg-icon:app-atlas" :size="22" class="m-3px" />
                  知识图谱</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <!-- 新增 -->
  <Dialog maxWidth="30%" maxHeight="200" :title="dialogTitle" v-model="dialogVisible">
    <Add ref="add" />
    <template #footer>
      <BaseButton @click="dialogVisible = false">取消</BaseButton>
      <BaseButton type="primary" @click="dialogConfirm">确定</BaseButton>
    </template>
  </Dialog>
  <!-- 编辑 -->
  <Dialog
    maxWidth="60%"
    maxHeight="60%"
    :title="dialogTitleEdit"
    v-model="dialogVisibleEdit"
    :padding="0"
  >
    <Edit ref="edit" />
    <template #footer>
      <BaseButton @click="dialogVisibleEdit = false">取消</BaseButton>
      <BaseButton type="primary" @click="dialogEditConfirm">确定</BaseButton>
    </template>
  </Dialog>
  <FullDialog
    v-model="fullDialogVisible"
    title="返回知识库"
    body-class="customFull-body"
    @close="() => (fullDialogVisible = false)"
  >
    <RetrievalTest v-if="fullAction == '检索测试'" :item="fullItem" />
    <FileConfig v-if="fullAction == '文件配置'" :item="fullItem" />
    <KnowledgeGraph v-if="fullAction == '知识图谱'" :item="fullItem" />
  </FullDialog>
</template>
<script setup lang="tsx">
import Add from './components/Add.vue'
import Edit from './components/Edit.vue'
import RetrievalTest from './components/RetrievalTest.vue'
import FileConfig from './components/FileConfig.vue'
import KnowledgeGraph from './components/KnowledgeGraph.vue'
import { getSearchSchema } from './data'
import { handleDelete, handleFetchData } from './IndexApi'
import { BaseButton } from '@/components/Button'
const add = ref()
const edit = ref()
const cardList = ref([])
// 查询列表
const getList = async () => {
  // const params = await getSearchParam()
  handleFetchData({ pageSize: -1, ...dealParams(searchParams.value, searchSchema) }).then(
    (res: any) => {
      cardList.value = res.result.records
    }
  )
}
// 新增-编辑弹窗
const dialogTitle = ref('添加知识库')
const dialogVisible = ref(false)
const dialogTitleEdit = ref('编辑知识库')
const dialogVisibleEdit = ref(false)
// 编辑
const editDialog = async (row: any = {}) => {
  dialogVisibleEdit.value = true
  if (row?.id) {
    await nextTick()
    edit.value.feedBackData(row)
  }
}
// 调用添加
const dialogConfirm = debounce(
  async () => {
    if (await add.value?.submit()) {
      dialogVisible.value = false
      getList()
    }
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)
// 调用编辑
const dialogEditConfirm = debounce(
  async () => {
    if (await edit.value?.submit()) {
      dialogVisibleEdit.value = false
      getList()
    }
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)
// 删除
const doDelete = (item) => {
  ElMessageBox.confirm('此操作将删除该知识库，是否继续？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleDelete({}, { id: item.id }).then((res: any) => {
        if (res.success) {
          getList()
          useMessage('success', res.message)
        } else {
          useMessage('error', res.message || '删除失败')
        }
      })
    })
    .catch(() => {})
}
const fullDialogVisible = ref(false)
const fullAction = ref('文件配置')
const fullItem: any = ref({})
const fullDialog = (action, item: any) => {
  fullAction.value = action
  fullItem.value = item
  fullDialogVisible.value = true
}
// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}
const searchSchema = reactive<FormSchema[]>(getSearchSchema)
onMounted(() => {
  getList()
})
</script>
<style scoped lang="less">
:deep(.el-tag) {
  border-radius: 2px;
}

:deep(.el-tag.el-tag--success) {
  border-color: var(--el-color-success-light-6);
}

:deep(.el-tag, .el-tag.el-tag--primary) {
  border-color: var(--el-color-primary-light-6);
}

:deep(.search-inline-box) {
  min-height: 50px;
}

.app-cards-container {
  display: flex;
  flex-wrap: wrap;
  /* 允许换行 */
  gap: 50px;

  .app-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    text-align: center;
    height: 215.68px;
    width: calc((100% - 2 * 53px) / 3);
    /* flex: 1 1 calc(33.333% - 20px * 2 / 3);*/
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    /* 可选：防止卡片过小 */
    /* @media (max-width: 1480px) { */
    @media (max-width: 680px) {
      width: auto;
      flex: 1;
    }

    /* 卡片内容样式 */
    .app-card img {
      width: 44px;
      height: 44px;
    }

    .app-card-title {
      font-family: Microsoft YaHei UI;
      font-size: 18px;
      font-weight: bold;
      line-height: 18px;
      letter-spacing: 0em;
      color: #333333;
    }

    .app-card-introduction {
      font-family: Microsoft YaHei UI;
      font-size: 13px;
      color: #777777;
      text-align: left;
      overflow: hidden;
      // height: 63px;
      line-height: 20px;
    }
  }
}
.card-btn {
  border-top: 1px solid #eff0f1;
  .flex-1 {
    position: relative;
    &:not(:last-child) {
      &:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 80%;
        background: #eff0f1;
        right: 0;
        top: 10%;
      }
    }
  }
}
</style>
<style>
.application-tooltip {
  max-width: 25%;
}
.customFull-body {
  background-color: #f5f5f5 !important;
  .fullDialog-content {
    background-color: #f5f5f5 !important;
  }
  .customFull-header {
    background-color: #f5f5f5 !important;
    border: none !important;
    height: 32px;
    i,
    span {
      color: #2b90fb !important;
    }
    i > svg {
      fill: #2b90fb !important;
      color: #2b90fb !important;
    }
  }
  .fullDialog-content {
    > div:first-of-type {
      padding-top: 8px !important;
    }
  }
}
</style>
