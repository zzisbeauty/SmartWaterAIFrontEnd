<template>
  <div v-if="isEmpty(reply.content)" class="max-w-800px text-sm text-gray-500">
    <commonAwait />
  </div>
  <div v-if="reply.type === 'text'" class="max-w-800px text-sm text-gray-500">
    <commonText :reply="reply.content" />
  </div>
  <div v-else-if="reply.type === 'echarts'" class="max-w-800px m-5px min-w-600px">
    <commonText :reply="reply.content" />
    <div class="blue-bg" v-if="showChart">
      <Echart
        :height="reply.content.options[0].series[0]?.type == 'pie' ? '200px' : '380px'"
        v-for="item in reply.content.options"
        :key="item.id"
        :chartConfig="{ option: item }"
      />
    </div>
  </div>
  <div v-else-if="reply.type === 'table'" class="max-w-800px m-5px">
    <commonText :reply="reply.content" />
    <div class="blue-bg" v-if="showChart">
      <commonTable :tableConfig="reply.content.options" />
    </div>
  </div>
  <div v-else-if="reply.type === 'rank'" class="max-w-800px m-5px">
    <commonText :reply="reply.content" />
    <div class="blue-bg" v-if="showChart">
      <commonRank :rankConfig="reply.content.options" />
    </div>
  </div>
  <!-- <div v-else class="max-w-800px m-5px">
    <commonText :reply="{ text: '正在学习中...' }" />
  </div> -->
  <div class="replay-info">
    <div class="replay-info-left">
      <div class="replay-info__text">回答: {{ reply.info.time }}</div>
      <span>|</span>
      <div class="replay-info__text">tokens: {{ reply.info.tokens }}</div>
      <span>|</span>
      <div class="replay-info__text">响应时间: {{ reply.info.responseTime }} ms</div>
    </div>
    <div class="replay-info-right">
      <Icon
        icon="svg-icon:dialogue-good"
        :size="20"
        :color="likeStatus === 'like' ? '#FF0000' : '#2B90FB'"
        class="cursor-pointer"
        @click="handleLike"
      />
      <Icon
        icon="svg-icon:dialogue-notGood"
        :size="20"
        :color="likeStatus === 'dislike' ? '#FF0000' : '#2B90FB'"
        class="cursor-pointer"
        @click="handleDislike"
      />
      <Icon
        icon="svg-icon:dialogue-copyBtn"
        :size="20"
        color="#2B90FB"
        @click="handleCopyVal(reply.content.text)"
        class="cursor-pointer"
      />
      <Icon icon="svg-icon:dialogue-retract" :size="20" color="#2B90FB" class="cursor-pointer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, onUpdated, nextTick, provide } from 'vue'
import { isEmpty } from '@/utils/is'
import commonAwait from './replyComponent/commonAwait.vue'
import commonText from './replyComponent/commonText.vue'
import { Echart } from '../Echart'
import commonTable from './replyComponent/commonTable.vue'
import commonRank from './replyComponent/commonRank.vue'
import commonUrlPage from './replyComponent/commonUrlPage.vue'
const props = defineProps({
  reply: {
    type: Object,
    default: () => {}
  }
})
const showChart = ref(false)
provide('showChart', showChart)

const likeStatus = ref(null) // null | 'like' | 'dislike'

const handleLike = () => {
  likeStatus.value = likeStatus.value === 'like' ? null : 'like'
}

const handleDislike = () => {
  likeStatus.value = likeStatus.value === 'dislike' ? null : 'dislike'
}
import { useClipboard } from '@vueuse/core'
// 复制到剪切板
const handleCopyVal = async (val) => {
  const { copy, copied, isSupported } = useClipboard({
    source: `${val}`,
    legacy: true
  })
  if (!isSupported) {
    useMessage('error', '当前浏览器不支持复制')
  } else {
    await copy()
    if (unref(copied)) {
      useMessage('success', '复制成功')
    }
  }
}
</script>
<style scoped lang="less" scope>
.replay-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;

  &-left {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    font-family: Microsoft YaHei UI;
    font-size: 12px;
    font-weight: normal;
    line-height: 12px;
    letter-spacing: 0em;
    color: #aaaaaa;
  }
  &-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
.blue-bg {
  margin-top: 10px;
  background: #f9fbff;
  box-shadow: inset 0px 0px 12px 0px rgba(24, 144, 255, 0.1216);
  // padding: 15px 20px;
  padding: 3px;
  border-radius: 10px;
}
</style>
