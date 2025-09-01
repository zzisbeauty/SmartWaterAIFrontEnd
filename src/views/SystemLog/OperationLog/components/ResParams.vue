<template>
  <div class="h-100%" ref="headerBoxRef">
    <CodeEditor v-model="config" :editorOption="editorOption" />
  </div>
</template>
<script setup lang="tsx">
const editorOption = ref({
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  },
  readOnly: true,
  theme: 'LightBlue'
})
const config = ref('')
const feedBackData = (row) => {
  config.value = JSON.stringify(row, null, 2)
}
onMounted(() => {
  // config.value = JSON.stringify({ a: 123 }, null, 2)
})
defineExpose({
  feedBackData
})
</script>
<style lang="less" scoped></style>
