<script setup lang="tsx">
import { fa } from 'element-plus/es/locale'
import { stylehandleFetchData } from '../../IndexApi'
const formData = reactive({
  resultType: 'text',
  styleScheme: 'PC',
  styleType: 'text',
  styleId: '',
  styleName: ''
})
const formDataresultType = ref([])
const formDatastyleScheme = ref([])
const formDatastyle = ref([])
const isEmpty = ref(false)
const cardList = ref([])
const total = ref(0)
const size = ref(12)
const page = ref(1)
const loading = ref(true)
const getList = async () => {
  loading.value = true
  const res = await stylehandleFetchData({
    pageNo: unref(page),
    pageSize: unref(size),
    styleType: formData.styleType
  })
  cardList.value = res.result.records
  loading.value = false
  total.value = res.result.total
  isEmpty.value = res.result.records.length == 0
  formData.styleId = cardList.value[0]?.id
}
const chartType = ref(0)
const handleSelect = (e, i) => {
  console.log(e)
  chartType.value = i
  formData.styleId = e.id
}
const handleTabChange = (value) => {
  // 更新当前选中的标签
  formData.styleType = value
  // 重置分页到第一页
  page.value = 1
  // 更新cardList数据
  getList()
}
const apiFromData: any = ref({})
const submit = async () => {
  return {
    ...apiFromData.value,
    baseInfo: {
      ...apiFromData.value.baseInfo
    },
    paramInfo: [...(apiFromData.value.paramInfo || [])],
    questionInfo: [...(apiFromData.value.questionInfo || [])],
    linkInfo: [...(apiFromData.value.linkInfo || [])],
    linkInfoNo: apiFromData.value.linkInfoNo || 1,
    speakInfo: apiFromData.value.speakInfo || '',
    styleInfo: [
      {
        styleName: formData.styleName || '',
        resultType: formData.resultType || '',
        styleScheme: formData.styleScheme || '',
        styleType: formData.styleType || '',
        styleId: formData.styleId || ''
      }
    ]
  }
}
const feedBackData = async (data) => {
  debugger
  formDataresultType.value = await getDictById({ code: 'result_type' })
  formDatastyleScheme.value = await getDictById({ code: 'styleScheme' })
  formDatastyle.value = await getDictById({ code: 'style' })
  apiFromData.value = data
  console.log('styleConfig-----feedBackData', data)
  formData.styleName = data?.styleInfo[0]?.styleName == '' ? 'PC' : data?.styleInfo[0]?.styleName
  formData.resultType =
    data?.styleInfo[0]?.resultType == ''
      ? formDataresultType.value[0]?.value
      : data?.styleInfo[0]?.resultType
  formData.styleScheme =
    data?.styleInfo[0]?.styleScheme == ''
      ? formDatastyleScheme.value[0]?.value
      : data?.styleInfo[0]?.styleScheme
  formData.styleType =
    data?.styleInfo[0]?.styleType == ''
      ? formDatastyle.value[0]?.value
      : data?.styleInfo[0]?.styleType
  formData.styleId = data?.styleInfo[0]?.styleId == '' ? '' : data?.styleInfo[0]?.styleId

  getList()
}
defineExpose({
  submit,
  feedBackData
})
</script>
<template>
  <div class="h-100% flex-col">
    <div class="flex items-center w-100%">
      <div class="flex items-center flex-1">
        <div class="label-title">结果类型：</div>
        <div class="pl-15px">
          <el-select class="min-w-150px" v-model="formData.resultType" placeholder="请选择">
            <el-option
              v-for="(item, index) in formDataresultType"
              :key="item.value || index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex items-center flex-1">
        <div class="label-title">展示平台：</div>
        <div class="pl-15px">
          <el-radio-group v-model="formData.styleScheme" placeholder="请选择">
            <el-radio
              v-for="item in formDatastyleScheme"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="m-y-5px">样式方案：</div>
    <div class="el-card flex-1 box-border flex">
      <div class="left">
        <div
          class="tab-item pointer"
          @click="handleTabChange(item.value)"
          :class="{ active: formData.styleType == item.value }"
          v-for="item in formDatastyle"
          :key="item.value"
          >{{ item.label }}</div
        >
      </div>
      <div class="right h-100% flex-1">
        <el-scrollbar class="!h-[calc(100%-52px)]">
          <div class="h-100%">
            <div class="grid grid-cols-2 gap-20px p-10px box-border flex-1 h-100%">
              <div
                class="p-20px card flex-col pointer relative"
                :class="index == chartType ? 'active-card' : ''"
                @click="handleSelect(item, index)"
                v-for="(item, index) in cardList"
                :key="index"
              >
                <div class="lh-32px">{{ item.styleName }}</div>
                <div class="flex-1">
                  <img class="v-mid w-100% object-contain" :src="item.iconUrl" alt="" />
                </div>
                <div class="absolute top-20px right-20px circle" v-if="index == chartType">
                  <div class="out-circle center">
                    <div class="in-circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div class="relative h-52px">
          <pagiNation
            v-model:current-page="page"
            :page-sizes="[8, 16, 34, 32]"
            :total="total"
            v-model:page="page"
            :limit="size"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.left {
  width: 140px;
  padding-top: 10px;
  border-right: 1px solid #d8d8d8;
  color: #333;
}
.tab-item {
  line-height: 36px;
  width: 90%;
  margin: 0 5%;
  padding-left: 18px;
  box-sizing: border-box;
  &.active {
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
    color: var(--el-color-primary);
  }
}
.card {
  background: #ffffff;

  box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.0902);
  border-radius: 4px;
}
.circle {
  .out-circle {
    border: 1px solid #1890ff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    .in-circle {
      background: #1890ff;
      border-radius: 50%;
      width: 10px;
      height: 10px;
    }
  }
}
.active-card {
  box-shadow: 0 0 0 4px var(--el-color-primary) inset;
}
</style>
