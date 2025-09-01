<template>
  <div class="w-100% h-100% pl-20px py-10px box-border">
    <div class="current-config">
      <!-- 使用 grid 容器 -->
      <div class="current-config-grid">
        <!-- 卡片1 -->
        <div class="current-config-card">
          <div class="current-config-card-left">
            <DetailTitle
              class="mb-10px"
              :show-expand="false"
              :item="{
                titleZn: '数字人: ',
                titleEn: '',
                name: '',
                activeNames: []
              }"
            />
            <ElButton class="w-76px m-l-10px" type="primary" @click="handleChangeConfig('1')"
              >更改配置</ElButton
            >
          </div>
          <div class="current-config-card-right !h-160px !pb-8px relative">
            <div class="w-60% h-100%">
              <div class="w-100% h-80% flex flex-col justify-between">
                <div class="font-bold font-size-18px color-#333 m-b-8px">{{
                  allConfig?.digitalHumanServiceConfig?.[0]?.digitalHumanId_dictText
                }}</div>
                <el-scrollbar max-height="75px" :noresize="true" class="z-99">
                  <div class="font-size-12px color-#777777">{{
                    allConfig?.digitalHumanServiceConfig?.[0]?.digitalHumanId_dictText
                  }}</div>
                </el-scrollbar>
              </div>
              <el-tag type="primary" size="small" class="min-w-60px">{{
                allConfig?.digitalHumanServiceConfig?.[0]?.voice_dictText
              }}</el-tag>
            </div>
            <div class="person-bg">
              <!-- <img
                v-if="allConfig?.digitalHumanServiceConfig?.[0]?.imageUrl"
                :src="importImg(`appMange/${allConfig?.digitalHumanServiceConfig?.[0]?.imageUrl}`)"
              /> -->
              <img
                v-if="allConfig?.digitalHumanServiceConfig?.[0]?.imageUrl"
                :src="allConfig?.digitalHumanServiceConfig?.[0]?.imageUrl"
              />
              <img v-else src="/img/数字人头像.png" />
            </div>
          </div>
        </div>

        <!-- 卡片2 -->
        <div class="current-config-card">
          <div class="current-config-card-left">
            <DetailTitle
              class="mb-10px"
              :show-expand="false"
              :item="{
                titleZn: '知识库配置: ',
                titleEn: '',
                name: '',
                activeNames: []
              }"
            />
            <ElButton class="w-76px m-l-10px" type="primary" @click="handleChangeConfig('4')"
              >更改配置</ElButton
            >
          </div>
          <div class="current-config-card-right !h-160px">
            <div class="flex justify-start items-center gap-20px m-b-8px">
              <img src="@/assets/imgs/appMange/知识库图标.png" width="56px" />
              <div class="font-bold font-size-18px color-#333">{{
                allConfig?.ragInfoList?.[0]?.name
              }}</div>
            </div>
            <el-scrollbar max-height="70px" :noresize="true">
              <div class="font-size-13px color-#777777">{{
                allConfig?.ragInfoList?.[0]?.description || '暂无表述'
              }}</div>
            </el-scrollbar>
          </div>
        </div>

        <!-- 卡片3 -->
        <div class="current-config-card">
          <div class="current-config-card-left">
            <DetailTitle
              class="mb-10px"
              :show-expand="false"
              :item="{
                titleZn: 'ASR配置: ',
                titleEn: '',
                name: '',
                activeNames: []
              }"
            />
            <ElButton class="w-76px m-l-10px" type="primary" @click="handleChangeConfig('2')"
              >更改配置</ElButton
            >
          </div>
          <div class="current-config-card-right !h-112px">
            <div class="h-100% flex justify-start items-center gap-20px m-b-8px">
              <img src="@/assets/imgs/appMange/ASR图标.png" width="72px" />
              <div class="flex flex-col gap-20px">
                <div class="font-bold font-size-18px color-#333">{{
                  allConfig?.asrServiceConfig?.[0]?.name
                }}</div>
                <el-tag type="primary" size="small" class="min-w-60px">{{
                  allConfig?.asrServiceConfig?.[0]?.asrId_dictText
                }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片4 -->
        <div class="current-config-card">
          <div class="current-config-card-left">
            <DetailTitle
              class="mb-10px"
              :show-expand="false"
              :item="{
                titleZn: '模型配置: ',
                titleEn: '',
                name: '',
                activeNames: []
              }"
            />
            <ElButton class="w-76px m-l-10px" type="primary" @click="handleChangeConfig('3')"
              >更改配置</ElButton
            >
          </div>
          <div class="current-config-card-right !h-160px">
            <div class="h-50% flex justify-start items-center gap-20px m-b-8px">
              <img src="@/assets/imgs/appMange/模型图标.png" width="54px" />
              <div class="flex flex-col gap-10px">
                <div class="font-bold font-size-18px color-#333">{{
                  allConfig?.largeModelInfo?.[0]?.name
                }}</div>
                <div class="flex gap-10px">
                  <el-tag type="primary" size="small">{{
                    allConfig?.largeModelInfo?.[0]?.type
                  }}</el-tag>
                  <el-tag type="warning" size="small">{{
                    allConfig?.largeModelInfo?.[0]?.modelCategoryId
                  }}</el-tag>
                </div>
              </div>
            </div>
            <el-scrollbar max-height="60px" :noresize="true">
              <div class="font-size-12px color-#777777">{{
                allConfig?.largeModelInfo?.[0]?.promptConfigStr
              }}</div>
            </el-scrollbar>
          </div>
        </div>

        <!-- 第五个卡片，独占一行 -->
        <div class="current-config-card">
          <div class="current-config-card-left">
            <DetailTitle
              class="mb-10px"
              :show-expand="false"
              :item="{
                titleZn: 'API配置: ',
                titleEn: '',
                name: '',
                activeNames: []
              }"
            />
            <ElButton class="w-76px m-l-10px" type="primary" @click="handleChangeConfig('5')"
              >更改配置</ElButton
            >
          </div>
          <div class="current-config-card-right h-200px">
            <Table
              ref="singleTableRef"
              :data="dataList"
              :columns="tableColumns"
              highlight-current-row
              sortable
              :showAction="false"
              :border="false"
              :showOverflowTooltip="false"
              @register="tableRegister"
              class="w-100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import DetailTitle from '@/views/Components/DetailTitle.vue'
