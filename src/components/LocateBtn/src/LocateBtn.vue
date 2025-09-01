<script setup lang="tsx">
import { Icon } from '@/components/Icon'
import { useAppStore } from '@/store/modules/app'
import { ref } from 'vue'

const appStore = useAppStore()

const color = ref(appStore.getTheme.elColorPrimary)
</script>

<template>
  <div class="icon-box" :style="{ backgroundColor: color }">
    <Icon icon="tdesign:location" color="#FFFFFF" />
  </div>
</template>

<style scoped lang="less">
.icon-box {
  position: absolute;
  right: 0;
  width: 48px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: pointer;
}
</style>
