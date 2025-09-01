<template>
  <div class="w-100% h-100%">
    <div
      class="detail-box w-100% grid gap-y-15px"
      style="grid-template-columns: 1fr 1fr"
    >
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">名称：</span>
        <div class="flex-1 text-14px color-#333">{{ details.name }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">服务名称：</span>
        <div class="flex-1 text-14px color-#333">{{ details.asrId_dictText }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">语音格式：</span>
        <div class="flex-1 text-14px color-#333">{{ details.phoneticMatric }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">模型特征串：</span>
        <div class="flex-1 text-14px color-#333">{{ details.modelCharacter }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-120px text-start">转为阿拉伯数字：</span>
        <div class="flex-1 text-14px color-#333"
          ><el-tag class="w-48px" :type="details.toArabicNumberals  ? 'primary' : 'danger'">
            {{ details.toArabicNumberals_dictText }}
          </el-tag></div
        >
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">头静音时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.headSilenceTime }}ms</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">尾静音时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.tailSilenceTime }}ms</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">添加标点：</span>
        <div class="flex-1 text-14px color-#333">
          <el-tag class="w-48px" :type="details.addPunctuation  ? 'primary' : 'danger'">
            {{ details.addPunctuation ? '是' : '否' }}
          </el-tag>
        </div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">输出中间结果：</span>
        <div class="flex-1 text-14px color-#333">
          <el-tag class="w-48px" :type="details.outputMiddleResult  ? 'primary' : 'danger'">
            {{ details.outputMiddleResult  ? '是' : '否' }}
          </el-tag>
        </div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">输出分词：</span>
        <div class="flex-1 text-14px color-#333">
          <el-tag class="w-48px" :type="details.outputPartticple  ? 'primary' : 'danger'">
            {{ details.outputPartticple  ? '是' : '否' }}
          </el-tag>
        </div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 text-start">启停状态：</span>
        <div class="flex-1 text-14px color-#333">
          <el-tag class="w-48px" :type="details.startStopStatus ? 'primary' : 'danger'">
            {{ details.startStopStatus ? '启用' : '禁用' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'

const details = ref<any>({
  name: '',
  serviceProvider: '',
  voiceFormat: '',
  modelFeatureString: '',
  headSilenceTime: 0,
  tailSilenceTime: 0,
  arabicDigits: false,
  outputIntermediateResults: false,
  outputSegmentation: false,
  startStopStatus: false,
  punctuation: false
})

const feedBackData = (row: any) => {
  details.value = row
}

defineExpose({
  feedBackData
})
</script>

<style scoped lang="less">
.title-box {
  padding: 10px 0;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #efefef;
    margin-left: 12px;
  }
}

.detail-box {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  border-radius: 4px 4px 0px 0px;
  // background: #F5F5F5;
}

.gray-card-tabs {
  :deep(.el-tabs__item) {
    background: rgba(0, 0, 0, 0.0392);
    border: 1px solid rgba(0, 0, 0, 0.149);
    border-radius: 4px 4px 0px 0px;
    margin-right: 5px;

    &:first-child {
      border-left: 1px solid rgba(0, 0, 0, 0.149) !important;
    }

    &.is-active {
      background: #ffffffff;
    }
  }

  :deep(.el-tabs__header) {
    // border-bottom: 0;
  }

  :deep(.el-tabs__nav) {
    border: 0 !important;
  }
}
</style>
