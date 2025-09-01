<template>
  <div class="w-100% h-100%">
    <div class="detail-box w-100% grid gap-y-15px" style="grid-template-columns: 1fr 1fr">
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">服务商：</span>
        <div class="flex-1 text-14px color-#333">{{ details.serviceProvider }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">服务名称：</span>
        <div class="flex-1 text-14px color-#333">{{ details.name }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">当前可用时长：</span>
        <div class="flex-1 text-14px color-#333">{{ details.availableTime }}分钟</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">总可用时长：</span>
        <div class="flex-1 text-14px color-#333">{{ details.totalTime }}分钟</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">开通时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.openingTime }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">到期时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.expirationTime }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">费用：</span>
        <div class="flex-1 text-14px color-#333">{{ details.cost }}元</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">状态：</span>
        <div class="flex-1 text-14px color-#333"
          ><el-tag
            :type="details.status == 1 ? 'success' : details.status == 2 ? 'warning' : 'danger'"
            >{{ details.status_dictText }}</el-tag
          ></div
        >
      </div>
    </div>
    <!-- 认证签名字段独占一行 -->
    <div class="detail-box p-t-15px w-100%">
      <div class="flex items-center w-100%">
        <span class="text-14px color-#777777 w-84px text-start">认证签名：</span>
        <div class="flex-1 text-14px color-#333">{{ details.signatrue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { status } from 'nprogress'

const details = ref<any>({
  serviceProvider: '',
  name: '',
  totalDuration: 0,
  startTime: '',
  endTime: '',
  status: 1,
  cost: 0,
  certifiedSignature: ''
})

const feedBackData = async (row) => {
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
