<script setup lang="tsx">
import { ElLoading } from 'element-plus'
import AppSettings from './components/AppSettings.vue'
import Edit from './components/Edit.vue'
import { getSearchSchema } from './data'
import { handleGetAppDetail, handleGetAppList } from './IndexApi'
const edit = ref()
const cardList: any = ref([])
const getList = async () => {
  // const params = await getSearchParam()
  const res: any = await handleGetAppList({
    pageSize: -1,
    ...dealParams(searchParams.value, searchSchema)
  })
  cardList.value = res.result.records
}
// 应用设置
const dialogVisibleAppSettings = ref(false)
const dialogAppSettingsTitle = ref('应用设置')
const appSettings = ref()
const handleShowAppSettings = async (row: any = {}) => {
  dialogAppSettingsTitle.value = `${row?.id ? '应用设置' : '新增应用'}`
  dialogVisibleAppSettings.value = true
  await nextTick()
  if (row.id) {
    const res: any = await handleGetAppDetail({ id: row.id })
    appSettings.value.feedBackData(res.result)
  } else {
    appSettings.value.feedBackData()
  }
}

// 提交全部配置项
const handleSubmitAppSettings = debounce(
  async () => {
    if (await appSettings.value.confirmAll()) {
      dialogVisibleAppSettings.value = false
      getList()
    }
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}
const searchSchema = reactive<FormSchema[]>(getSearchSchema)
const resetSearch = () => {
  searchParams.value = {}
  getList()
}
onMounted(() => {
  getList()
})
</script>

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
          <div class="color-#333 bold">共{{ cardList.length }}个应用</div>
          <BaseButton type="primary" @click="handleShowAppSettings()"
            ><Icon icon="svg-icon:app-plus" :size="16" /> <span>新增</span></BaseButton
          >
        </div>
        <div class="app-cards-container">
          <div class="app-card" v-for="(app, index) in cardList" :key="index">
            <div class="flex justify-between items-center mb10px">
              <div class="flex items-center gap-20px">
                <img
                  :src="app.iconUrl || importImg(`appMange/模型图标.png`)"
                  alt=""
                  width="44px"
                  height="44px"
                />
                <div class="app-card-title">{{ app.applicationName }}</div>
              </div>
              <div>
                <el-button class="w-76px">接入方式</el-button>
                <el-button class="w-76px" type="primary" @click="handleShowAppSettings(app)"
                  >应用设置</el-button
                >
              </div>
            </div>
            <el-scrollbar max-height="63px" :noresize="true">
              <div class="app-card-description">{{ app.applicationDesc }}</div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <!-- 新增和编辑对话框 -->
  <!-- <Dialog maxWidth="40%" maxHeight="50%" :title="dialogEditTitle" v-model="dialogEditVisible">
    <Edit ref="edit" />
    <template #footer>
      <BaseButton @click="dialogEditVisible = false">取消</BaseButton>
      <BaseButton type="primary" @click="dialogEditConfirm">确定</BaseButton>
    </template>
  </Dialog> -->
  <!-- 应用设置 -->
  <Dialog
    maxWidth="80%"
    maxHeight="80%"
    padding="0"
    :title="dialogAppSettingsTitle"
    v-model="dialogVisibleAppSettings"
  >
    <AppSettings ref="appSettings" />
    <template #footer>
      <BaseButton @click="dialogVisibleAppSettings = false">取消</BaseButton>
      <BaseButton type="primary" @click="handleSubmitAppSettings()">确定</BaseButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.app-cards-container {
  display: flex;
  flex-wrap: wrap;
  /* 允许换行 */
  gap: 50px;
  .app-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    height: 155px;
    width: calc((100% - 2 * 53px) / 3);
    // flex: 1 1 calc(33.333% - 20px * 2 / 3);
    min-width: 400px; /* 可选：防止卡片过小 */
    @media (max-width: 680px) {
      // @media (max-width: 1480px) {
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
    .app-card-description {
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
</style>
<style>
.application-tooltip {
  max-width: 25%;
}
</style>
