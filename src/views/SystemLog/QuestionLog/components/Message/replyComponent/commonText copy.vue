<template>
  <div v-if="reply.title" class="common-title">
    <img src="/src/assets/imgs/chat/titleIcon.png" alt="" /><span>{{ reply.title }}</span></div
  >
  <div class="commonText" v-if="reply.text" v-html="reply.text || ''"></div>
  <div class="common-ul" v-if="reply.ulDataList && reply.ulDataList.length">
    <ul>
      <!-- <li v-for="(li, index) in reply.ulDataList" :key="index" v-html="li || ''"></li> -->
      <li v-for="(li, index) in reply.ulDataList" :key="index">
        <span>{{ li.name }}{{ li.valueText }}:</span>
        <span> {{ li.value }}{{ li.unit }} , </span>
        <span v-if="li.percent">占比{{ li.percent }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="jsx">
import { inject, onMounted } from 'vue'

const props = defineProps({
  reply: {
    type: Object,
    default: () => {}
  }
})
const scrollToBottom = inject('scrollToBottom', () => {})
onMounted(() => {
  scrollToBottom()
})
</script>
<style lang="less" scoped>
.common-title {
  // font-family: Microsoft YaHei;
  font-family: 'AlibabaRegular';
  font-size: 16px;
  font-weight: bold;
  // height: 24px;
  // // line-height: 24px;
  letter-spacing: 0em;
  color: #333333;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}
.common-ul {
  ul {
    margin: 5px 0;
    font-family: Microsoft YaHei;
    li {
      span {
        margin-right: 10px;
      }
    }
  }
}
.commonText {
  text-indent: 0em;
}
</style>
