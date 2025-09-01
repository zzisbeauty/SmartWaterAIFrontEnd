<script setup lang="tsx">
import { handleSave, handleEdit } from '../IndexApi'
/**
 * 新增、编辑提交事件
 * 先进行表单验证，验证通过则进行编辑或新增提交
 */
const submit = async () => {
  const res = await handleEdit({
    id: formData.id,
    temperature: sliderObj.temperature.value,
    topP: sliderObj.topP.value,
    frequencyPenalty: sliderObj.frequencyPenalty.value,
    presencePenalty: presencePenalty.value,
    usedToken: usedToken.value
  })
  if (res.success) {
    useMessage('success', res.message || '操作成功')
    return true
  } else {
    useMessage('warning', res.message || '操作失败')
    return false
  }
}
const formData = reactive({
  id: '',
})
const sliderObj = reactive({
  temperature: {
    name: '温度',
    value: 0.5,
    slider: {
      min: 0,
      max: 1,
      step: 0.01,
      showInput: true,
      inputSize: 'mini',
      inputNumber: true,
      inputWidth: 100,
      inputStyle: {
        width: 100
      }
    }
  },
  topP: {
    name: '累计概率',
    value: 0.5,
    slider: {
      min: 0,
      max: 1,
      step: 0.01,
      showInput: true,
      inputSize: 'mini',
      inputNumber: true
    }
  },
  frequencyPenalty: {
    name: '频率惩罚',
    value: 0.5,
    slider: {
      min: 0,
      max: 1,
      step: 0.01,
      showInput: true,
      inputSize: 'mini',
      inputNumber: true
    }
  }
})
const presencePenalty = ref('')
const usedToken = ref('')
const feedBackData = (row) => {
  formData.id = row.id,
  sliderObj.temperature.value = row.temperature
  sliderObj.topP.value = row.topP
  sliderObj.frequencyPenalty.value = row.frequencyPenalty
  presencePenalty.value = row.presencePenalty
  usedToken.value = row.usedToken
}
defineExpose({
  submit,
  feedBackData
})
</script>

<template>
  <div class="h-100% p-x-20px color-#333">
    <div class="m-b-30px" v-for="(item, key) in sliderObj" :key="key">
      <div class="flex justify-between m-b-12px">
        <div class="label-left flex center">
          <div class="text p-r-10px">{{ item.name }}</div>
          <Icon :size="14" icon="svg-icon:table-question" />
        </div>
        <div>
          <el-input class="!w-70px" v-model="item.value" placeholder="" />
        </div>
      </div>
      <div class="flex center">
        <div class="w-20px">{{ item.slider.min }}</div>
        <el-slider
          :min="item.slider.min"
          :step="0.01"
          :max="item.slider.max"
          size="small"
          class="flex-1"
          v-model="item.value"
        />
        <div class="w-20px text-right">{{ item.slider.max }}</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="item">
        <div class="label-left flex m-b-14px">
          <div class="text p-r-10px">存在惩罚</div>
          <Icon :size="14" icon="svg-icon:table-question" />
        </div>
        <div>
          <el-input type="number" placeholder="" v-model="presencePenalty" />
        </div>
      </div>
      <div class="item">
        <div class="label-left flex m-b-14px">
          <div class="text p-r-10px">单次最大token</div>
          <Icon :size="14" icon="svg-icon:table-question" />
        </div>
        <div>
          <el-input type="number" placeholder="" v-model="usedToken" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-slider),
:deep(.el-slider__runway) {
  height: 8px !important;
}
</style>
