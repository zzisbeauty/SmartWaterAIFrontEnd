<script setup lang="tsx">
import { computed, nextTick, onMounted, reactive, ref, useAttrs, watch } from 'vue'
import JsonEditorVue from '@axolo/json-editor-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: ()=>{}
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const getBindValue = computed(() => {
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  return obj
})

const formatter = (value) => {
  return JSON.stringify(value)
}
const  editorRef = ref()
onMounted(() => {
  nextTick(() => {
    console.log( editorRef.value)
  })
})



// modelValue	any		JSON string, object, array ...
// placeholder	String		placeholder
// readonly	Boolean	false	readonly
// dark	Boolean	false	dark theme as oneDark
// codec	[Boolean, Array]	false	See codec
// format	[Boolean, Function]	false	See format (TODO)
// extensions	Array	[]	extra codemirror extensions (TODO)

</script>


<template>
    <json-editor-vue
    ref="editorRef"
    v-bind="getBindValue"
    :format="true"
    codec
    class="custom-editor"
  />
</template>
<style lang="less" scoped>
.custom-editor{
    width: 100%;
    // height: 100%;
    box-sizing: border-box;
    :deep(.editor){
        .cm-focused{
            outline: none !important;
        }
        .cm-scroller{
            height: 100%;
        }
    }
}


</style>
