<script setup lang="ts">
import { ElButton } from 'element-plus'

defineProps({
  list: {
    type: Object,
    default: () => {
      return {
        list: [],
        code: []
      }
    }
  }
})
</script>

<template>
  <ElDropdown v-actPermission="list.code" style="display: contents" class="ml-12px">
    <ElButton type="primary" link>更多</ElButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in list.list" :key="item.lable" @click="item.callback()">
          <span >
            {{ item.label }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </ElDropdown>
</template>
