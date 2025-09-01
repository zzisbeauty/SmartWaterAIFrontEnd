<template>
  <div>
    <div class="common-text-content font0 alibaba-light">
      <div class="common-text font-size-16px">
        <img
          v-if="isAwait"
          src="@/assets/svgs/dot.svg"
          style="width: 14px; height: 14px; margin-left: 4px"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, inject, computed, onUpdated, Ref, nextTick } from 'vue'
const isAwait = ref(true)
const scrollToBottom = inject('scrollToBottom', () => {})
onMounted(async () => {
})
onUpdated(scrollToBottom)
</script>
<style lang="less" scoped>
.reply-box-title {
  display: flex;
  align-items: center;
  margin: 10px 10px;
  font-size: 16px;
  font-family: 'AlibabaRegular';
  letter-spacing: 0em;
  color: #333;
  img {
    // width: 29px;
    // margin-right: 20px;
  }
}

.common-text-content {
  color: #333;
  // padding: 0 5px;
  .common-text {
    padding: 0 5px;
  }
  .ul-text {
    div {
      margin: 5px 0;
    }
    li::marker {
    }

    ul {
    }

    li {
      font-size: 14px;
    }

    .opacity9 {
      opacity: 0.9;
    }
  }
}
</style>
