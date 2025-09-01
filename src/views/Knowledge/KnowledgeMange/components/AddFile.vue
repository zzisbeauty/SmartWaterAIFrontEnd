<script setup lang="tsx">
import { handleSaveFile } from '../IndexApi'
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
const uploadRef = ref()
const fileList = ref([])

// 获取对应小图标
const getIcon = (fileItem) => {
  let filetype = fileItem.raw.type
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
  } else if (['json'].indexOf(filetype.toLowerCase()) != -1) {
    return 'json'
  } else {
    return 'other'
  }
}
// 文件大小格式化函数
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  const units = ['KB', 'MB', 'GB']
  let index = 0
  while (bytes >= 1024 && index < units.length) {
    bytes /= 1024
    index++
  }
  // 动态小数位：小于10时保留2位，小于100时保留1位，其他不保留
  let decimals = bytes < 10 ? 2 : bytes < 100 ? 1 : 0
  return `${bytes.toFixed(decimals)} ${units[index - 1]}`
}

const handleDelete = (file) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
}
const beforeUpload = (rawFile) => {
  // 支持pdf、docx、md、txt、png、格式；文档最大限制100MB；最多支持一个文件上传；
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/plain',
    'image/png'
  ]
  const isValidType =
    allowedTypes.includes(rawFile.type) ||
    ['.pdf', '.docx', '.md', '.txt', '.png'].some((ext) => rawFile.name.toLowerCase().endsWith(ext))

  if (!isValidType) {
    useMessage('error', '仅支持PDF/DOCX/MD/TXT/PNG格式的文件')
    return false
  }

  const isValidSize = rawFile.size / 1024 / 1024 <= 100
  if (!isValidSize) {
    useMessage('error', '文件大小不得超过100MB')
    return false
  }

  return true
}

const saveId = ref('')
const fileUpload = async (res) => {
  let response: any = await handleFileUpload({
    file: res.file,
    folder: 'AIFile'
  })
  saveId.value = response.fileId
}
const submit = async () => {
  const file = fileList.value[0].raw
  console.log('file===========>', props.item.id)
  const formData = new FormData()
  formData.append('ragId', props.item.id)
  formData.append('file', file)
  formData.append('folder', 'AIFile')
  const res: any = await handleSaveFile(formData)
  if (res.success) {
    useMessage('success', res.message || '操作成功')
    return true
  } else {
    useMessage('error', res.message || '操作失败')
    return false
  }
}
defineExpose({
  submit
})
</script>

<template>
  <div class="h-100% w-100%">
    <el-upload
      ref="uploadRef"
      class="custom-upload"
      drag
      :limit="1"
      action="#"
      :show-file-list="false"
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      :auto-upload="false"
      :on-exceed="() => useMessage('warning', '最多只能上传一个文件')"
      accept=".pdf,.docx,.md,.txt,.png"
    >
      <template #default>
        <div class="h-100% gap-20px flex flex-col justify-center items-center bg-#F8F8F8">
          <Icon icon="svg-icon:app-fileUpload" :size="48" />
          <span>支持pdf、docx、md、txt、png格式；文档最大限制100MB；最多支持一个文件上传；</span>
          <BaseButton type="primary"> 选择文件 </BaseButton>
        </div>
      </template>
    </el-upload>
    <div class="title">上传情况</div>
    <div class="fileItem" v-for="(item, index) in fileList" :key="index">
      <div class="fileItem-left flex gap-5px items-center">
        <img :src="importImg(`fileTypes/${getIcon(item)}`)" alt="" />
        <div class="fileItem-left-name">{{ item.name }}</div>
      </div>
      <div class="fileItem-mid">{{ formatFileSize(item.size) }} </div>
      <div class="fileItem-right cursor-pointer" @click.stop="handleDelete(item)">
        <Icon icon="svg-icon:app-fileDelete" :size="12" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.custom-upload {
  height: 70%;
  margin: 0 10px;
  padding: 30px 64px;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px dashed #2b90fb;
  background-color: #f8f8f8;

  .el-upload-dragger {
    background: transparent !important;
  }
}

.title {
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  letter-spacing: 0em;
  color: #333333;
  margin: 16px 10px;
}

.fileItem {
  height: 48px;
  background: #f8f8f8;
  margin: 0 10px;
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-upload) {
  height: 100%;

  .el-upload-dragger {
    height: 100%;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
}
</style>
