<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { ButtonType, ComponentSize, ElButton } from 'element-plus'
import { Component, computed, PropType, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore: any = useAppStore()

const getTheme = computed(() => appStore.getTheme)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('button')

const props = defineProps({
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined
  },
  type: {
    type: String as PropType<ButtonType>,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: false
  },
  bg: {
    type: Boolean,
    default: false
  },
  link: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingIcon: {
    type: [String, Object] as PropType<String | Component>,
    default: undefined
  },
  icon: {
    type: [String, Object] as PropType<String | Component>,
    default: undefined
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  nativeType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  autoInsertSpace: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ''
  },
  darker: {
    type: Boolean,
    default: false
  },
  tag: {
    type: [String, Object] as PropType<String | Component>,
    default: 'button'
  },
  actPermission: {
    type: String,
    default: 'default'
  }
})

const emits = defineEmits(['click'])
const handleClick = debounce(() => {
  emits('click')
}, import.meta.env.VITE_DEBOUNCE_TIME)

const color = computed(() => {
  const { type } = props
  if (type === 'primary') {
    return unref(getTheme).elColorPrimary
  }
  return ''
})

const style = computed(() => {
  const { type } = props
  if (type === 'primary') {
    return '--el-button-text-color: #fff; --el-button-hover-text-color: #fff'
  }
  return ''
})
</script>

<template>
  <ElButton
    :class="`${prefixCls} color-#fff`"
    class="min-w-100px"
    v-bind="{ ...props }"
    :color="color"
    :style="style"
    @click="handleClick"
  >
    <slot></slot>
    <slot name="icon"></slot>
    <slot name="loading"></slot>
  </ElButton>
</template>
