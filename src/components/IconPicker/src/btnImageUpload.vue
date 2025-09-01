<!-- 该组件所使用接口暂时仅支持单个文件上传-->
<script setup lang="tsx">
import { reactive, ref, computed, watch, PropType, onBeforeUnmount, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElUpload, ElScrollbar, ElButton, UploadProps, UploadUserFile } from 'element-plus'
import { handleFileUpload } from '../api'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const color = ref(appStore.getTheme.elColorPrimary)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  appendBtnIcon: {
    type: String,
    default: 'ri:upload-2-line'
  },
  icon: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: ''
  },
  onlyImg: propTypes.bool.def(true),
  isAppendBtn: propTypes.bool.def(false)
})
const emit = defineEmits(['update:modelValue', 'upload'])
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {}

const fileUpload = async (res) => {
  let response = await handleFileUpload({
    file: res.file,
    folder: 'AIFile'
  })
  if (props.isAppendBtn) {
    emit('upload', response)
  }
}
const data = reactive({})


onBeforeUnmount(() => {
  // showFileList.value.length = 0
})
const imgType = ref('image/jpg,image/jpeg,image/png')

</script>
<template>
  <div class="upload-box">
    <ElUpload
      ref="fileUploadRef"
      action="#"
      :show-file-list="false"
      name="input"
      :on-change="handleChange"
      :http-request="fileUpload"
      :data="data"
      :accept="onlyImg ? imgType : ''"
    >
      <div  class="icon-box" :style="{ backgroundColor: color }">
        <ElButton style="color: white" link
          ><Icon :icon="appendBtnIcon" class="m-r-5px" />{{
           btnText
          }}</ElButton
        >
      </div>
    </ElUpload>
  </div>
</template>
<style lang="less" scoped>
.upload-box {
  width: 100%;
  flex-wrap: wrap;
  .img-box {
    margin-top: 10px;
    flex-wrap: wrap;
    max-height: 130px;
  }

}

.icon-box {
  position: absolute;
  right: 0;
  min-width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: pointer;
  top: 0;
}
</style>
