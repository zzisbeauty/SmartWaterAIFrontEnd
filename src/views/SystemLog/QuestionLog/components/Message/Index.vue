<template>
  <div class="body">
    <div class="mainMsg">
      <div class="container">
        <div class="contentMsg">
          <div class="chat" ref="chatRef">
            <div v-for="item in msgList" :key="item.id" :class="getMessageClass(item.type)">
              <template v-if="item.type === '0'">
                <img
                  src="@/assets/imgs/dialogueRecord/AIAvatar.png"
                  alt=""
                  class="avatar m-r-20px"
                />
                <div class="msgBox">
                  <div class="msg" v-if="item.id">
                    <ReplyBox :reply="item.message" />
                  </div>
                  <!-- <div v-if="item.id" class="msg-Tips" :style="{ width: getTipsWidth(item) }">
                    <img
                      style="height: 32px; width: 24px; object-fit: contain"
                      src="@/assets/imgs/chat/msgTipsIcon.png"
                      alt=""
                    />
                    <span class="msg-Tips__text">{{ item.id }}</span>
                  </div> -->
                </div>
              </template>
              <template v-if="item.type === '1'">
                <div class="msg">
                  <!-- <div>{{ item.message.content.text }}</div> -->
                  <AskBox :ask="item.message"/>
                </div>
                <img
                  src="@/assets/imgs/dialogueRecord/userAvatar.png"
                  alt=""
                  class="avatar m-l-20px"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="openUrlPage" mode="out-in">
      <div v-if="showUrlPage.show" class="url-page">
        <commonUrlPage :replyContent="showUrlPage" @close-urlPage="closeUrlPage" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive, onMounted, nextTick, provide, inject, onUpdated, Ref } from 'vue'
import ReplyBox from './ReplyBox.vue'
import AskBox from './AskBox.vue'
// 页面盒子
import commonUrlPage from './replyComponent/commonUrlPage.vue'
import { useEventBus } from '@/hooks/event/useEventBus'
const { emit, on } = useEventBus()
import { v4 as uuidV4 } from 'uuid'
// 创建一个响应式的空数组，用于存储聊天消息
const msgList: any = reactive([
  {
    message: {
      type: 'text',
      content: {
        text: '请问如何退水费？',
        initType: true
      },
      info: {
        time: Date.now(),
        tokens: 15
      }
    },
    type: '1',
    id: Date.now()
  },
  {
    message: {
      type: 'text',
      content: {
        text: '您好!关于退水费流程，我来为您详细说明:<br><br>1.首先登录您的账户，进入"我的水费"页面<br>2.点击"申请退费"按钮<br>3.选择退费原因，并上传照片<br>4.填写退费说明，确认退费信息<br>5.等待客服审核，审核通过后您将收到退款<br><br>如果您在操作过程中遇到任何问题，都可以随时询问我。',
        initType: true
      },
      info: {
        time: Date.now(),
        tokens: 231,
        responseTime: 3210
      }
    },
    type: '0',
    id: Date.now()
  }
])
// 创建一个引用类型变量，用于在模板中访问聊天框的 DOM 元素
const chatRef = ref(null)
// 创建一个url页面专属接收回复的参数
const showUrlPage: any = reactive({
  show: false
})
/**
 * 添加用户提问到消息列表
 * @param {string} question - 用户的提问内容
 */
const userQuestion = (question) => {
  const userMsg = {
    message: { type: 'text', content: { text: question } },
    type: '1',
    id: Date.now()
  }
  msgList.push(userMsg)
  msgList.push({
    message: { type: 'await', content: {} },
    type: '0',
    id: Date.now()
  })
  // closeUrlPage()
  scrollToBottom()
}

import { useUserStore } from '@/store/modules/user'
import { promises } from 'node:dns'
import { time } from 'node:console'
const userStore = useUserStore()
// const userInfo: any = userStore.getUserInfo
/**
 * 添加 AI 回复到消息列表
 * @param {string} reply - AI 的回复内容
 * type {string} - 消息类型 0:纯文本 1:图表 2:文字+图表 3:表格 4:文字+表格 5:页面链接
 */