import { handleGetAPIList } from '../IndexApi'
// 引入原配置
const allConfig: any = inject('allConfig')
const emit = defineEmits<{
  (e: 'changeConfig', key: string): void
}>()
const handleChangeConfig = (key) => {
  emit('changeConfig', key)
}

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: '序号',
    type: 'index'
  },
  {
    label: '接口名称',
    field: 'apiName'
  },

  {
    label: '接口分类',
    field: 'category_dictText'
  },
  {
    label: '业务系统',
    field: 'businessSystemCode_dictText'
  },
  {
    label: '接口类型',
    field: 'type_dictText',
    width: 100,
    slots: {
      default: (data: any) => {
        if (data.row.type) {
          let tagType = ''
          let statusText = ''
          switch (String(data.row.type)) {
            case '0':
              tagType = 'success'
              statusText = '网关接口'
              break
            case '1':
              tagType = 'primary'
              statusText = '一般接口'
              break
            default:
              tagType = 'warning'
              statusText = '链接'
              break
          }
          return (
            <>
              <El-Tag type={tagType} class="w-71px">
                {statusText}
              </El-Tag>
            </>
          )
        } else {
          return <></>
        }
      }
    }
  }
])
const singleTableRef = ref<{ elTableRef: any } & InstanceType<typeof Table>>()
const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    // const res = await handleGetAPIList({})
    return {
      list: allConfig?.apiInfoList,
      total: allConfig?.apiInfoList.length
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods
</script>

<style scoped lang="less">
.current-config {
  width: 100%;
  height: 100%;

  .current-config-grid {
    width: 100%;
    // height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0% 10%;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
    }
    @media (min-width: 1300px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .current-config-card {
    // width: 100%;
    height: 100%;
    // border: 1px solid #e4e4e4; /* 添加边框以便更清晰地看到卡片 */
    padding: 16px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    display: flex;
    justify-content: flex-start;
    gap: 0px;

    &:last-child {
      grid-column: span 2;
    }
    @media (max-width: 1300px) {
      &:last-child {
        grid-column: span 1;
      }
    }

    .current-config-card-left {
      width: 120px;
      // height: 100%;
    }

    .current-config-card-right {
      flex: 1;
      padding: 12px;
      box-sizing: border-box;
      background-color: #ffffff;
      border-radius: 8px;

      .person-bg {
        position: absolute;
        // top: 0%;
        bottom: 0;
        right: 2%;
        // height: 100%;
        height: 150px;
        // width: 40%;
        width: 150px;
        // background: url('@/assets/imgs/appMange/person-bg.png') no-repeat;
        background-position: 100% 16px;
        background-size: 100% 100%;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        img {
          // height: 80%;
          height: 100px;
        }
      }
    }
  }
}
</style>
