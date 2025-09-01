<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStore } from '@/store/modules/user'
import { useDark } from '@vueuse/core'
import { useEventBus } from '@/hooks/event/useEventBus'
import { setThemeFun } from '@/utils/setFun'
const emitters = useEventBus().emit
const userStore = useUserStore()
const appStore = useAppStore()
let messageHandler: (event: MessageEvent) => void

onMounted(() => {
  //   if (!userStore.getUserInfo) {
  messageHandler = (event) => {
    // 检查消息来源是否可信
    if (event.origin !== import.meta.env.VITE_ORIGIN_URL) {
      return
    }
    try {
      const data = JSON.parse(event.data)
      // 设置个人信息
      if (!userStore.getUserInfo && data.action == 'setUserInfo') {
        userStore.setUserInfo(data.val)
      } else if (data.action == 'setTheme') {
        console.log('setTheme')
        const { setSystemTheme } = setThemeFun()

        // appStore.setTheme(data.val)
        // emitters('setTheme', data.val)
        setSystemTheme(data.val)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }
  window.addEventListener('message', messageHandler)
  //   }
})

onUnmounted(() => {
  if (messageHandler) {
    window.removeEventListener('message', messageHandler)
  }
})
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const isDark = useDark({
  valueDark: 'light',
  valueLight: 'light'
})

isDark.value = appStore.getIsDark
// ElNotification({
//   title: '提示',
//   type: 'warning',
//   duration: 0,
//   dangerouslyUseHTMLString: true,
//   message:
//     '<div><p><strong>遇事不决，请先查阅常见问题，说不定你能找到相关解答</strong></p><p><a href="https://element-plus-admin-doc.cn/guide/fqa.html" target="_blank">链接地址</a></p></div>'
// })
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
