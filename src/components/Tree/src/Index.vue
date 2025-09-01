<script setup lang="tsx">
import { reactive, onMounted, ref, unref, nextTick, watch } from 'vue'
import { ElButton, ElMessageBox, ElScrollbar } from 'element-plus'
import { debounce } from 'lodash-es'
import { propTypes  } from '@/utils/propTypes'
import { useMessage } from '@/hooks/web/useMessage'
const props = defineProps({
  treeData: propTypes.array.def([]),
  title: propTypes.string.def(''),
  defaultProps:propTypes.object.def({
    children: 'childTree',
    label: 'name'
  })
  ,showFilter:propTypes.bool.def(true),
  nodeKey:propTypes.string.def('id'),
  onlyShow:propTypes.bool.def(false),
  currentNodeKey:propTypes.string.def(''),
  showBorderRadius:propTypes.bool.def(true),
  currentNode:propTypes.object.def({})
})

// const defaultProps = {
//   children: 'childTree',
//   label: 'name'
// }
const emit = defineEmits('tabChange','btnAction')

const btnAction = (actionType) => {
  emit('btnAction', actionType)
}

function mouseenter(data) {
  data.show = true
}
function mouseleave(data) {
  data.show = false
}

const checkedKey = ref('')
const handleNodeClick = (data, item) => {
    console.log(data,item)
  checkedKey.value = data[props.nodeKey]
//   if (data.childTree.length == 0) {
//     // 刷新右侧列表
//   }
    emit('tabChange', {
        node:item
    })
}
const treeRef = ref()
const resetData = () => {
  treeRef.value.setCurrentKey(null, false)
  emit('tabChange', '')
}
const importUrl = (url: string) => {
  return new URL(`/src/assets/imgs/img/${url}.png`, import.meta.url).href
}

const getImgSrc = (level, isLeaf) => {
  return level === 1 ? importUrl('file') : isLeaf ? importUrl('node') : importUrl('file')
}
defineExpose({treeRef})
//
const filterText = ref('')
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

</script>
<template>
  <div class="h-[calc(100%-2px)]   " :class="showBorderRadius?'border-rd-4px border border-solid border-#e4e7ed':''">
    <div class="flex justify-between h-40px line-height-45px p-x-20px" v-if="title!=''">
      <div class="font-bold color-#333 circle">{{ title }}</div>
      <div v-if="!onlyShow">
        <Icon
          @click="btnAction('刷新')"
          icon="ant-design:sync-outlined"
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
        />
        <Icon
            class="cursor-pointer m-r-10px"
            icon="ph:plus"
            hover-color="var(--el-color-primary)"
            @click.stop="btnAction( '新增')"
        />
        <Icon
            class="cursor-pointer m-r-10px"
            hover-color="var(--el-color-primary)"
            icon="ph:pencil-simple-line"
            @click.stop="btnAction( '编辑')"
        />
        <Icon icon="ep:top"   hover-color="var(--el-color-primary)" class="cursor-pointer m-r-10px"  @click.stop="btnAction( '上移')"/>
        <Icon icon="ep:top"   hover-color="var(--el-color-primary)" class="cursor-pointer m-r-10px rotate-180"  @click.stop="btnAction( '下移')"/>
        
        <Icon
            class="cursor-pointer"
            icon="ph:trash-light"
            hover-color="var(--el-color-primary)"
            @click.stop="btnAction( '删除')"
        />
      </div>
    </div>
    <div  :class="title!=''?'h-[calc(100%-60px)]':'h-[calc(100%-15px)]'">
          <div class="w-90% left-5% relative" v-if="showFilter">
            <el-input
                v-model="filterText"
                class="input-search"
                >
                <template #suffix>
                    <Icon class="cursor-pointer" icon="ep:search" color="#000000a6"  />
                </template>
                </el-input>
        </div>
      <div  :class="showFilter?'h-[calc(100%-45px)]':'h-[calc(100%-15px)]'">
        <el-tree
          :data="treeData"
          default-expand-all
          :node-key="nodeKey"
          ref="treeRef"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          icon-class="icon-tree"
          :currentNodeKey="currentNodeKey"
        >
          <template #default="{ node, data }">
            <div
              class="custom-tree-node items-center"
              @mouseenter="mouseenter(data)"
              @mouseleave="mouseleave(data)"
            >
              <span class="flex items-center">
                <img class="w-8px" v-if="node.isLeaf&&node.level !=1" src="@/assets/imgs/node-left.png" alt="" />
                <img class="v-middle" :src="getImgSrc(node.level, node.isLeaf)" alt="" />
                <span>{{ data[defaultProps.label] }}</span>
              </span>
             
            </div>
          </template>
        </el-tree>
      </div>
    </div>
   
  </div>
</template>

<style scoped lang="less">

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
//   :deep(.el-tree-node){
//       &>.el-tree-node__content{
//           height: 34px;
//       }
//       &:focus>.el-tree-node__content{
//           background-color: unset;
//       }
//       &.is-current>.el-tree-node__content{
//           background-color: #c8e2fe;
//           border-right: #2b90fb solid 5px;
//       }
//   }
  :deep(.custom-tree-node) {
    img {
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  :deep(.el-tree-node) > .el-tree-node__content {
    height: 30px;
  }
  :deep(.el-tree-node):focus > .el-tree-node__content {
    background-color: unset;
  }

  :deep(.is-leaf) {
    background-image: none !important;
  }
  :deep(.el-tree){
    // padding:20px 5%;
    background: whitesmoke;
    width: 90%;
    left: 5%;
    margin-top: 10px;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
        width:4px;
        height: 6px;
      }
    
      &::-webkit-scrollbar-track {
        background-color: rgba(241, 241, 241, 0);
      }
    
      &::-webkit-scrollbar-thumb {
        background-color: #c2c1c1;
        border-radius: 6px;
      }
  }

:deep(.el-tree-node__expand-icon) {
  position: relative;
  margin-left: 5px;
  background-image: url('@/assets/imgs/img/add.png');
  width: 16px;
  height: 16px;
  padding: 0;
  display: inline-block;
  background-size: 100% 100%;
  &.expanded {
    background-image: url('@/assets/imgs/img/sub.png');
    transform: rotate(0);
  }
  svg {
    display: none;
  }
}
:deep(.custom-tree-node) {
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
}
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #D6EEFF;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 4px;
    left: 0;
    top: 0;
    background-color: #409eff;
  }
}
.circle {
  position: relative;
  padding-left: 18px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - 4px);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(20, 146, 230, 1);
  }
}
</style>
