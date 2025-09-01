<template>
  <div>
    <!-- <div class="reply-box-title" v-if="reply.title">
      <img src="@/assets/imgs/chat/titleIcon.png" alt="" />
      <span v-if="typedTitle !== ''" v-html="typedTitle"></span>
    </div> -->
    <div class="common-text-content font0 alibaba-light" :class="{ 'dark-theme': isDarkTheme }">
      <div class="common-text font-size-16px" v-if="typedText !== ''">
        <span v-html="typedText"></span>
        <img
          v-if="textLoading"
          src="@/assets/imgs/chat/textLoading.png"
          style="width: 14px; height: 14px; margin-left: 4px"
        />
      </div>
      <div class="ul-text" v-if="showUl">
        <ul>
          <li v-for="(e, index) in typedUlDataList" :key="index">
            <span class="opacity9" v-html="e"></span>
            <img
              v-if="ulLoading[index]"
              src="@/assets/imgs/chat/textLoading.png"
              style="width: 14px; height: 14px; margin-left: 4px"
            />
          </li>
        </ul>
      </div>
    </div>
    <img
      v-if="showChartLoading"
      src="@/assets/imgs/chat/textLoading.png"
      style="width: 14px; height: 14px; margin-left: 4px"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, inject, computed, onUpdated, Ref, nextTick } from 'vue'

const props = defineProps<{
  reply: any
}>()

// 尝试从父组件注入主题状态
const isDarkTheme = inject('isDarkTheme', ref(false))

const textLoading = ref(true)
const ulLoading = ref([])
ulLoading.value = props.reply?.ulDataList?.map(() => true) || []
const showChartLoading = ref(false)
const typedTitle = ref('')
const typedText = ref('')
const showUl = ref(false)
const typedUlDataList = ref([])
const typingInterval = 50
/* const typingInterval = computed(() => {
  const timestamp = new Date().getTime()
  return Math.floor((timestamp % 1000) / 10) % 50
}) */
const ulDelay = 200 // 列表项延迟显示的时间
// const openingState = inject('openingState') as Ref<boolean>
const startTyping = () => {
  typeTitle()
}

/**
 * 模拟打字效果来显示标题
 * 该函数会逐渐显示传入的标题，模仿打字的效果
 */
const typeTitle = () => {
  // 获取标题，如果不存在则使用空字符串
  const title = props.reply.title || ''
  // 初始化索引，用于遍历标题中的字符
  let index = 0
  // 设置一个定时器，用于逐步显示标题
  const titleIntervalId = setInterval(() => {
    // 如果索引小于标题长度，则追加当前字符到typedTitle，并增加索引
    if (index < title.length) {
      typedTitle.value += title.charAt(index)
      index++
    } else {
      // 否则，清除定时器，并在一段时间后调用typeText函数
      clearInterval(titleIntervalId)
      if (props.reply.text) {
        setTimeout(typeText, ulDelay)
      } else if (props.reply.ulDataList) {
        setTimeout(typeUlDataList, ulDelay)
      } else {
        showChartLoading.value = true
        // setTimeout(() => {
        showChartLoading.value = false
        showChart.value = true
        // }, 500)
      }
    }
  }, typingInterval)
}
import { useEventBus } from '@/hooks/event/useEventBus'
const { emit, on } = useEventBus()
/**
 * 模拟打字效果输入文本的函数
 *
 * 该函数用于逐步显示props中reply对象的text属性值，模拟打字效果
 * 它通过间隔指定时间逐渐增加显示的文本，直到全部显示完毕
 * 显示完毕后，它会在指定的延迟后调用另一个函数来处理ul数据列表
 */
