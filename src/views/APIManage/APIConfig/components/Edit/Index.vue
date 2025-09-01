<script setup lang="tsx">
import Steps from './Steps.vue'
import BaseInfo from './baseInfo.vue'
import paramsConfig from './paramsConfig.vue'
import SpeakConfig from './speakConfig.vue'
import linkConfig from './linkConfig.vue'
import QuestionConfig from './questionConfig.vue'
import styleConfig from './styleConfig.vue'

import { handleGetApiInfo, handleSaveData, handleEditData } from '../../IndexApi'
import { initApiFromData } from './basicData'

interface basicData {
  baseInfo: any
  paramInfo: any
  questionInfo: any
  linkInfo: any
  speakInfo: string
  styleInfo: any
}

const emitters = defineEmits(['success'])

//进度

const processValue = ref(0)
const processOptions = [
  {
    label: '基础信息',
    value: 1
  },
  {
    label: '参数配置',
    value: 2
  },
  {
    label: '提问语配置',
    value: 3
  },
  {
    label: '关联问题配置',
    value: 4,
    spanText: '（如关联内部API，请选择提问语）'
  },
  {
    label: '播报语配置',
    value: 5
  },
  {
    label: '展示样式配置',
    value: 6
  }
]

const basicData = ref<basicData>()

const stepFromRef = ref()
const changeInitStepFrom = () => {
  stepFromRef.value && stepFromRef.value.feedBackData(basicData.value)
}

watch(processValue, () => {
  nextTick(() => {
    changeInitStepFrom()
  })
})

//点击进度条
const stepOver = ref(0)
const handleClickStep = (stepNum) => {
  changeStep(stepNum - processValue.value)
}

// 进度条
const changeStep = async (stepNum = 1, check = true) => {
  if (!stepNum) return
  const formData = await stepFromRef.value.submit(check)
  if (!formData && check) return
  basicData.value = formData
  processValue.value += stepNum
}

const dialogVisible = ref(false)
const dialogTitle = ref('新增')

//提交
const submitData = ref()
const submit = async () => {
  loading.value = true
  const formData = await stepFromRef.value.submit()
  const processedVal = formData.linkInfo.map((item) => {
    const newItem = { ...item }
    delete newItem.id
    return newItem
  })
  submitData.value = {
    apiCode: formData.baseInfo?.apiCode,
    apiName: formData.baseInfo?.apiName,
    apiDesc: formData.baseInfo?.apiDesc,
    categoryId: formData.baseInfo?.categoryId,
    businessSystemCode: formData.baseInfo?.businessSystemCode,
    type: formData.baseInfo?.type,
    apiSecret: formData.baseInfo?.apiSecret,
    url: formData.baseInfo?.url,
    linkUrl: formData.baseInfo?.linkUrl,
    requestType: formData.baseInfo?.requestType,
    resultType: formData.baseInfo?.resultType,
    apiSpeech: formData.speakInfo,
    apiParamConfigList: formData.paramInfo,
    apiQuestionConfigList: formData.questionInfo,
    apiRelationConfigList: processedVal,
    apiStyleRelationList: formData.styleInfo
  }
  basicData.value = submitData.value
  //判断是编辑还是新增
  if (dialogTitle.value === '新增') {
    handleSave(basicData.value)
  } else {
    basicData.value.id = formData.baseInfo?.id
    handleEdit(basicData.value)
  }
}
const handleSave = async (basicDatavalue) => {
  const res: any = await handleSaveData({
    ...basicDatavalue
  }).finally(() => {
    loading.value = false
  })
  if (res.success) {
    closeDialog()
    useMessage('success', res.message || `新增成功`)
    emitters('success')
  } else {
    useMessage('error', '新增失败')
  }
}
const handleEdit = async (basicDatavalue) => {
  const res: any = await handleEditData({
    ...basicDatavalue
  }).finally(() => {
    loading.value = false
  })
  if (res.success) {
    closeDialog()
    useMessage('success', res.message || `配置成功`)
    emitters('success')
  } else {
    useMessage('error', '配置失败')
  }
}
//页面滚动
const scrollDom = ref()
const bus = useEventBus()
bus.on('scrollTo', (val) => {
  console.log('页面滚动', val)
  nextTick(() => {
    const dom = scrollDom.value
    if (!dom) return
    const wrap = dom.$el.querySelector('.el-scrollbar__wrap')
    if (wrap) {
      wrap.scrollTo({
        top: val || wrap.scrollHeight,
        behavior: 'smooth'
      })
    } else {
      dom.$el.scrollTo({
        top: val || 9999,
        behavior: 'smooth'
      })
    }
  })
})

//弹窗控制

const setDialog = (boolean = true) => {
  dialogVisible.value = boolean
}

//初始化
const feedBackData = async (row) => {
  processValue.value = 1
  if (row) {
    getPageData(row.id)
    stepOver.value = processOptions.length - 1
  } else {
    basicData.value = cloneDeep(initApiFromData)
    changeInitStepFrom()
  }
  dialogTitle.value = `${row?.id ? '配置' : '新增'}`
  setDialog(true)
}

//关闭弹窗
const closeDialog = () => {
  setDialog(false)
  processValue.value = 0
}

//获取数据
const loading = ref(false)
const getPageData = async (id) => {
  loading.value = true
  const res: any = await handleGetApiInfo({
    id: id
  }).finally(() => {
    loading.value = false
  })
  basicData.value = {
    baseInfo: res.result,
    paramInfo: res.result.apiParamConfigList,
    questionInfo: res.result.apiQuestionConfigList,
    linkInfo: res.result.apiRelationConfigList,
    speakInfo: res.result.apiSpeech,
    styleInfo: res.result.apiStyleRelationList
  }
  console.log('获取到的基本数据:', basicData.value)
  changeInitStepFrom()
}

defineExpose({
  setDialog,
  feedBackData
})
</script>

<template>
  <FullDialog v-loading="loading" v-model="dialogVisible" :title="dialogTitle" @close="closeDialog">
    <div class="w-100% h-100% flex flex-col">
      <Steps
        :options="processOptions"
        :stepOver="stepOver"
        readonly
        v-model="processValue"
        @beforeChange="handleClickStep"
      />
      <div class="w-100% flex-1 relative">
        <div class="absolute inset-0">
          <ElScrollbar ref="scrollDom" class="p-12px pb-0 box-border">
            <BaseInfo ref="stepFromRef" v-if="processValue === 1" />
            <paramsConfig ref="stepFromRef" v-if="processValue === 2" />
            <QuestionConfig ref="stepFromRef" v-if="processValue === 3" />
            <linkConfig ref="stepFromRef" v-if="processValue === 4" />
            <SpeakConfig ref="stepFromRef" v-if="processValue === 5" />
            <styleConfig ref="stepFromRef" v-if="processValue === 6" />
          </ElScrollbar>
        </div>
      </div>
    </div>
    <template #footer>
      <BaseButton v-if="processValue === 1" @click="closeDialog">取消</BaseButton>
      <BaseButton type="primary" v-if="processValue > 1" @click="changeStep(-1, false)"
        >上一步</BaseButton
      >
      <BaseButton type="primary" v-if="processValue < 6" @click="changeStep(1)">下一步</BaseButton>
      <BaseButton type="primary" v-if="processValue === 6" @click="submit">确定</BaseButton>
    </template>
  </FullDialog>
</template>
<style lang="less" scoped></style>
