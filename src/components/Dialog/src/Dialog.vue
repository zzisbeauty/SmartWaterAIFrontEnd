<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick } from 'vue'
import { isNumber } from '@/utils/is'
import { useEventBus } from '@/hooks/event/useEventBus'

const emitters = useEventBus().emit
const slots = useSlots()

const props = defineProps({
  // 新增控制是否宽高可变
  dynamicWH: propTypes.bool.def(true),
  // 新增是否遮罩
  isMask: propTypes.bool.def(true),
  // 新增是否添加到最外层body元素
  isAappendToBody: propTypes.bool.def(false),
  // 新增是否默认全屏
  isDefaultFull: propTypes.bool.def(false),
  // 新增自定义宽度
  maxWidth: propTypes.oneOfType([String, Number]).def('auto'),

  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def('400px'),
  headerSlot: propTypes.bool.def(false),
  headerClass: propTypes.string.def(''),
  // 弹窗内容padding
  padding: propTypes.oneOfType([String, Number]).def('15px')
})

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

// const isFullscreen = ref(false)

// const toggleFull = () => {
//   isFullscreen.value = !unref(isFullscreen)
// }

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)
watch(
  () => props.isDefaultFull,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
    }
  },
  {
    immediate: true
  }
)
watch(
  () => props.maxHeight,
  async (val) => {
    dialogHeight.value = isNumber(val) ? `${val}px` : val
  },
  {
    immediate: true
  }
)
watch(
  () => dialogHeight,
  async (val) => {
    console.log(val, 'maxHeight')
    await nextTick()
    emitters('updateDialog', true)
  },
  {
    immediate: true
  }
)
const dialogStyle = computed(() => {
  return {
    width: isNumber(props.maxWidth) ? `${props.maxWidth}px` : props.maxWidth,
    height: unref(dialogHeight)
  }
})
</script>

<template>
  <!-- draggable和自定义指令v-dialogDrag冲突 -->
  <ElDialog
    v-bind="getBindValue"
    :fullscreen="isDefaultFull"
    destroy-on-close
    lock-scroll
    :draggable="!dynamicWH"
    :modal="isMask"
    :append-to-body="isAappendToBody"
    top="0"
    :close-on-click-modal="false"
    :show-close="false"
    :style="dialogStyle"
    :header-class="headerClass"
  >
    <template #header="{ close }">
      <div
        id="dialog-header"
        v-dialogDrag="dynamicWH"
        class="flex justify-between items-center h-48px pr-15px relative"
      >
        <slot name="title">
          <div class="dialog-title pl-15px">{{ title }}</div>
        </slot>
        <div
          class="h-48px flex justify-between items-center absolute top-[50%] right-15px translate-y-[-50%]"
        >
          <Icon
            v-if="fullscreen"
            class="cursor-pointer is-hover !h-48px mr-10px"
            :icon="isDefaultFull ? 'radix-icons:exit-full-screen' : 'tdesign:fullscreen-2'"
            color="#333333"
            width="16"
            height="16"
            hover-color="var(--el-color-primary)"
          />
          <Icon
            class="cursor-pointer is-hover !h-48px"
            icon="ep:close"
            hover-color="var(--el-color-primary)"
            color="#333333"
            @click="close"
          />
        </div>
      </div>
    </template>

    <ElScrollbar>
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="less">
.@{elNamespace}-overlay-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.@{elNamespace}-dialog {
  margin: 0 !important;

  &__header {
    height: 48px;
    padding: 0;
    margin-right: 0 !important;
    border-bottom: 1px solid var(--el-border-color);
  }

  &__body {
    padding: v-bind(padding);
  }

  &__footer {
    border-top: 1px solid var(--el-border-color);
  }

  &__headerbtn {
    top: 0;
  }
}

.el-dialog {
  display: flex;
  flex-direction: column;
  padding: 0 !important;

  .el-dialog__header {
    padding: 0 !important;
  }

  .el-dialog__body {
    overflow: auto;
    flex: 1;
  }

  .el-dialog__footer {
    width: 100%;
    background-color: #fff;
    z-index: 10;
    padding: 7px 10px 7px 0;
  }

  .el-scrollbar__view {
    height: 100%;
  }
}

//  .dialog-title{
//      background: url(@/assets/imgs/dialogTitle.png) no-repeat;
//      line-height: 54px;
//      flex: 1;
//     // background-size: 100% 100%;
//  }
.dialog-title {
  font-weight: bold;
  font-size: 16px;
}
</style>