const typeText = async () => {
  // 获取需要显示的文本内容
  const text = props.reply.text
  if (props.reply.initType) {
    typedText.value = text
    textLoading.value = false
    return
  }
  /* 对打开url的单独处理 */
  if (props.reply.pageUrl) {
    typedText.value = props.reply.text
    textLoading.value = false
    await nextTick()
    const openUrlPageElement = document.getElementById(`${props.reply.id}`) as HTMLElement
    if (openUrlPageElement) {
      openUrlPageElement.onclick = () => {
        emit('openShowUrlPage', {
          url: props.reply.pageUrl,
          title: props.reply.pageTitle,
          id: props.reply.id
        })
      }
    }
    return
  }

  // 初始化当前显示文本的索引
  let index = 0
  // 设置一个定时器，用于逐步显示文本
  const textIntervalId = setInterval(() => {
    // 如果当前索引小于文本长度，则取当前索引对应的字符并追加到显示的文本中
    if (index < text.length) {
      typedText.value += text.charAt(index)
      index++
    } else {
      textLoading.value = false
      // 如果当前索引等于文本长度，说明文本已全部显示完毕，清除定时器
      clearInterval(textIntervalId)
      // 在指定的延迟后调用typeUlDataList函数处理ul数据列表
      setTimeout(typeUlDataList, ulDelay)
    }
  }, typingInterval)
}
/**
 * 根据回复数据中的ulDataList数组决定是否显示无序列表（ul）以及初始化打字效果
 *
 * 当reply对象中的ulDataList数组存在且不为空时，设置showUl为true以显示ul组件，
 * 并清空typedUlDataList以准备进行新的打字动画
 * 否则，设置showUl为false，隐藏ul组件
 */
const typeUlDataList = () => {
  if (props.reply.ulDataList && props.reply.ulDataList.length) {
    showUl.value = true
    typedUlDataList.value = []
    nextLiItem(0)
  } else {
    showUl.value = false
    showChartLoading.value = true
    // setTimeout(() => {
    showChartLoading.value = false
    showChart.value = true
    // }, 500)
  }
}
/**
 * 显示下一个<li>项的数据
 * 该函数用于逐步显示列表数据，通过递归调用自身来实现延时显示的效果
 * @param {number} index 当前处理的列表项索引
 */
const nextLiItem = (index) => {
  // 检查当前索引是否在数据列表长度范围内
  if (index < props.reply.ulDataList.length) {
    // 获取当前索引下的列表项数据
    const item = props.reply.ulDataList[index]
    // 向typedUlDataList中添加一个空字符串，用于初始化列表项的数据
    typedUlDataList.value.push('')
    // 递归调用graduallyText函数来逐步显示列表项中的文本
    graduallyText(index, item, 0)
  } else {
    // 当所有列表项数据处理完毕后，设置showChart为true，表示可以显示图表
    showChartLoading.value = true
    // setTimeout(() => {
    showChartLoading.value = false
    showChart.value = true
    // }, 500)
  }
}
/**
 * 逐行渐进地显示文本的函数
 *
 * 该函数通过递归调用自身，逐步增加字符到指定的列表项中，从而实现文本的渐进显示效果
 * 当一个文本显示完毕后，它会等待一段时间，然后调用nextLiItem函数显示下一个列表项
 *
 * @param {number} listIndex 当前处理的列表项索引
 * @param {string} text 需要显示的文本内容
 * @param {number} charIndex 当前文本中待显示的字符索引
 */
const graduallyText = (listIndex, text, charIndex) => {
  if (charIndex < text.length) {
    // 将当前字符添加到指定的列表项文本中
    typedUlDataList.value[listIndex] += text[charIndex]
    // 设置定时器，用于递归调用自身显示下一个字符
    setTimeout(() => {
      graduallyText(listIndex, text, charIndex + 1)
    }, typingInterval) // 每隔50毫秒显示一个字符
  } else {
    ulLoading.value[listIndex] = false
    // 当所有字符显示完毕后，设置定时器，用于调用nextLiItem函数显示下一个列表项
    setTimeout(() => {
      nextLiItem(listIndex + 1)
    }, 50) // 每隔100毫秒显示下一行
  }
}

const showChart = inject<Ref<boolean>>('showChart')
const scrollToBottom = inject('scrollToBottom', () => {})
onMounted(async () => {
  startTyping()
})
onUpdated(scrollToBottom)
</script>
<style lang="less" scoped>
ul {
  margin-bottom: 0;
  margin-top: 10px;
}
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
  padding: 0 30px;
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
      font-size: 16px;
      line-height: 32px;
    }

    .opacity9 {
      opacity: 0.9;
    }
  }
}

// 暗色主题样式
.common-text-content.dark-theme {
  color: #fff;

  .reply-box-title {
    color: #fff;
  }
}
</style>
