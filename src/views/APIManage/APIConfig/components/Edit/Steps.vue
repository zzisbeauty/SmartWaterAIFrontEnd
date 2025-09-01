<script setup lang="tsx">
import { computed } from 'vue'
// 1. 定义选项类型
interface StepOption {
  value: string | number;
  label: string;
}
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as PropType<StepOption[]>,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'change'])

const step = computed(() => {
  return props.options.findIndex((i: any) => i.value === props.modelValue)
})

const change = (item) => {
  if (props.readonly) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
}
</script>

<template>
  <div class="w-100% px-120px box-border mt-30px flex">
    <div
      class="step-container"
      @click="change(item)"
      :class="{
        left: index === 0,
        right: index === props.options.length - 1,
        over: index < step,
        choose: modelValue === item.value
      }"
      v-for="(item, index) in props.options"
      :key="index"
    >
      <div class="step-container-item flex items-center justify-center">
        <span class="text-14px font-bold">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.left {
  &::before {
    display: none;
  }
}
.right {
  &::after {
    display: none;
  }
}
.choose {
  &::before {
    background-color: var(--el-color-primary) !important;
  }
  &::after {
    border-left-color: var(--el-color-primary) !important;
  }
  .step-container-item {
    background-color: var(--el-color-primary) !important;
  }
  span {
    color: #fff;
  }
}
.over {
  &::before {
    background-color: #e6f3ff !important;
  }
  &::after {
    border-left-color: #e6f3ff !important;
  }
  .step-container-item {
    background-color: #e6f3ff !important;
  }
  span {
    color: var(--el-color-primary) !important;
  }
}
.step-container {
  display: flex;
  height: 36px;
  flex: 1;
  cursor: pointer;
  //   max-width: 40%;
  &:hover {
    span {
      transform: scale(1.08);
      transition: all 0.2s;
    }
  }
  .step-container-item {
    background-color: #f5f5f5;
    height: 100%;
    flex: 1;
  }
  &::before {
    content: '';
    width: 0;
    height: 0px;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 18px solid #fff; /* 调整颜色和大小 */
    background-color: #f5f5f5;
  }
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    // border-right: 18px solid transparent;
    border-left: 18px solid #f5f5f5; /* 调整颜色和大小 */
  }
}
</style>
