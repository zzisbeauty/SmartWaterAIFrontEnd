<script setup lang="tsx">
import { ref, defineProps, watch, onMounted } from 'vue'

interface ApiSpeechConfig {
  apiSpeech?: any
}

const props = defineProps<{
  data: ApiSpeechConfig
}>()
const editorOption = ref({
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  },
  readOnly: true,
  theme: 'lightBlueTheme'
})
const config = ref('')
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.apiSpeech) {
      config.value = JSON.stringify(newData.apiSpeech)
    } else {
      config.value = ''
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (props.data && props.data.apiSpeech) {
    config.value = JSON.stringify(props.data.apiSpeech)
  } else {
    config.value = ''
  }
})
</script>
<template>
  <div class="h-200px">
    <CodeEditor v-model="config" :editorOption="editorOption" />
  </div>
</template>
<style lang="less" scoped></style>
