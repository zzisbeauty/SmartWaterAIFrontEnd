<!-- 该组件所使用接口暂时仅支持单个文件上传-->
<script setup lang="tsx">
import { reactive, ref, computed, watch, PropType, onBeforeUnmount, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { ElUpload, ElScrollbar, ElButton, UploadProps, UploadUserFile } from 'element-plus'
import { handleFileUpload } from './api'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const color = ref(appStore.getTheme.elColorPrimary)
interface fileItem {
  fileId: string
  fileName: string
  fileUrl: string
}
interface fileListItem {
  id: string
  filePath: string
  oldName: string
  suffix: string
}
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  fileList: {
    type: Array as PropType<fileListItem[]>,
    default: () => []
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
  onlyImg: propTypes.bool.def(false),
  //   isAppendBtn: propTypes.bool.def(false),
  showList: propTypes.bool.def(false),
  remark: propTypes.string.def(''),
  limit: propTypes.number.def(5),
  accept: propTypes.string.def('*'),
  beforeUpload: propTypes.func.def(() => {})
})

const emit = defineEmits(['update:modelValue', 'upload', 'before', 'ChangeUrl'])
const uploadedFile: any = ref('')
const handleChange: UploadProps['onChange'] = (rawFile) => {}
const showFileList = ref<fileItem[]>([])
onMounted(() => {
  //   showFileList.value.length = 0
})
watch(
  () => props.fileList,
  async (val) => {
    if (props.fileList?.length) {
      let files = val
      files.map((e) => {
        showFileList.value.push({
          fileId: e.id,
          fileUrl: e.filePath,
          fileName: e.oldName + '.' + e.suffix
        })
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.modelValue,
  async (val: String) => {
    if (!uploadedFile.value) {
      uploadedFile.value = props.modelValue
    }
  },
  {
    immediate: false
  }
)
watch(
  () => showFileList.value,
  async (val) => {
    let fileIds = showFileList.value.map((e) => e.fileId).toString()
    emit('update:modelValue', fileIds)
  },
  {
    immediate: true,
    deep: true
  }
)

const fileUpload = async (res) => {
  let response: any = await handleFileUpload({
    file: res.file,
    folder: 'AIFile'
  })
  if (response.success) {
    // 上传成功后进行回显
    uploadedFile.value = response.fileUrl
    emit('ChangeUrl', { file: uploadedFile.value, fileId: response.fileId })
  }

  if (props.limit == 1) {
    showFileList.value = [
      {
        ...response
      }
    ]
  } else {
    showFileList.value.push(response)
  }
}
const data = reactive({})
// 获取对应小图标
const getIcon = (fileItem: fileItem) => {
  let url = fileItem.fileName
  let index = url.lastIndexOf('.')
  let filetype = url.substring(index + 1)
  if (
    ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff', 'tif'].indexOf(
      filetype.toLowerCase()
    ) !== -1
  ) {
    return 'image'
  } else if (['doc', 'docx'].indexOf(filetype.toLowerCase()) != -1) {
    return 'doc'
  } else if (['mp3', 'wma', 'mov', 'amr'].indexOf(filetype.toLowerCase()) != -1) {
    return 'audio'
  } else if (['pdf'].indexOf(filetype.toLowerCase()) != -1) {
    return 'pdf'
  } else if (['xls', 'xlsx'].indexOf(filetype.toLowerCase()) != -1) {
    return 'excel'
  } else if (['mp4', 'avi', 'mov', 'wmv'].indexOf(filetype.toLowerCase()) != -1) {
    return 'video'
  } else {
    return 'other'
  }
}

const importUrl = (url: string) => {
  return new URL(`/src/assets/imgs/fileTypes/filetype${url}.png`, import.meta.url).href
}
const delFileItem = (index) => {
  showFileList.value.splice(index, 1)
}
onBeforeUnmount(() => {
  // showFileList.value.length = 0
})
const imgType = ref('image/jpg,image/jpeg,image/png')
const filesTypeAll = ref(
  'image/jpg,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
)
</script>
<template>
  <div class="upload-box">
    <div class="flex img-box" v-if="onlyImg">
      <div
        class="cursor-pointer upload-img relative"
        v-for="(item, index) in showFileList"
        :key="index"
      >
        <img class="" :src="item.fileUrl" alt="" />
        <div class="upload-delete">
          <Icon icon="svg-icon:table-delete" class="!color-#fff" @click="delFileItem(index)" />
        </div>
      </div>
    </div>
    <ElUpload
      ref="fileUploadRef"
      action="#"
      :accept="accept ? accept : ''"
      :data="data"
      :show-file-list="false"
      name="input"
      :http-request="fileUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
    >
      <img v-if="uploadedFile" :src="uploadedFile" />
      <div v-else class="flex flex-col justify-center items-center avatar-uploader">
        <Icon icon="ep:plus" class="avatar-uploader-icon" :size="36" />
        <div class="font-size-12px">上传形象图片</div>
        <div class="font-size-10px">(请上传png,jpg格式图片，最小2.5MB)</div>
      </div>
      <!-- <div class="upload-img-box" v-if="onlyImg">
        <ElButton type="primary" :icon="icon">{{ btnText }}</ElButton>
        <div class="font-size-12px color-#aaa">{{ remark }}</div>
      </div>
      <div v-else>
        <ElButton type="primary" :icon="icon">{{ btnText }}</ElButton>
      </div> -->
    </ElUpload>
    <div class="flex flex-col" v-if="showList">
      <div
        class="flex justify-between items-center cursor-pointer bg-#F8F8F8 m-b-10px p-3px w-100%"
        v-for="(item, index) in showFileList"
        :key="item.fileId"
      >
        <div class="flex items-center w-[calc(100%-20px)]">
          <div class="p-x-10px">
            <img class="w-37px h-37px vertical-middle" :src="importUrl(getIcon(item))" alt="" />
          </div>
          <div class="font-size-12px whitespace-nowrap overflow-hidden text-ellipsis">{{
            item.fileName
          }}</div>
        </div>
        <div class="w-20px">
          <Icon
            class="cursor-pointer"
            icon="ep:close"
            hover-color="var(--el-color-error)"
            color="var(--el-color-info)"
            @click="delFileItem(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.upload-box {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  .img-box {
    flex-wrap: wrap;
    max-height: 130px;
  }
  .upload-img {
    width: 100px;
    height: 100px;
    position: relative;
    margin-bottom: 10px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
    }
  }

  .upload-delete {
    display: none;
    position: absolute;
    background: rgba(0, 0, 0, 0.3608);
    text-align: center;
    height: 26px;
    cursor: pointer;
    bottom: 0;
    width: 100%;
  }
}
.upload-img:hover {
  .upload-delete {
    display: block;
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
<style lang="less" scoped>
:deep(.el-upload) {
  position: relative;
  left: 0px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
  width: 112px;
  height: 112px;
  img {
    height: 112px;
    max-width: 112px;
    object-fit: contain;
  }

  &:hover {
    border-color: var(--el-color-primary);
  }
  .avatar-uploader {
    line-height: 16px;
    height: 100%;
    color: #8c939d;
    background: #fafafa;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.149);
  }
  .avatar-uploader-icon {
    // width: 28px;
    // height: 28px;
  }
  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 16px;
  }
}
</style>
