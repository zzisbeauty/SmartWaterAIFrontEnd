<template>
  <el-collapse-item :title="item.titleEn" :name="item.name">
    <template #title>
      <div class="flex items-center title">
        <span class="text-14px font-bold">{{ item.titleZn }}</span>
      </div>
    </template>
    <template #icon>
      <div class="flex items-center collapse-icon">
        <el-button type="text"
          >{{ isCurrentActive ? '收起' : '展开' }}
          <Icon
            icon="ooui:double-chevron-start-rtl"
            color="var(--el-color-primary)"
            :size="10"
            :style="{
              transform: isCurrentActive ? 'rotateZ(-90deg)' : 'rotateZ(90deg)'
            }"
          />
        </el-button>
      </div>
    </template>
    <slot></slot>
  </el-collapse-item>
</template>
<script setup lang="tsx">
interface ItemProp {
  titleZn: string
  titleEn: string
  name: string | number
  activeNames: (string | number)[]
}

const props = defineProps({
  item: {
    type: Object as PropType<ItemProp>,
    default: () => {
      return {
        titleZn: '',
        titleEn: '',
        name: '',
        activeNames: [] as (string | number)[]
      }
    }
  }
})

const isCurrentActive = computed(() => {
  return props.item.activeNames.includes(props.item.name)
})
</script>
<style lang="less" scoped>
.collapse-icon {
  margin: 0 8px 0 auto;

  :deep(.el-button) {
    font-size: 13px;

    .el-icon {
      transform: rotateZ(90deg);
      margin-left: 4px;
    }
  }
}

.title {
  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background-color: var(--el-color-primary);
    margin-right: 8px;
    border-radius: 2px;
  }
}
</style>
