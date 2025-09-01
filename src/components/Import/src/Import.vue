<script setup lang="tsx">
import { reactive, ref, computed } from 'vue'
// import { genFileId } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { Dialog } from '@/components/Dialog'
import { genFileId } from 'element-plus/es/components/upload/src/upload.mjs'

/*该组件暂不支持多选文件，后续按需扩展成支持多文件上传*/
const props = defineProps({
  title: propTypes.string.def('导入文件'), //弹窗名称
  importExplain: propTypes.array.def([]), //导入说明
  autoUpload: propTypes.bool.def(true), //是否自动上传文件
  showFileList: propTypes.bool.def(false), //是否显示已上传文件列表
  limit: propTypes.number.def(1) //允许上传文件的最大数量
})
const emit = defineEmits(['getTemplate', 'uploadFile'])
const fileList = ref([])
const dialogVisible = reactive({
  importVisible: true,
  importTitle: computed(() => props.title)
})
const upload = ref(null)

const defaultHandleExceed = (files) => {
  upload.value!.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value!.handleStart(file)
  // 如果设置了自动上传，则执行自定义上传
  if (props.autoUpload) {
    customUpload({ file: file })
  }
}
// 获取导入模板，父组件自定义
const downloadFile = () => {
  emit('getTemplate')
}
// 触发自定义上传方法
const customUpload = (files) => {
  emit('uploadFile', files.file)
}
</script>
<template>
  <Dialog
    v-model="dialogVisible.importVisible"
    :title="dialogVisible.importTitle"
    :max-height="'auto'"
    maxWidth="650px"
  >
    <div class="import">
      <div class="import-top">
        <div class="import-top-title"> 基础信息: </div>
        <div class="import-top-content">
          <div class="import-ul">
            <div class="import-ul__text"
              ><span class="import-ul__order">1</span> <span>下载模板:</span></div
            >
            <div class="import-ul__btn">
              <ElButton size="small" type="primary" link @click="downloadFile" class="downBtn"
                >导入模板</ElButton
              >
            </div>
          </div>
          <div class="import-ul">
            <div class="import-ul__text"
              ><span class="import-ul__order">2</span> <span>上传Excel:</span></div
            >
            <div class="import-ul__btn">
              <ElUpload
                v-bind="$attrs"
                ref="upload"
                :file-list="fileList"
                :http-request="customUpload"
                :limit="limit"
                :auto-upload="autoUpload"
                :show-file-list="showFileList"
                :on-exceed="$attrs.handleExceed || defaultHandleExceed"
              >
                <template #trigger>
                  <ElButton size="small" type="primary">选择文件</ElButton>
                </template>
                <!-- <template  #tip>
                    <div class="el-upload__tip text-red"> 未选择文件 </div>
                  </template> -->
              </ElUpload>
            </div>
          </div>
        </div>
      </div>
      <div class="import-bottom">
        <div class="import-bottom-title"> 导入说明: </div>
        <div class="import-bottom-content">
          <div class="import-ul">
            <div class="import-ul__text"
              ><span class="import-ul__order">1</span> <span>下载模板:</span></div
            >
            <!-- <div class="import-ul__btn">
              <ElButton size="small" type="primary" link class="downBtn">导入模板</ElButton>
            </div> -->
          </div>
          <div class="import-ul">
            <div class="import-ul__text"
              ><span class="import-ul__order">2</span> <span>填写模板数据后将文件上传</span></div
            >
          </div>
          <div class="import-ul" v-for="(item, index) in importExplain" :key="index">
            <div class="import-ul__text"
              ><span class="import-ul__order">{{ index + 3 }} </span> <span>{{ item }}</span></div
            >
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style lang="less" scoped>
// .downBtn {
//   position: relative;
// }
// .downBtn::after {
//   content: '';
//   position: absolute;
//   left: 50%;
//   bottom: -1px; /* 调整这个值来控制下划线与文本之间的间隔 */
//   width: 100%;
//   height: 0.5px;
//   transform: translate(-50%, 0);
//   background-color: #536dfe; /* 下划线颜色 */
// }

.import {
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .import-ul {
    display: flex;
    justify-content: flex-start;
    line-height: 32px;
    // gap: 60px;
    flex-wrap: wrap;
    &__text {
      min-width: 100px;
      margin-right: 50px;
    }

    &__btn > div:first-child {
      height: 0;
    }

    &__order {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #efefef;
      border-radius: 50%;
      text-align: center;
      margin-right: 10px;
    }
  }

  .import-top {
    // height: 30%;
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;

    &-title {
      color: #000;
      font-weight: bold;
    }

    &-content {
      height: auto;
      padding: 10px 0 0 60px;
    }
  }

  .import-bottom {
    // height: 60%;
    flex: 1;
    width: 100%;
    padding-top: 20px;

    &-title {
      color: #000;
      font-weight: bold;
    }

    &-content {
      height: auto;
      padding: 10px 0 0 60px;
    }
  }
}

:deep(.el-upload-list) {
  margin-top: 0;
  bottom: 50px;
  left: 100px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .el-upload-list__item {
    margin-bottom: 0;
    line-height: 20px;
  }
}

.el-upload__tip {
  line-height: 20px;
  margin-top: 0;
}
</style>
