<script setup lang="ts">
import { getSearchSchema } from './data'
import { handleFetchData } from './IndexApi'
import Edit from './components/Edit.vue'
// import Add from './components/Add.vue'
const searchValue = ref('')

// 定义搜索参数，并执行搜索事件
const sources = ref<any>([
  {
    id: '',
    name: '全部'
  },
  {
    id: 'yanjiuyuan',
    name: '研究院'
  },
  {
    id: '通义',
    name: '通义'
  },
  {
    id: '百度',
    name: '百度'
  },
  {
    id: '讯飞',
    name: '讯飞'
  },
  {
    id: '阿里',
    name: '阿里'
  },
  {
    id: '腾讯',
    name: '腾讯'
  },
  {
    id: '华为',
    name: '华为'
  },
  {
    id: '微软',
    name: '微软'
  },
  {
    id: '谷歌',
    name: '谷歌'
  },
  {
    id: '百川智能',
    name: '百川智能'
  },
  {
    id: 'DeepSeek',
    name: 'DeepSeek'
  }
])
const types = ref<any>([
  {
    id: '',
    name: '全部'
  },
  {
    id: 'chat',
    name: '对话'
  },
  {
    id: 2,
    name: '文本'
  },
  {
    id: 3,
    name: '图片'
  },
  {
    id: 4,
    name: '音频'
  },
  {
    id: 5,
    name: '视频'
  },
  {
    id: 6,
    name: '文件'
  },
  {
    id: 7,
    name: '其他'
  }
])
const searchParams = ref({
  source: '',
  type: ''
})
const reset = () => {
  searchParams.value.source = ''
  searchParams.value.type = ''
}
const isEmpty = ref(false)
const cardList = ref([])
const total = ref(0)
const size = ref(12)
const page = ref(1)
const loading = ref(true)
const btnAction = async (title, row?: any) => {
  dialogTitle.value = title
  switch (title) {
    case '新增':
      editDialog('新增')
      break
    case '参数调优':
      editDialog('参数调优', row)
      break
    case '编辑':
      editDialog('编辑', row)
      break
    case '删除':
      doDelete(row)
      break
    default:
      break
  }
}
// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('监控')
const editRef = ref()
// const addRef = ref()
const editDialog = (title = '编辑', row = {}) => {
  dialogVisible.value = true
  dialogTitle.value = title
  // if (title === '编辑') {
  nextTick(() => {
    editRef.value.feedBackData(row)
  })
  // }
}
const doDelete = (id) => {
  ElMessageBox.confirm('是否确认删除？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      //   handleDelete({ id: id }).then((res: any) => {
      //     if (res.success) {
      //       getList()
      //       useMessage('success', res.message)
      //     } else {
      //       useMessage('error', '删除失败')
      //     }
      //   })
    })
    .catch(() => {})
}

