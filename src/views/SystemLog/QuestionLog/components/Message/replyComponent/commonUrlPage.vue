<template>
  <div class="w-100% h-100%">
    <div class="reply-box-title h-24px" v-if="replyContent.title">
      <span class="flex items-center justify-start gap-5px">
        <img :src="titleIcon" alt="" />
        <span>{{ replyContent.title }}</span>
      </span>
      <img
        :src="backIcon"
        width="20px"
        class="cursor-pointer"
        alt=""
        @click="emit('closeUrlPage')"
      />
    </div>
    <!-- <div class="loading w-full h-full"></div> -->
    <div class="iframe-container font0 alibaba-light h-[calc(100%-48px)]">
      <iframe
        ref="iframeRef"
        id="my-iframe"
        class="h-full w-full"
        :src="currentSrc"
        frameborder="0"
        allow="fullscreen"
        @load="onIframeLoad"
      ></iframe>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  onMounted,
  inject,
  computed,
  onUpdated,
  Ref,
  onBeforeUnmount,
  watch,
  IframeHTMLAttributes
} from 'vue'
import titleIcon from '@/assets/imgs/dialogueRecord/titleIcon.png'
import backIcon from '@/assets/imgs/dialogueRecord/backIcon.png'
const props = defineProps<{
  replyContent: any
}>()
const emit = defineEmits(['closeUrlPage'])
const startTyping = () => {}
const scrollToBottom = inject('scrollToBottom', () => {})
// 定义iframe的ref
const iframeRef = ref<HTMLIFrameElement | null>(null)

// 当前URL
const currentSrc = ref(props.replyContent.url)
const changeUrl = (newUrl, oldUrl) => {
  const newSrc = currentSrc.value === oldUrl ? newUrl : oldUrl
  currentSrc.value = newSrc
  if (iframeRef.value) {
    iframeRef.value.style.animationName = 'slideOut'
  }
}
// iframe加载完成后的回调
const onIframeLoad = () => {
  if (iframeRef.value) {
    iframeRef.value.style.animationName = 'slideIn'
  }
  removeAfter()
}
const removeAfter = () => {
  const iframeContainer: HTMLElement = document.querySelector('.iframe-container')
  if (iframeContainer) {
    // 移除after
    setTimeout(() => {

    }, 500)
    // 创建一个新的 <style> 元素
  }
}
const addAfter = () => {
  const iframeContainer: HTMLElement = document.querySelector('.iframe-container')
  if (iframeContainer) {
  }
}
watch(
  () => props.replyContent.url,
  (newUrl, oldUrl) => {
    addAfter()
    if (newUrl !== oldUrl) {
      changeUrl(newUrl, oldUrl)
    }
  },
  {
    deep: true
  }
)
onMounted(startTyping)
onUpdated(() => {
  scrollToBottom()
})
onBeforeUnmount(() => {})
</script>
<style lang="less" scoped>
.reply-box-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 16px;
  font-family: 'AlibabaRegular';
  letter-spacing: 0em;
  color: #333;
  img {
    // width: 29px;
    // margin-right: 20px;
  }
}

.iframe-container {
  overflow: hidden;
  position: relative;
}
.loading {
  animation: iframeLoad 1.5s linear infinite;
  border-radius: 5px;
  content: '';
  height: 10px;
  left: 50%;
  position: absolute;
  top: calc(50% - 20px);
  transform: translateX(-50%) translateY(-50%);
  width: 10px;
}
.iframe-container iframe {
  animation-duration: 1s;
  animation-fill-mode: forwards;
  position: absolute;
  width: 100%;
}

@keyframes slideOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes iframeLoad {
  0% {
    box-shadow:
      -16px 20px 0 -5px #b89dfe,
      0 20px 0 0 #2e6ee7,
      16px 20px 0 2px #b89dfe;
  }

  25% {
    box-shadow:
      -16px 20px 0 0 #b89dfe,
      0 20px 0 2px #2e6ee7,
      16px 20px 0 0 #b89dfe;
  }
  50% {
    box-shadow:
      -16px 20px 0 2px #b89dfe,
      0 20px 0 0 #2e6ee7,
      16px 20px 0 -5px #b89dfe;
  }
  75% {
    box-shadow:
      -16px 20px 0 0 #b89dfe,
      0 20px 0 -5px #2e6ee7,
      16px 20px 0 0 #b89dfe;
  }
  100% {
    box-shadow:
      -16px 20px 0 -5px #b89dfe,
      0 20px 0 0 #2e6ee7,
      16px 20px 0 2px #b89dfe;
  }
}
</style>
