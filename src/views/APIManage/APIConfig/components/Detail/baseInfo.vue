<script setup lang="ts">
import { text } from 'stream/consumers'

interface ApiData {
  apiCode?: string
  apiName?: string
  categoryId?: string
  businessSystemCode?: string
  type?: string
  apiSecret?: string
  apiDesc?: string
}

// 接收参数
const props = defineProps<{
  data: ApiData
}>()

const typeMap = {
  '1': { text: '网关接口', type: 'primary' },
  '2': { text: '一般接口', type: 'warning' },
  '3': { text: '外部链接', type: 'success' }
}
</script>

<template>
  <div class="mt-10px grid grid-cols-3 gap-14px">
    <div class="flex items-center">
      <div class="label-title"> 接口编号 : </div>
      <div class="flex-1">
        {{ data?.apiCode }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="label-title"> 接口名称 : </div>
      <div class="flex-1">
        {{ data?.apiName }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="label-title"> 所属分类 : </div>
      <div class="flex-1">
        {{ data?.categoryId_dictText }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="label-title"> 所属业务系统 : </div>
      <div class="flex-1">
        {{ data?.businessSystemCode_dictText }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="label-title"> 类型 : </div>
      <div class="flex-1">
        <el-tag
          v-if="data?.type && typeMap[data.type]"
          size="small"
          :type="typeMap[data.type].type"
        >
          {{ typeMap[data.type].text }}
        </el-tag>
        <span v-else>{{ data?.type_dictText }}</span>
      </div>
    </div>
    <div class="flex items-center" v-if="data?.type == '1' || data?.type == '2'">
      <div class="label-title"> 请求类型 : </div>
      <div class="flex-1">
        {{ data?.requestType }}
      </div>
    </div>
    <div class="flex items-center" v-if="data?.type == '1'">
      <div class="label-title"> 接口密钥 : </div>
      <div class="flex-1">
        {{ data?.apiSecret }}
      </div>
    </div>
    <div class="flex items-center" v-if="data?.type == '2'">
      <div class="label-title"> 请求地址 : </div>
      <div class="flex-1">
        {{ data?.url }}
      </div>
    </div>

    <div class="flex items-center" v-if="data?.type == '3'">
      <div class="label-title"> 链接地址 : </div>
      <div class="flex-1">
        {{ data?.linkUrl }}
      </div>
    </div>
    <div class="flex items-start" style="grid-column: span 3">
      <div class="label-title"> 接口描述 ： </div>
      <div class="flex-1">
        {{ data?.apiDesc || '暂无描述' }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.label-title {
  margin-right: 10px;
  font-weight: 500;
  white-space: nowrap;
}
</style>
