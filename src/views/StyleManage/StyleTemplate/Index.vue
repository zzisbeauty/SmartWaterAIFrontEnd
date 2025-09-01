<script setup lang="ts">
import { handleFetchData, handleDelete } from './IndexApi'
import Edit from './components/Edit.vue'
import commonText from './components/commonText.vue' //纯文本
import commonTable from './components/commonTable.vue' //表格
import commonRank from './components/commonRank.vue' //排行榜
import commonEcharts from './components/commonEcharts.vue' //echarts图
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'resultType',
    label: '结果类型',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'result_type' })
      return res || []
    }
  },
  {
    field: 'styleName',
    label: '样式名称',
    component: 'Input',
    ConditionalType: '*',
    componentProps: {}
  },
  {
    field: 'styleType',
    label: '样式类型',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'style' })
      return res || []
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'status' })
      return res || []
    }
  }
])
const importImg = (url) => {
  return new URL(`../../../assets/imgs/mockimg/${url}.png`, import.meta.url).href
}

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}
const isEmpty = ref(false)
const cardList = ref([])
const total = ref(0)
const size = ref(999999)
const page = ref(1)
const loading = ref(true)
const messageRef = ref(null)
const getList = async () => {
  loading.value = true
  const params = dealParams(searchParams.value, searchSchema)
  const res = await handleFetchData({
    pageNo: unref(page),
    pageSize: unref(size),
    ...params
  })
  cardList.value = res.result.records
  loading.value = false
  total.value = res.result.records.length
  isEmpty.value = res.result.records.length == 0
}
const loaded = ref(false)
const addDialog = () => {
  dialogVisible.value = true
}
const editDialog = (row) => {
  dialogVisible.value = true
  nextTick(() => {
    editRef.value.feedBackData(row)
  })
}
const doDelete = (id) => {
  ElMessageBox.confirm('是否确认删除？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleDelete({ id: id }).then((res: any) => {
        if (res.success) {
          getList()
          useMessage('success', res.message)
        } else {
          useMessage('error', '删除失败')
        }
      })
    })
    .catch(() => {})
}
const btnAction = async (title, row?: any) => {
  dialogTitle.value = title
  switch (title) {
    case '新增':
      addDialog()
      break
    case '编辑':
      editDialog(row)
      break
    case '删除':
      doDelete(row.id)
      break
    default:
      break
  }
}
const editRef = ref()
const dialogConfirm = debounce(async () => {
  let res = await editRef.value.submit()
  if (res === undefined) {
    return
  } else {
    if (res) {
      console.log(res)
      dialogVisible.value = false
      useMessage('success', res)
      getList()
    } else {
      dialogVisible.value = true
      useMessage('error', res.message)
    }
  }
}, 200)
onMounted(() => {
  getList()
  loaded.value = true
})

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('监控')
const setConfigDialog = (visible) => {
  dialogVisible.value = visible
}
</script>
<template>
  <div class="w-100% h-100% table-page-container">
    <div class="bg-#FFF">
      <Search
        :schema="searchSchema"
        isCol
        showExpand
        @search="setSearchParams"
        @reset="setSearchParams"
        @register="searchRegister"
      />
    </div>
    <div class="flex justify-between mt-20px mb-10px items-center">
      <div class="fs-14 bold flex items-center gap-20px">
        <span>共 {{ total }} 个样式</span>
        <!-- 图例 -->
        <div class="flex items-center">
          <div class="w-12px h-12px bg-#56BC94 rounded-full mr-5px"></div>
          <span class="text-#999">启用</span>
          <div class="w-12px h-12px bg-#FF4D4F rounded-full ml-10px mr-5px"></div>
          <span class="text-#999">禁用</span>
        </div>
      </div>
      <div>
        <BaseButton type="primary" @click="btnAction('新增')">
          <Icon icon="svg-icon:app-plus" :size="16" /> <span>新增</span>
        </BaseButton>
      </div>
    </div>
    <ElScrollbar class="flex-1">
      <div class="grid grid-cols-4 gap-20px p-t-10px box-border flex-1 h-100%">
        <div
          class="video-card flex flex-col p-b-5px card box-border h-full"
          v-for="item in cardList"
          :key="item.id"
        >
          <div class="relative h-100% flex flex-col box-border p-12px bg-white">
            <div class="flex justify-between items-center">
              <div
                class="w-80px whitespace-nowrap overflow-hidden text-ellipsis font-bold text-14px"
                :class="item.status === 1 ? 'text-#56BC94' : 'text-#FF4D4F'"
                :title="item.styleName"
                >{{ item.styleName }}</div
              >
              <div>
                <BaseButton @click="btnAction('删除', item)">删除</BaseButton>
                <BaseButton type="primary" @click="btnAction('编辑', item)">编辑</BaseButton>
              </div>
            </div>
            <div
              class="relative mt-10px flex-1 pt-15px px-16px pb-16px box-border"
              :class="
                item.styleName?.includes('大屏')
                  ? 'bg-[#0C2A42]'
                  : 'bg-[var(--el-color-primary-light-11)]'
              "
              style="height: 100px"
            >
              <img class="w-100% h-auto" :src="item.iconUrl" alt="" />
              <!-- 纯文本 -->
              <!-- <commonText v-if="item.resultType === 'text'" :reply="item.sampleData" /> -->
              <!-- 列表 -->
              <!-- <div
                class="flex-1 overflow-y-auto overflow-x-hidden h-100%"
                v-else-if="item.resultType === 'table'"
              >
                <commonTable :tableConfig="item.sampleData" />
              </div> -->
              <!-- 排行榜 -->
              <!-- <div
                class="flex-1 overflow-y-auto overflow-x-hidden pb-15px mb-15px h-[calc(100%-15px)] w-100%"
                v-else-if="item.resultType === 'rank'"
              >
                <commonRank :rankConfig="item.sampleData" />
              </div> -->
              <!-- echarts -->
              <!-- <div
                class="flex-1 overflow-y-auto overflow-x-hidden h-100% w-100%"
                v-else-if="item.resultType === 'echarts'"
              >
                <commonEcharts :echartsConfig="item.sampleData" />
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>
    <!-- <div class="flex-1 center" v-else>
      <img class="scale-50" src="@/assets/imgs/empty.png " alt="" />
    </div> -->

    <Dialog
      :maxWidth="'95%'"
      :padding="0"
      :maxHeight="'85%'"
      :title="dialogTitle"
      v-model="dialogVisible"
    >
      <Edit ref="editRef" />
      <template #footer>
        <BaseButton @click="dialogVisible = false">取消</BaseButton>
        <BaseButton type="primary" @click="dialogConfirm">确定</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
<style lang="less" scoped>
:deep(.search-inline-box) {
  padding-top: 15px;
  box-sizing: border-box;
}
// 设置滚动条样式
::-webkit-scrollbar {
  width: 3px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #ccc;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}
</style>
