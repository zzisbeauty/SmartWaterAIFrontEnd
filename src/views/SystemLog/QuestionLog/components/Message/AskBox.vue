<template>
  <div class="ask-content">{{ ask.content.text }}</div>
  <div class="ask-info">
    <div class="ask-info__text">回答: {{ ask.info.time }}</div>
    <span>|</span>
    <div class="ask-info__text">tokens: {{ ask.info.tokens }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  ask: {
    type: Object,
    default: () => {}
  }
})
</script>
<style scoped lang="less" scope>
.ask-content {
  font-family: Microsoft YaHei UI;
  font-size: 14px;
  font-weight: normal;
  line-height: 14px;
  letter-spacing: 0em;
  color: #333333;
  white-space: pre-wrap;
  word-break: break-word;
}
.ask-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: Microsoft YaHei UI;
  font-size: 12px;
  font-weight: normal;
  line-height: 12px;
  letter-spacing: 0em;
  color: #aaaaaa;
  margin-top: 12px;
}
</style>
