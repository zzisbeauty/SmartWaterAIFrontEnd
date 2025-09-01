<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { handleGetApiInfo } from '../../IndexApi'
import { initApiFromData } from '../Edit/basicData'
import DetailItem from './DetailTitle.vue'

import baseInfo from './baseInfo.vue'
import paramsConfig from './paramsConfig.vue'
import questionConfig from './questionConfig.vue'
import linkConfig from './linkConfig.vue'
import speakConfig from './speakConfig.vue'
import styleConfig from './styleConfig.vue'

const activeNames = ref(['1', '2', '3', '4', '5', '6'])
const basicData = ref<any>(cloneDeep(initApiFromData))
//获取数据
const loading = ref(false)
const getPageData = async (params: any) => {
  loading.value = true
  try {
    const res: any = await handleGetApiInfo(params)
    basicData.value = {
      ...res.result
    }
  } catch (error) {
    console.error('获取API信息失败:', error)
  } finally {
    loading.value = false
  }
}
defineExpose({
  getPageData
})
</script>

<template>
  <el-collapse v-model="activeNames" class="collapse-container">
    <DetailItem :item="{ name: '1', titleZn: '基本信息', titleEn: '1', activeNames: activeNames }">
      <baseInfo :data="basicData" />
    </DetailItem>
    <DetailItem :item="{ name: '2', titleZn: '参数配置', titleEn: '2', activeNames: activeNames }">
      <paramsConfig :data="basicData?.apiParamConfigList || []" />
    </DetailItem>
    <DetailItem
      :item="{ name: '3', titleZn: '提问语配置', titleEn: 'Policy', activeNames: activeNames }"
    >
      <questionConfig :data="basicData?.apiQuestionConfigList || []" />
    </DetailItem>
    <DetailItem
      :item="{ name: '4', titleZn: '关联问题配置', titleEn: '4', activeNames: activeNames }"
    >
      <linkConfig :data="basicData?.apiRelationConfigList || []" />
    </DetailItem>
    <DetailItem
      :item="{ name: '5', titleZn: '播报语配置', titleEn: '5', activeNames: activeNames }"
    >
      <speakConfig :data="basicData || []" />
    </DetailItem>
    <DetailItem
      :item="{ name: '6', titleZn: '展示样式配置', titleEn: '6', activeNames: activeNames }"
    >
      <styleConfig :data="basicData?.apiStyleRelationList || []" />
    </DetailItem>
  </el-collapse>
</template>

<style lang="less" scoped>
.collapse-container {
  border: none;

  :deep(.el-collapse-item) {
    .el-collapse-item__wrap {
      border: none !important;
    }
  }
}

.label-title {
  width: 120px;
  font-size: 14px;
  color: #777;
}
</style>
