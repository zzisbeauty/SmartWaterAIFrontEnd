<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog')
})

const slots = useSlots()

const emitters = defineEmits(['update:modelValue','close'])

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const showDialog = ref(false)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      showDialog.value = true
    }
  }
)

onMounted(() => {})
</script>

<template>
  <ElDialog v-bind="getBindValue" fullscreen appendTo="#parent-container" v-if="showDialog">
    <div class="w-100% h-100% bg-#FFFFFF flex flex-col">
      <div
        class="flex w-100% h-44px items-center pr-16px box-border customFull-header"
        style="border-bottom: 1px solid #ebeef5"
      >
        <div
          class="flex items-center px-16px title h-100%"
          @click="emitters('update:modelValue', false),emitters('close')"
        >
          <Icon
            icon="ion:arrow-back-outline"
            class="cursor-pointer m-r-4px"
            color="#333"
            :size="20"
          />
          <span class="text-15px color-#333 font-bold">{{ props.title }}</span>
        </div>
        <div class="flex-1 flex justify-end">
          <slot name="header"></slot>
        </div>
      </div>
      <div class="flex-1 box-border relative fullDialog-content">
        <div class="absolute top-0 left-0 right-0 bottom-0 p-12px">
          <ElScrollbar>
            <slot v-if="props.modelValue"></slot>
          </ElScrollbar>
        </div>
      </div>
    </div>
    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
.title {
  cursor: pointer;
  &:hover {
    i,
    span {
      color: var(--el-color-primary) !important;
    }
  }
}
</style>

<style lang="less">
#parent-container {
  position: relative;
  & > .el-overlay {
    position: absolute;
    & > .el-overlay-dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      & > .el-dialog {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 0;
        & > .el-dialog__header {
          display: none;
        }
        & > .el-dialog__body {
          overflow: auto;
          flex: 1;
          padding: 12px;
          box-sizing: border-box;
          background-color: #f2f5f8;
        }
        & > .el-dialog__footer {
          width: 100%;
          background-color: #fff;
          z-index: 10;
          padding: 10px 10px 10px 0;
          border: none;
          box-shadow: 0px -1px 0px 0px #efefef;
        }
        .el-scrollbar__view {
          height: 100%;
        }
      }
    }
  }
}
</style>
