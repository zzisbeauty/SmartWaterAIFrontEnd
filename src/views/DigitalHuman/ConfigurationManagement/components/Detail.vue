<script setup lang="tsx">
const details = ref<any>({})
const feedBackData = async (row) => {
  details.value = row
}

defineExpose({
  feedBackData
})
</script>

<template>
  <div class="w-100% h-100% flex">
    <!-- 左侧单列表单区域 -->
    <div class="w-35% py-20px px-20px" style="border-right: 1px solid #efefef">
      <div class="flex flex-col gap-28px">
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">数字人实例：</span>
          <div class="flex-1 text-14px color-#333333">{{ details.digitalHumanId_dictText }}</div>
        </div>
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">服务名称：</span>
          <div class="flex-1 text-14px color-#333333">{{ details.serviceId_dictText }}</div>
        </div>
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">音色：</span>
          <div class="flex-1 text-14px color-#333333">{{ details.voice_dictText }}</div>
        </div>
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">token过期时间：</span>
          <div class="flex-1 text-14px color-#333333">{{ details.tokenExpirationTime }}</div>
        </div>
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">支持远程失效：</span>
          <div class="flex-1 text-14px color-#333333">
            <el-tag type="primary" class="w-48px" v-if="details.supportLoseEfficacy">是</el-tag>
            <el-tag type="danger" class="w-48px" v-else>否</el-tag>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-14px color-#777777 text-start">启停状态：</span>
          <el-tag type="primary" class="w-48px" v-if="details.status">开启</el-tag>
          <el-tag type="danger" class="w-48px" v-else>禁用</el-tag>
        </div>
      </div>
    </div>
    <!-- 右侧图片预览区域 -->
    <div class="h-100% w-65%">
      <div class="bg-#FAFAFA flex-1 h-100%">
        <El-Image
          :src="details.imageUrl"
          fit="contain"
          alt="请上传图片"
          style="
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            object-position: center;
          "
        >
          <template #error>
            <div class="image-slot"> </div>
          </template>
        </El-Image>
      </div>
    </div>
  </div>
</template>

<style lang="less">
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
  }
  :deep(.el-tabs__nav) {
    border: 0 !important;
  }
}
// 新增单列表单样式
:deep(.arco-form) {
  .arco-form-item {
    width: 100%;
    display: block;
    margin-bottom: 15px;
  }
  .arco-form-item-label {
    text-align: left;
    width: 100%;
    padding: 0;
  }
  .arco-form-item-wrapper {
    width: 100%;
  }
}
</style>
