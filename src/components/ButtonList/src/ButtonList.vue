<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BaseButton } from '@/components/Button'
import { permissionList } from '@/utils/actPermission'

const props = defineProps({
  list: {
    type: Array as any,
    default: () => {
      return []
    }
  }
})
const splitNum = ref(5)
const newList = ref(props.list)
onMounted(() => {
  if(import.meta.env.VITE_NODE_ENV === 'development'){
       newList.value = props.list
  }else{
  newList.value = props.list.filter((e) => {
    return permissionList.includes(e.code)
  })
  }
})
const moreCode = () => {
  if (newList.value.length > splitNum.value) {
    const moreList = newList.value.slice(splitNum.value)
    return moreList.map((e) => e.code)
  }
  return []
}
</script>

<template>
  <div class="button-list">
    <base-button
      v-for="item in newList.slice(0, splitNum)"
      :key="item.label"
      :disabled="item.disabled"
      :type="item.type ? item.type : 'primary'"
      @click="item.callback()"
      v-actPermission="item.code"
      
    >
      {{ item.label }}
    </base-button>
    <ElDropdown v-if="newList.length > splitNum + 1" class="ml-12px" v-actPermission="moreCode()">
      <ElButton type="primary" class="max-w-100px">更多</ElButton>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in newList.slice(splitNum)"
            :key="item.lable"
            @click="item.callback()"
          >
            <span v-actPermission="item.code">
              {{ item.label }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </ElDropdown>
    <!-- <div > -->
    <base-button
      v-else
      v-for="item in newList.slice(splitNum)"
      :key="item.label"
      :disabled="item.disabled"
      :type="item.type ? item.type : 'primary'"
      @click="item.callback()"
      v-actPermission="item.code"
    >
      {{ item.label }}
    </base-button>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.button-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.el-dropdown {
  margin-left: 12px;
}
.el-button:focus-visible {
  outline: unset;
}
</style>
