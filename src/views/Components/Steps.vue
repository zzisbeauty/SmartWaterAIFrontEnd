<script setup lang="tsx">
import { read } from 'fs'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String,Number],
    default: ''
  },
  stepOver: {
    type: Number,
    default: 0
  },
  options: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue','change','beforeChange'])

const step = ref(0)

watch(()=>props.modelValue,(val)=>{
  step.value = Math.max(step.value,props.options.findIndex(item=>item?.value===val))
})


watch(()=>props.stepOver,(val)=>{
  step.value = Math.max(step.value,val)
},{
  immediate: true
})

const change = (item,index)=>{
    if(!props.readonly){
      emit('update:modelValue',item.value)
      emit('change',item.value)
    }
    if(index<=step.value){
        emit('beforeChange',item.value)
      }
}

</script>

<template>
  <div class="w-100% px-20px box-border  flex">
    <div class="step-container" @click="change(item,index)" :class="{'left':index===0,'right':index===props.options.length-1,'over':index<=step}" :id="modelValue===item.value?'choose':''" v-for="(item,index) in props.options" :key="index">
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
#choose {
  &::before {
    background-color: var(--el-color-primary) !important;
  }
  &::after {
    border-left-color: var(--el-color-primary) !important;
  }
  .step-container-item {
    background-color: var(--el-color-primary) !important;
    &>span {
    color: #fff !important;
  }
  }
  
}
.over{
    &::before {
    background-color: #E6F3FF !important;
  }
  &::after {
    border-left-color: #E6F3FF !important;
  }
  .step-container-item {
    background-color: #E6F3FF !important;
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
