<script setup lang="tsx">
import { reactive, onMounted, ref, unref, nextTick, watch } from 'vue'
import { getTreeData, handleDelete } from './leftTreeApi'
import Edit from './leftEdit.vue'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessageBox, ElScrollbar } from 'element-plus'
import { debounce } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
const { t } = useI18n()
onMounted(() => {
  getList()
})
const props = defineProps({
  mode: {
    type: String
  },
  title: {
    type: String,
    default: '目录'
  }
})
const emit = defineEmits('tabChange')
interface Item {
  id: string
  monitorId_dictText: string
  [key: string]: any
}
const activeItemId = ref<string>('')
const ListData = ref<Item[]>([])
const getList = async () => {
  const res: any = await getTreeData({ parentId: 0, mode: props.mode })
  ListData.value = res.result
}

// 弹框相关
const dialogTitle = ref('')
const dialogVisible = ref(false)
const edit = ref()
const openDialog = () => {
  dialogVisible.value = true
}
const closeDialog = () => {
  dialogVisible.value = false
}
const btnAction = (row, title) => {
  // 根据类型分配弹框
  if (title === '新增') {
    addDialog(
      {
        parentId: row.id
      },
      title
    )
  } else if (title === '编辑') {
    editDialog(row, title)
  }
}
// 添加
const addDialog = (row, title) => {
  openDialog()
  dialogTitle.value = title
  nextTick(() => {
    // 时填装弹框数据
    edit.value.feedBackDataAdd(row)
  })
}
// 编辑
const editDialog = (row, title) => {
  openDialog()
  dialogTitle.value = title
  nextTick(() => {
    edit.value.feedBackData(row)
  })
}
const doDelete = (id) => {
  ElMessageBox.confirm('是否确认删除？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleDelete({ id: id }).then((res: any) => {
        if (res.success) {
          getList()
          useMessage('success', res.message)
        } else {
          useMessage('error', '删除失败')
        }
      })
    })
    .catch(() => {})
}
const defaultProps = {
  children: 'childTree',
  label: 'name'
}
function mouseenter(data) {
  data.show = true
}
function mouseleave(data) {
  data.show = false
}
const dialogConfirm = debounce(async () => {
  // 拿到编辑弹框示例并执行提交函数
  const res = await edit.value.submit()
  if (res === undefined) {
    return
  } else {
    if (res) {
      useMessage('success', res)
      closeDialog()
      getList()
    } else {
      useMessage('error', '操作失败')
    }
  }
}, 200)

const checkedKey = ref('')
const handleNodeClick = (data, item) => {
  checkedKey.value = data.id
  if (data.childTree.length == 0) {
    // 刷新右侧列表
    emit('tabChange', data.id)
  }
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
defineExpose({})
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
  <div class="h-[calc(100%-2px)] border border-solid border-#e4e7ed border-rd-4px">
    <div class="flex justify-between h-60px line-height-60px p-x-20px">
      <div class="font-bold color-#333 circle">{{ title }}</div>
      <div>
        <Icon
          @click="resetData"
          icon="ant-design:sync-outlined"
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
        />
        <Icon
          class="cursor-pointer m-r-10px"
          hover-color="var(--el-color-primary)"
          icon="ph:plus"
          @click="btnAction({ parentId: 0 }, '新增')"
        />
      </div>
    </div>
    <div class="h-[calc(100%-60px)]">
          <div class="w-90% left-5% relative">
            <el-input
            v-model="filterText"
            class="input-search"
            >
            <template #suffix>
                <Icon class="cursor-pointer" icon="ep:search" color="#000000a6"  />
            </template>
            </el-input>
        </div>
      <div class="h-[calc(100%-60px)] ">
        <el-tree
          :data="ListData"
          default-expand-all
          node-key="id"
          ref="treeRef"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          icon-class="icon-tree"
        >
          <template #default="{ node, data }">
            <div
              class="custom-tree-node items-center"
              @mouseenter="mouseenter(data)"
              @mouseleave="mouseleave(data)"
            >
              <span class="flex items-center">
                <img class="v-middle" :src="getImgSrc(node.level, node.isLeaf)" alt="" />
                <span>{{ data.name }}</span>
              </span>
              <span class="fr">
                <Icon
                  v-show="data.show"
                  class="cursor-pointer m-r-10px"
                  icon="ph:plus"
                  @click.stop="btnAction({ ...data }, '新增')"
                />
                <Icon
                  v-show="data.show"
                  class="cursor-pointer m-r-10px"
                  icon="ph:pencil-simple-line"
                  @click.stop="btnAction({ ...data }, '编辑')"
                />
                <Icon
                  v-show="data.show"
                  class="cursor-pointer"
                  icon="ph:trash-light"
                  @click.stop="doDelete(data.id)"
                />
              </span>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <Dialog
      :maxWidth="dialogTitle !== '详情' ? 520 : 520"
      maxHeight="auto"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <!-- 弹框根据不同条件分别渲染编辑表单和详情表单 -->
      <Edit ref="edit" :treeData="ListData" :mode="mode" />
      <!-- 弹框右下角按钮部分 -->
      <template #footer>
        <BaseButton v-if="dialogTitle !== '详情'" type="primary" @click="dialogConfirm">
          确定
        </BaseButton>
        <BaseButton @click="closeDialog">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="less">
@import url(./tree.less);
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
  background-color: #c8e2fe;
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
