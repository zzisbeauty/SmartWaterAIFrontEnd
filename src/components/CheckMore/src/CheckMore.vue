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
  },
  islink: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <ElDropdown  class="ml-12px">
    <ElButton v-actPermission="list.code" type="primary" :link="islink">更多</ElButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in list.list" :key="item.lable" @click="item.callback()">
          <span v-actPermission="item.code">
            {{ item.label }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </ElDropdown>
</template>
<style scoped>
.el-button:focus-visible{
    outline: unset;
}
</style>