const dialogConfirm = debounce(
  async () => {
    // if (dialogTitle.value == '编辑') {
    // await editRef.value?.submit()
    // } else {
    //   await addRef.value?.submit()
    // }
    if (await editRef.value?.submit()) {
      dialogVisible.value = false
      getList()
    }
  },
  import.meta.env.VITE_DEBOUNCE_TIME
)
const getList = async () => {
  loading.value = true
  const res = await handleFetchData({
    // pageNo: unref(page),
    // pageSize: unref(size),
    pageSize: -1,
    name: `*${searchValue.value}*`,
    ...searchParams.value
  })
  cardList.value = res.result.records
  loading.value = false
  total.value = res.result.total
  isEmpty.value = res.result.records.length == 0
}
const loaded = ref(false)
onMounted(() => {
  getList()
  loaded.value = true
})
</script>
<template>
  <div class="w-100% h-100% table-page-container">
    <div class="bg-#FFF h-150px flex-col box-border py-12px px-24px justify-evenly">
      <div class="flex justify-between">
        <div class="flex">
          <div class="w-100px bold">模型筛选</div>
          <div>
            <el-button type="primary" link @click="reset">
              <Icon :size="20" icon="svg-icon:table-delete" />
              清空
            </el-button>
          </div>
        </div>
        <div>
          <el-input
            v-model="searchValue"
            style="width: 240px"
            placeholder="搜索内容"
            @change="getList"
            @keydown.enter="getList"
          >
            <template #prefix>
              <Icon icon="svg-icon:table-search" color="#333" />
            </template>
          </el-input>
        </div>
      </div>
      <div class="flex fs-14">
        <div class="w-100px">供应商</div>
        <div class="right-options flex p-l-5px">
          <div
            @click="(searchParams.source = item.id), getList()"
            class="item m-r-40px"
            :class="{ active: item.id == searchParams.source }"
            v-for="item in sources"
            :key="item.name"
            >{{ item.name }}</div
          >
        </div>
      </div>
      <div class="flex fs-14">
        <div class="w-100px">模型类型</div>
        <div class="right-options flex p-l-5px">
          <div
            class="item m-r-40px"
            @click="(searchParams.type = item.id), getList()"
            :class="{ active: item.id == searchParams.type }"
            v-for="item in types"
            :key="item.name"
            >{{ item.name }}</div
          >
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-20px mb-10px items-center">
      <div class="fs-14 bold"> 共{{ cardList.length }}个模型 </div>
      <!-- <div>
        <BaseButton type="primary" @click="btnAction('新增')">
          <Icon icon="svg-icon:app-plus" :size="16" /> <span>新增</span>
        </BaseButton>
      </div> -->
    </div>
    <ElScrollbar class="flex-1">
      <div
        class="grid grid-cols-3 gap-20px p-t-10px box-border flex-1 h-100%"
        style="grid-auto-rows: minmax(218px, 238px)"
      >
        <div
          class="video-card flex flex-col p-b-5px card box-border h-full"
          v-for="item in cardList"
          :key="item.id"
        >
          <div class="relative h-100% flex flex-col box-border p-12px bg-white gap-10px">
            <div class="flex justify-between items-center p-b-0px">
              <div class="flex items-center gap-20px" width="44px" height="44px" >
                <div class="border-1-solid-#EFEFEF p-5px border-rd-8px w-72px h-72px center">
                  <img src="@/assets/imgs/mockimg/modelIcon.png" alt="" />
                </div>
                <div class="flex-col justify-between h-72px">
                  <div class="fs-18 color-#333 bold w-200px">{{ item.name }}</div>
                  <div class="fs-12 color-#AAA">许可密钥：BBBBBBBBBBBB</div>
                  <div class="flex gap-10px">
                    <!-- <el-tag type="primary" size="small">文本生成</el-tag> -->
                    <el-tag type="primary" size="small">{{ item.type }}</el-tag>
                    <!-- <el-tag type="warning" size="small">vision视觉</el-tag> -->
                    <el-tag type="warning" size="small">{{ item.modelCategoryId }}</el-tag>
                  </div>
                </div>
              </div>
              <div>
                <BaseButton class="!min-w-80px" @click="btnAction('参数调优', item)"
                  >参数调优</BaseButton
                >
                <BaseButton class="!min-w-80px" type="primary" @click="btnAction('调用API', item)"
                  >调用API</BaseButton
                >
              </div>
            </div>
            <!-- <div class="flex-1"> -->
            <el-scrollbar class="flex-1">
              <div class="color-#777 fs-13">
                <!-- 0wO推理模型增强版，基于Owen2,5型训练的QwO推理模型，通过强化学习大幅度提升了模型推理能力。模型数学代码等核心指标(AIME24/25、livecodebench)以及部分通用指标(IFEval、LiveBench等)达到DeepSeek-R1满血版水平。
                veBench等)达到DeepSeek-R1满血版水平。 -->
                {{ item.promptConfigStr }}
              </div>
            </el-scrollbar>
            <!-- </div> -->
            <div class="flex justify-between color-#aaa fs-13">
              <div>@{{ item.source }}</div>
              <div>{{ item.updateTime }} 更新</div>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>

    <Dialog :maxWidth="'40%'" :maxHeight="'70%'" :title="dialogTitle" v-model="dialogVisible">
      <Edit v-if="dialogTitle == '参数调优'" ref="editRef" />
      <!-- <Add v-else-if="dialogTitle == '新增'" ref="addRef" /> -->
      <template #footer>
        <BaseButton @click="dialogVisible = false">取消</BaseButton>
        <BaseButton type="primary" @click="dialogConfirm"> 确定 </BaseButton>
      </template>
    </Dialog>
  </div>
</template>
<style lang="less" scoped>
.right-options {
  .item {
    height: 28px;
    user-select: none;
    line-height: 28px;
    cursor: pointer;
    padding: 0 8px;
    &.active {
      background-color: var(--el-color-primary-light-9);
      border-radius: 4px;
      color: var(--el-color-primary);
    }
  }
}
</style>
