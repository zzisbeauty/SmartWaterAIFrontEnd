<script setup lang="tsx">
const editorOption = ref({
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  },
  theme: 'lightBlueTheme'
})
const speakConfig = ref('')
const apiFromData: any = ref({ speakInfo: '' })

// 监听speakConfig的变化
watch(
  speakConfig,
  (newVal) => {
    apiFromData.value.speakInfo = newVal
  },
  { immediate: true }
)
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
    speakInfo: speakConfig.value
  }
}
const feedBackData = async (data) => {
  apiFromData.value = data
  console.log('speakConfig-----feedBackData', data)
  speakConfig.value = data?.speakInfo ? data.speakInfo : ''
}
defineExpose({
  submit,
  feedBackData
})
</script>
<template>
  <div class="h-100%" ref="headerBoxRef">
    <CodeEditor v-model="speakConfig" :editorOption="editorOption" />
  </div>
</template>

<style lang="less" scoped></style>
