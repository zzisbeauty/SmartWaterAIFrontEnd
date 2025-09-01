<script setup lang="tsx">
import { handleGetTreeList } from './IndexApi'
import permissionCode from '@/utils/permissionCode'
/**
 * 左侧树形数据
 */

interface Tree {
  assortName: string
  id: string
  child?: Tree[]
}

const props = defineProps<{
  modelValue: string
}>()

// 获取图片地址
const importUrl = (url: string) => {
  return new URL(`/src/assets/imgs/img/${url}.png`, import.meta.url).href
}

// 获取图片
const getImgSrc = (level, isLeaf) => {
  return level === 1
    ? importUrl('api-tree-pnode')
    : isLeaf
      ? importUrl('api-tree-node')
      : importUrl('api-tree-pnode')
}

// 树形数据配置
const defaultProps = {
  children: 'child',
  label: 'assortName'
}

//监听点击事件
const handleNodeClick = (data: Tree) => {
  currentNodeKey.value = data.id
  console.log(data.id, '////////////')
  emit('change', data)
}

//按钮事件
const btnAction = (actionType) => {
  switch (actionType) {
    case '刷新':
      getTreeData()
      break
    case '展开':
      setExpandAll()
      break
  }
}

/**
 * 展开折叠
 */

const expandAll = ref(false)
const showTreeNode = ref(true)
const setExpandAll = () => {
  showTreeNode.value = false
  expandAll.value = !expandAll.value
  nextTick(() => {
    showTreeNode.value = true
  })
}

const defaultExpandedKeys = ['-1'] //默认展开
// 筛选
const treeRef = ref()
const filterText = ref('')
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.assortName.includes(value)
}
import { useVModel } from '@vueuse/core'
//导出currentNodeKey
const emit = defineEmits(['update:modelValue', 'change'])
const currentNodeKey = useVModel(props, 'modelValue', emit)

//获取分类数据
const dataList = ref<Tree[]>([])
const loading = ref(false)
const getTreeData = async () => {
  loading.value = true
  const data = await handleGetTreeList().finally(() => {
    loading.value = false
  })
  dataList.value = [
    {
      assortName: '全部分类',
      id: '-1',
      child: data
    }
  ]

  if (data.length) {
    nextTick(() => {
      handleNodeClick(dataList.value[0])
      treeRef.value.setCurrentKey(dataList.value[0])
    })
  }
}

onMounted(() => {
  getTreeData()
})
</script>

<template>
  <div class="flex flex-col h-100% bg-#fff">
    <div
      class="w-100% h-50px flex items-center justify-between px-16px box-border"
      style="border-bottom: 1px solid #e9e9e9"
    >
      <span class="text-16px font-bold text-#333">API分类</span>
      <el-space>
        <Icon
          @click="btnAction('刷新')"
          icon="ant-design:sync-outlined"
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
        />
        <Icon
          @click="btnAction('展开')"
          v-if="!expandAll"
          icon="lucide:list-collapse"
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
        />
        <Icon
          @click="btnAction('展开')"
          v-else
          icon="mingcute:list-collapse-line"
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
        />
      </el-space>
    </div>
    <div class="w-100% p-14px box-border">
      <el-input v-model="filterText" clearable placeholder="搜索">
        <template #suffix>
          <Icon class="cursor-pointer" icon="ep:search" color="#000000a6" />
        </template>
      </el-input>
    </div>

    <div class="flex-1 w-100% relative" v-if="showTreeNode">
      <div class="absolute inset-0 overflow-hidden">
        <ElScrollbar class="px-14px box-border">
          <el-tree
            ref="treeRef"
            v-loading="loading"
            :filter-node-method="filterNode"
            :data="dataList"
            node-key="id"
            :props="defaultProps"
            :default-expand-all="expandAll"
            :current-node-key="currentNodeKey"
            :default-expanded-keys="defaultExpandedKeys"
            highlight-current
            @node-click="handleNodeClick"
            @node-expand="expandAll = true"
            check-on-click-node
            :expand-on-click-node="false"
          >
            <template #default="{ node }">
              <div class="custom-tree-node">
                <img :src="getImgSrc(node.level, node.isLeaf)" alt="" />
                <span>{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </ElScrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.text-line-1 {
  display: -webkit-box;
  word-break: break-all;
  /*超出文字用省略号代替*/
  text-overflow: ellipsis;
  /*竖直方向的超出和隐藏*/
  -webkit-box-orient: vertical;
  /*设定行数为2*/
  -webkit-line-clamp: 1;
  /*多出部分隐藏*/
  overflow: hidden;
}

:deep(.el-tree-node) {
  padding: 3px 0;
  .el-tree-node__expand-icon {
    color: #333 !important;
  }
}

:deep(.is-current) {
  & > .el-tree-node__content {
    background-color: var(--el-color-primary-light-8) !important;
  }
}

.custom-tree-node {
  display: flex;
  align-items: center;
  height: 100%;

  img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }

  span {
    font-size: 14px;
    color: #333;
    line-height: 26px;
    .text-line-1;
  }
}
</style>