const AIReply = (reply, option, type) => {
  const id = uuidV4().replace(/-/g, '')
  let params: any = {
    id: id,
    ulDataList: reply?.textData,
    options: option?.options,
    text: reply?.text,
    speechText: reply?.speechText,
    title: reply?.title
  }
  /* 对打开url 类型的单独处理 */
  if (type === 'url') {
    openShowUrlPage({
      id: id,
      // url: reply.url + `?ticket=${userStore.getTicket}`,
      url: reply.url + `?ticket=${localStorage.getItem('unitaiScreenTicket')}`,
      title: reply.title
    })
    params = {
      id: id,
      type: 'text',
      text: `已为您打开：<strong>${reply.title}</strong> : <span id="${id}" class="color-blue cursor-pointer">${reply.url}</span> `,
      pageTitle: reply.title,
      pageUrl: reply.url
    }
    type = 'text'
  } else {
    closeUrlPage()
  }
  const replyMsg = {
    message: {
      type: type,
      content: params
    },
    type: '0',
    id: Date.now()
  }
  emit('sendToPerson', reply.speechText)
  // msgList.push(replyMsg)
  /* 由于存在等待状态，直接更新 msgList数组的最后一个元素 */
  if (Object.keys(msgList[msgList.length - 1].message.content).length) {
    msgList.push(replyMsg)
  } else {
    msgList[msgList.length - 1] = replyMsg
  }
  // interaction.value = true
}

const openShowUrlPage = (obj) => {
  // setTimeout(() => {
  // 设置showUrlPage对象的show属性为true，以表示页面应显示
  showUrlPage.show = true
  // 设置showUrlPage对象的url属性为传入对象的url值
  showUrlPage.url = obj.url
  // 设置showUrlPage对象的title属性为传入对象的title值
  showUrlPage.title = obj.title
  // 设置showUrlPage对象的id属性为传入对象的id值
  showUrlPage.id = obj.id
  // }, 100)
}
/**
 * 关闭URL页面功能
 * 此函数用于隐藏或关闭当前的URL页面显示
 * 它通过修改showUrlPage对象的show属性来实现这一点
 */
const closeUrlPage = () => {
  showUrlPage.show = false
}
on('openShowUrlPage', openShowUrlPage)
on('closeUrlPage', closeUrlPage)
/**
 * 根据消息类型获取消息的 CSS 类名
 * @param {string} type - 消息类型，'1' 表示用户消息，其他值表示 AI 消息
 * @returns {string} 消息的 CSS 类名
 */
const getMessageClass = (type) => (type === '1' ? 'rightMsg' : 'leftMsg')
/**
 * 根据传入的对象计算并返回提示框的宽度
 *
 * @param {Object} obj - 包含id属性的对象，用于计算提示框的宽度
 * @returns {String} - 提示框的宽度，以像素为单位的字符串
 */
const getTipsWidth = (obj) => {
  // 将对象的id转换为字符串，如果没有id，则默认为空字符串
  const text = obj.id.toString() || ''
  // 根据文本长度计算宽度，每个字符大约占15px，加上固定的空间40px，如果计算结果为0，则默认宽度为200px
  return `${text.length * 10 + 40}px` || '200px'
}
/**
 * 滚动到聊天框的底部
 */
const scrollToBottom = async () => {
  await nextTick()
  if (chatRef.value) {
    chatRef.value.scrollTo({ top: chatRef.value.scrollHeight, behavior: 'smooth' })
  }
}
provide('scrollToBottom', scrollToBottom)
on('scrollToBottom', scrollToBottom)
// 获取模拟数据
const getMonitorJson = async () => {
  const res = await axios.get(new URL('/public/monitorData.json', import.meta.url).href)
  return res.result
}
// 在组件挂载时调用 getMes 函数
onMounted(() => {})
onUpdated(() => {})
defineExpose({
  onSend: (text) => {
    emit('handleInterrupt')
    userQuestion(text)
    /* const JSONData = await getMonitorJson()
    console.log(JSONData, 'JSONData')
    if (JSONData.hasOwnProperty(text)) {
      AIReply({ options: JSONData[text],text:JSONData[text].text}, JSONData[text], 'echarts')
    } else {
      AIReply({
        option: {},
        speechText: '抱歉，我无法理解您的问题。',
        text: '抱歉，我无法理解您的问题。',
        id: Date.now(),
        type: 'text'
      })
    } */
  },
  AIReply
})
</script>

<style scoped lang="less" scope>
.body {
  color: #fff;
  // font-weight: 900;
  letter-spacing: 2px;
  width: 100%;
  height: 100%;
  // background-size: 50%;
  display: flex;
  align-items: center;
  position: relative;
}

.mainMsg {
  width: 100%;
  height: 100%;
  display: flex;
}

.cover {
  position: absolute;
  top: 0px;
  z-index: 0;
  left: 50%;
  margin-left: -754px;
  overflow: hidden;
}

