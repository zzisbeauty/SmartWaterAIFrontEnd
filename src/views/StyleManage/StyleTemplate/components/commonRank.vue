<template>
  <div class="ai-rank" style="width: 100%; height: 100%">
    <div class="norem-chartBg">
      <div
        class="flex flex-row rank-title align-items-center"
        :class="{ 'dark-theme': isDarkTheme }"
      >
        <div
          class="title"
          :class="'list-' + index"
          v-for="(item, index) in rankConfig.propList"
          :key="index"
          >{{ item }}</div
        >
      </div>
      <div class="rank-content font-size-16px">
        <div
          class="flex flex-row rankItem"
          :class="'rankItem' + index"
          v-for="(item, index) in rankConfig.rankData"
          :key="index"
        >
          <div class="list-0">
            <span class="circle" :class="'circle-' + index">{{ index + 1 }}</span>
          </div>
          <div class="list-1" :class="{ 'dark-theme': isDarkTheme }">
            {{ item.name }}
          </div>
          <div class="list-2" :class="{ 'dark-theme': isDarkTheme }">
            {{ item.value }}{{ item.unit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, inject, nextTick, computed } from 'vue'
const props = defineProps({
  rankConfig: {
    type: Object,
    required: true
  }
})

console.log('rank', props)
const data = ref({})
// 尝试从父组件注入主题状态
const isDarkTheme = inject('isDarkTheme', ref(false))
// 遍历rankConfig.rankData 找出属性name最长字符
const minWidth = computed(() => {
  return Math.max(...props.rankConfig.rankData.map((item) => item.name.length)) * 14 + 300 + 'px'
})

const scrollToBottom = inject('scrollToBottom', () => {})
onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
onBeforeUnmount(() => {
  // 组件销毁前的逻辑
})
</script>
<style lang="less" scoped>
.norem-chartBg {
  width: auto;
  height: auto;
  border-radius: 12px;
  // padding: 10px;
  margin: 10px;
  // border: 1px solid rgb(111, 195, 255);
  // background: linear-gradient(to bottom, rgba(49, 122, 184, 0.24), rgb(1, 16, 27));
  // box-shadow:
  //   inset -1px 0px 20px 5px #018ce5c2,
  //   inset 0 0 30px 0px #011a2e;
}

.rank-content {
  overflow-y: auto;
  height: calc(100% - 50px);
  // .blueScrollBar(); // 假设有一个 blueScrollBar 混合
}

.ai-rank {
  // min-width: 500px;
  min-width: v-bind(minWidth);
  .title {
    font-size: 16px;
    text-align: left;
    line-height: 38px;
  }

  .list-0 {
    width: 15%;
    text-align: center;

    .circle {
      min-width: 20px;
      display: inline-block;
      border-radius: 50%;
      height: 20px;
      line-height: 20px;

      &.circle-0 {
        background: red;
        color: #fff;
      }

      &.circle-1 {
        background: rgba(255, 138, 0);
        color: #fff;
      }

      &.circle-2 {
        background: rgba(255, 210, 0);
        color: #fff;
      }
    }
  }
  .list-1 {
    width: 58%;
  }
  .list-2 {
    width: 30%;
  }

  .rankItem {
    margin: 8px 0;
    width: 100%;
    // height: 36px;
    // line-height: 36px;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
    border-radius: 20px;
    position: relative;
    color: #26a1da;
    background: url('@/assets/imgs/chat/rank-blue.png');
    background-size: 95% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    font-family: Microsoft YaHei;
    font-size: 16px;
    font-weight: normal;
    line-height: 38px;
    letter-spacing: 0em;

    // color: #333333;

    &.rankItem0 {
      background-image: url('@/assets/imgs/chat/rank-red.png');
      color: rgb(197, 70, 70);
    }

    &.rankItem1 {
      background-image: url('@/assets/imgs/chat/rank-orange.png');
      color: rgb(185, 143, 64);
    }

    &.rankItem2 {
      background-image: url('@/assets/imgs/chat/rank-yellow.png');
      // color: yellow;
      color: #a3a300;
    }
    &.rankNum0,
    &.rankNum1,
    &.rankNum2 {
      color: #fff;
    }
  }
}
.dark-theme {
  color: #fff;
}
</style>
