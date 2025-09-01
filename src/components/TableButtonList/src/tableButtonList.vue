<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { permissionList } from '@/utils/actPermission'

// 定义按钮项类型
interface ButtonItem {
  label: string
  icon?: string
  code: string
  disabled?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  callback?: (clickRow) => void
  popconfirm?: boolean
  popconfirmProps?: {
    title: string
    placement?: string
    width?: number
  }
  onConfirm?: (clickRow) => void
}

const props = defineProps<{
  list: ButtonItem[]
  row: {}
}>()

const splitNum = ref(2)
const newList = ref<ButtonItem[]>([])

onMounted(() => {
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    newList.value = props.list
  } else {
    newList.value = props.list.filter((item) => permissionList.includes(item.code))
  }
})

const moreCode = () => {
  if (newList.value.length > splitNum.value) {
    return newList.value.slice(splitNum.value).map((item) => item.code)
  }
  return []
}
</script>

<template>
  <div class="button-list">
    <!-- 主要按钮列表 -->
    <template v-for="item in newList.slice(0, splitNum)" :key="item.label">
      <el-button
        v-if="!item.popconfirm"
        :disabled="item.disabled"
        link
        :type="item.type || 'primary'"
        @click.stop="item.callback?.(row)"
      >
        <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
        {{ item.label }}
      </el-button>

      <el-popconfirm
        v-else
        v-bind="item.popconfirmProps"
        @confirm="item.onConfirm ? item.onConfirm(row) : item.callback?.(row)"
      >
        <template #reference>
          <el-button @click.stop.prevent="() => {}" link :type="item.type || 'primary'">
            <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
            {{ item.label }}
          </el-button>
        </template>
      </el-popconfirm>
    </template>

    <!-- 下拉菜单展示更多按钮 -->
    <el-dropdown :hide-on-click="false" trigger="click" v-if="newList.length > splitNum + 1">
      <el-button type="primary" @click.stop.prevent="() => {}" link class="max-w-100px">
        <Icon icon="svg-icon:table-more" :size="18" class="m-3px" />
        更多
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in newList.slice(splitNum)"
            :key="item.label"
            class="relative"
            @click.stop="item.callback?.(row)"
          >
            <el-button
              v-if="!item.popconfirm"
              link
              :type="item.type || 'primary'"
              @click.stop="item.callback?.(row)"
            >
              <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
              {{ item.label }}
            </el-button>

            <el-popconfirm
              v-else
              width="200"
              v-bind="item.popconfirmProps"
              @confirm="item.onConfirm ? item.onConfirm(row) : item.callback?.(row)"
            >
              <template #reference>
                <el-button link :type="item.type || 'primary'">
                  <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
                  {{ item.label }}
                </el-button>
              </template>
            </el-popconfirm>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 剩余按钮直接展示 -->
    <template v-else>
      <!-- <el-button
        v-for="item in newList.slice(splitNum)"
        :key="item.label"
        :disabled="item.disabled"
        link
        :type="item.type || 'primary'"
        @click="item.callback?.()"
        
      >
    <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
        {{ item.label }}
      </el-button> -->
      <div v-for="item in newList.slice(splitNum)" :key="item.label">
        <el-button
          v-if="!item.popconfirm"
          :disabled="item.disabled"
          link
          :type="item.type || 'primary'"
          @click.stop="item.callback?.(row)"
        >
          <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
          {{ item.label }}
        </el-button>

        <el-popconfirm
          v-else
          v-bind="item.popconfirmProps"
          @confirm="item.onConfirm ? item.onConfirm(row) : item.callback?.(row)"
        >
          <template #reference>
            <el-button link :type="item.type || 'primary'" @click.stop>
              <Icon v-if="item.icon" :icon="item.icon" :size="18" class="m-3px" />
              {{ item.label }}
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
  </div>
</template>

<style scoped>
.button-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.el-dropdown {
  /* margin-left: 12px; */
}

.el-button:focus-visible {
  outline: unset;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