.body {
  :deep(.slick-slide) {
    text-align: center;
    height: 100%;
    line-height: 100%;
    // background: #364d79;
    overflow: hidden;
  }

  :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
  }

  :deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
  }

  :deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    opacity: 0.5;
  }

  :deep(.slick-slide h3) {
    color: #fff;
  }
}

div {
  box-sizing: border-box;
}

.container {
  z-index: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  min-width: 100%;

  .contentMsg {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chat {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      font-family: 'Microsoft Yahei';
      font-size: 16px;
      line-height: 16px;
      letter-spacing: 0em;
      color: #333333;

      .leftMsg,
      .rightMsg {
        display: flex;
        flex-direction: row;
        // justify-content: start;
        // align-items: center;
        margin: 15px 10px;

        img {
          width: 42px;
          height: 42px;
          border-radius: 20px;
          overflow: hidden;
          object-fit: cover;
        }

        .msg {
          display: inline-block;
          padding: 15px 20px;
          word-wrap: anywhere;
          // max-width: 600px;
          background-color: #364d79;
          border-radius: 10px;
          position: relative;
          // line-height: 28px;
          min-height: 40px;
          min-width: 40px;
          line-height: 20px;
        }
      }

      .leftMsg {
        justify-content: flex-start;
        .msgBox {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .msg {
            color: #333333;
            min-width: 680px;
            background-color: #f8f8f8;
            border-radius: 8px;
            // box-shadow: 6px 2px 12px 0px rgba(0, 168, 255, 0.1216);
            // border: 1px solid rgba(0, 168, 255, 0.3216);

            // border-left: none;
            // &::before {
            //   border: 1px solid rgba(0, 168, 255, 0.3216);
            //   border-right: none;
            //   border-bottom: none;
            //   content: '';
            //   position: absolute;
            //   /* left: -9px;
            //   top: calc(50% - 8px);
            //   width: 16px;
            //   height: 16px; */
            //   left: -7px;
            //   top: 15px;
            //   width: 12px;
            //   height: 12px;
            //   transform: rotate(-45deg);
            //   // z-index: -1;
            //   background: #ffffff;
            //   // box-shadow: 0px 3px 12px rgba(0, 168, 255, 0.1216);
            // }
          }
          .msg-Tips {
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0px 3px 12px 0px rgba(0, 168, 255, 0.1216);

            &__text {
              font-family: Microsoft YaHei;
              font-size: 14px;
              font-weight: normal;
              line-height: 14px;
              letter-spacing: 0em;
              color: #333333;
              white-space: nowrap;
            }
          }
        }
      }

      .rightMsg {
        justify-content: flex-end;

        .msg {
          color: #333333;
          // background: linear-gradient(90deg, #50acff 0%, #005dff 100%);
          background-color: #eff7ff;
          border-radius: 13px;
          min-width: 450px;
          // &::before {
          //   content: '';
          //   position: absolute;
          //   /* right: -6px;
          //   top: calc(50% - 8px);
          //   width: 16px;
          //   height: 16px; */
          //   right: -5px;
          //   top: 15px;
          //   width: 12px;
          //   height: 12px;
          //   transform: rotate(-45deg);
          //   z-index: -1;
          //   background: #005dff;
          //   box-shadow: 0px 3px 12px rgba(0, 168, 255, 0.1216);
          // }
        }
      }
    }
  }
}

.chat {
  &::-webkit-scrollbar {
    width: 3px !important;
    transition: 0.25s;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: rgb(224, 226, 235);
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0px;
    background-color: rgba(224, 226, 235, 0);
  }
}

.separator {
  color: rgb(133, 132, 132);
  text-align: center;
  font-size: 15px;
  font-weight: normal;
}

.url-page {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 99999;
  background: #fff;
  border-radius: 5px;
}
/* 定义过渡动画的样式 */
.openUrlPage-enter-active {
  transition: all 1s ease;
  transform-origin: center; /* 设置变换原点为元素的中心 */
}
.openUrlPage-leave-active {
  transition: all 1s ease;
  transform-origin: center; /* 设置变换原点为元素的中心 */
}

.openUrlPage-enter-from,
.openUrlPage-leave-to {
  opacity: 0;
  transform: scale(0); /* 从中心点缩放到0 */
}

.openUrlPage-enter-to,
.openUrlPage-leave-from {
  opacity: 1;
  transform: scale(1); /* 缩放到正常大小 */
}
</style>
