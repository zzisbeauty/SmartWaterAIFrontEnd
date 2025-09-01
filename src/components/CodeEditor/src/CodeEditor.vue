<script setup lang="tsx">
import { useMonacoEditor } from '@/hooks/web/useMonacoEditor'
import { onMounted, computed, watch, ref } from 'vue'
import { ElSelect, ElOption, ElFormItem, ElForm } from 'element-plus'
import { languageOptions, themeOptions } from './config/config'

const props = withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
    languageSelector?: boolean
    language?: string
    themeSelector?: boolean
    theme?: string
    editorOption?: object
    modelValue: string
    autoHeight?: boolean
    maxHeight?: string | number
    hightlight?: boolean
    autoFormat?: boolean
  }>(),
  {
    width: '100%',
    height: '100%',
    languageSelector: false,
    language: 'json',
    themeSelector: false,
    theme: 'vs',
    editorOption: () => ({}),
    modelValue: '',
    autoHeight: false,
    maxHeight: 2000,
    hightlight: false,
    autoFormat: false
  }
)

const emits = defineEmits<{
  (e: 'blur'): void
  (e: 'update:modelValue', val: string): void
}>()

const monacoEditorStyle = computed(() => {
  return {
    width: typeof props.width === 'string' ? props.width : props.width + 'px',
    height: typeof props.height === 'string' ? props.height : props.height + 'px'
  }
})

const {
  monacoEditorRef,
  createEditor,
  updateVal,
  updateOptions,
  getEditor,
  changeLanguage,
  changeTheme,
  setAutoHeight,
  useMonacoHighlight,
  formatDoc
} = useMonacoEditor(props.language)

onMounted(() => {
  const monacoEditor = createEditor(props.editorOption)
  updateMonacoVal(props.modelValue)
  monacoEditor?.onDidChangeModelContent(() => {
    emits('update:modelValue', monacoEditor!.getValue())
  })
  monacoEditor?.onDidBlurEditorText(() => {
    emits('blur')
  })
//   const { applyHighlight } = useMonacoHighlight({
//     host: 'highlight-host',
//     返回结果: 'highlight-result',
//     query参数: 'highlight-query'
//   })

  nextTick(() => {
    if (props.autoHeight) {
      setAutoHeight(props.maxHeight)
    }
    // if (props.hightlight) {
    //   applyHighlight()
    // }
  })
})

watch(
  () => props.modelValue,
  () => {
    updateMonacoVal(props.modelValue)
    // 自动格式化
    if (props.autoFormat) {
      formatDoc()
    }
    if (props.autoHeight) {
      nextTick(() => {
        setAutoHeight(props.maxHeight)
      })
    }
  }
)

const localLanguage = ref(props.language)

watch(localLanguage, (newLanguage) => {
  changeLanguage(newLanguage)
})

const localTheme = ref(props.theme)
watch(localTheme, (newTheme) => {
  changeTheme(newTheme)
})

function updateMonacoVal(val: string) {
  if (val !== getEditor()?.getValue()) {
    updateVal(val)
  }
}
const handleFormatCode = () => {
  updateMonacoVal(props.modelValue)
}

defineExpose({ updateOptions, setAutoHeight })
</script>

<template>
  <ElForm :inline="true" v-if="themeSelector || localLanguage">
    <ElFormItem v-if="languageSelector" label="language" class="w-30% mb-5px!">
      <ElSelect
        v-model="localLanguage"
        placeholder="Please select language"
        size="small"
        filterable
      >
        <ElOption
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </ElFormItem>
    <ElFormItem v-if="themeSelector" label="theme" class="w-30% mb-5px!">
      <ElSelect v-model="localTheme" placeholder="Please select language" size="small" filterable>
        <ElOption
          v-for="item in themeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
  <div class="w-100% h-100% relative">
    <!-- <div class="absolute top-0 right-20px z-999 cursor-pointer" @click="handleFormatCode">
      <img class="w-15px" src="@/assets/imgs/format.png" alt="" />
    </div> -->
    <div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
  </div>
</template>
<style>
.highlight-host {
  color: rgb(255, 255, 255) !important;
  background-color: #2b90fb;
}
.highlight-result {
  color: rgb(255, 255, 255) !important;
  background-color: #2b90fb;
}
</style>
