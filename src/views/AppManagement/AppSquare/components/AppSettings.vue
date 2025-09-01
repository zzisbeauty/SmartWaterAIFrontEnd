<template>
  <div class="application-settings">
    <!-- 左侧菜单 -->
    <el-aside class="appMenu">
      <div
        v-for="item in menuItems"
        :key="item.index"
        class="menu-item"
        :class="{
          'is-active': activeKey === item.index
        }"
        @click="handleMenuItemClick(item)"
      >
        {{ item.title }}
      </div>
    </el-aside>
    <el-scrollbar class="w-100% max-h-100%">
      <!-- 右侧内容区域 -->
      <main class="w-100% h-100% px-20px box-border bg-#F8F8F8">
        <component
          :is="AppCurrentConfig"
          ref="currentConfigRef"
          @change-config="changeConfig"
          v-if="activeKey === '0' && isEdit"
        />
        <component :is="DigitalHumanSetting" ref="digitalHumanRef" v-else-if="activeKey === '1'" />
        <component :is="AsrConfiguration" ref="asrRef" v-else-if="activeKey === '2'" />
        <component :is="ModelConfiguration" ref="modelRef" v-else-if="activeKey === '3'" />
        <component :is="KnowledgeBaseConfig" ref="knowledgeRef" v-else-if="activeKey === '4'" />
        <component :is="ApiConfiguration" ref="apiRef" v-else-if="activeKey === '5'" />
        <component :is="Edit" ref="editRef" v-else-if="activeKey === '6'" />
      </main>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { handleSave, handleEdit, handleGetAppDetail } from '../IndexApi'
import AppCurrentConfig from './AppCurrentConfig.vue'
import DigitalHumanSetting from './DigitalHumanSetting.vue'
import AsrConfiguration from './AsrConfiguration.vue'
import ModelConfiguration from './ModelConfiguration.vue'
import KnowledgeBaseConfig from './KnowledgeBaseConfig.vue'
import ApiConfiguration from './ApiConfiguration.vue'
import Edit from './Edit.vue'
// 编辑还是新增
const isEdit = ref(false)
// 自定义菜单配置
const menuItems = ref([])

interface allConfigItem {
  digitalHumanServiceConfig: any
  asrServiceConfig: any
  largeModelInfo: any
  ragInfoList: any
  apiInfoList: any
}

const initialConfig = {
  digitalHumanServiceConfig: [],
  asrServiceConfig: [],
  largeModelInfo: [],
  ragInfoList: [],
  apiInfoList: []
}

// 定义 allConfig 响应式对象
const allConfig = reactive<allConfigItem>({ ...initialConfig })
// 提供给后代组件
provide('allConfig', allConfig)
// 各个子组件的 ref
const currentConfigRef = ref()
const digitalHumanRef = ref()
const asrRef = ref()
const modelRef = ref()
const knowledgeRef = ref()
const apiRef = ref()
const editRef = ref()
// 替代el-menu的验证逻辑
const handleMenuItemClick = async (item) => {
  // const compRefs = [ digitalHumanRef, asrRef, modelRef, knowledgeRef, apiRef,editRef]
  // 特殊验证逻辑：基础信息未保存时阻止跳转
  if (activeKey.value === '6' && !(await editRef.value?.submit())) {
    useMessage('error', '请先填写基础信息')
    return
  }
  activeKey.value = item.index
}
// 获取所有配置，确定提交
const confirmAll = async () => {
  try {
    const res = isEdit.value ? await handleEdit(allConfig) : await handleSave(allConfig)
    if (res.success) {
      useMessage('success', res.message || '操作成功')
      return true
    } else {
      useMessage('error', res.message || '操作失败')
      return false
    }
  } catch (error) {
    // 统一错误处理
    console.error('提交失败:', error)
    useMessage('error', '提交过程中发生错误')
  } finally {
  }
}

// 默认打开的菜单和组件
const activeKey = ref('0')
// 当前配置页快速跳转菜单
const changeConfig = (key) => {
  handleMenuItemClick({ index: key })
}

// 弹窗打开时执行初始化
const feedBackData = async (row: any = {}) => {
  isEdit.value = !!row?.id
  activeKey.value = isEdit.value ? '0' : '6'
  if (isEdit.value) {
    menuItems.value = [
      { index: '0', title: '当前配置', visible: isEdit },
      { index: '6', title: '基础信息' },
      { index: '1', title: '数字人配置' },
      { index: '2', title: 'ASR配置' },
      { index: '3', title: '模型配置' },
      { index: '4', title: '知识库配置' },
      { index: '5', title: 'API配置' }
    ]
    // 编辑时处理数据
    if (isEdit.value) {
      /* // 过滤 row 中仅保留 allConfig 支持的字段
      const filteredRow = Object.keys(allConfig).reduce((acc, key) => {
        if (row[key] !== undefined) {
          acc[key] = unref(row[key])
        }
        return acc
      }, {} as Partial<allConfigItem>)
      // 特殊处理 applicationInfo 字段
      filteredRow.applicationInfo = {
        id: row.id,
        applicationName: row.applicationName,
        applicationCode: row.applicationCode,
        applicationDesc: row.applicationDesc,
        helpLink: row.helpLink,
        fileId: row.fileId,
        iconUrl: row.iconUrl
      }
      // 合并到 allConfig
      Object.assign(allConfig, filteredRow) */
      // const res: any = await handleGetAppDetail({ id: row.id })
      Object.assign(allConfig, row)
    }
  } else {
    menuItems.value = [
      { index: '6', title: '基础信息' },
      { index: '1', title: '数字人配置' },
      { index: '2', title: 'ASR配置' },
      { index: '3', title: '模型配置' },
      { index: '4', title: '知识库配置' },
      { index: '5', title: 'API配置' }
    ]
  }
}
onUnmounted(() => {
  activeKey.value = '0'
  Object.assign(allConfig, initialConfig)
})
defineExpose({
  feedBackData,
  confirmAll
})
</script>

<style scoped>
.application-settings {
  display: flex;
  height: 100%;
  width: 100%;
  background: #f8f8f8;

  .appMenu {
    width: 168px;
    height: 100%;
    padding: 0 10px;
    background-color: #ffffff;

    .el-menu {
      border: 0;

      .el-menu-item {
        height: 36px;
        width: 100%;
        margin: 10px 0;
        border-radius: 4px;

        &:hover {
          background-color: #e6f3ff;
        }
      }

      .is-active {
        color: #2b90fb;
        background: #e6f3ff;
      }
    }
  }

  .el-main {
    padding: 16px;
  }
}
</style>
<style scoped>
div {
  box-sizing: border-box;
}
/* 自定义菜单样式 */
.appMenu {
  width: 168px;
  height: 100%;
  background-color: #ffffff;
}

.menu-item {
  height: 36px;
  padding: 0 20px;
  width: auto;
  margin: 10px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #e6f3ff;
}

.menu-item.is-active {
  color: #2b90fb;
  background: #e6f3ff;
  font-weight: bold;
}
</style>
