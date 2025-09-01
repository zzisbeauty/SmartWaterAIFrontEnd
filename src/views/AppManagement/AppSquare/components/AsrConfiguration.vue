<template>
  <div class="w-100% h-100%">
    <div class="w-100% h-32px py-10px flex justify-between items-center">
      <div class="color-#333 bold">共{{ cardList.length }}个ASR配置</div>
      <el-input
        style="width: 220px"
        v-model="filterText"
        clearable
        placeholder="请输入分类名称"
        @change="handleSearch"
        @keydown.enter="handleSearch"
      >
        <template #suffix>
          <Icon class="cursor-pointer" icon="ep:search" color="#000000a6" />
        </template>
      </el-input>
    </div>
    <el-scrollbar class="w-100% max-h-90%">
      <div class="current-config">
        <!-- 使用 grid 容器 -->
        <div class="current-app-grid">
          <!-- 卡片 四列布局-->
          <div
            class="current-app-card"
            :class="{ active: activeList.includes(item.id) }"
            v-for="(item, index) in cardList"
            :key="index"
            @click="handleSelectConfig(item)"
          >
            <div class="h-100% flex justify-start items-center gap-20px m-b-8px">
              <img :src="importImg('appMange/ASR图标.png')" width="72px" />
              <div class="flex flex-col gap-20px">
                <div class="font-bold font-size-18px color-#333">{{ item.name }}</div>
                <el-tag link class="w-80px">{{ item.asrId_dictText }}</el-tag>
              </div>
            </div>
            <!-- 选择框 -->
            <div class="activeIcon">
              <Icon
                :size="20"
                :icon="
                  activeList.includes(item.id) ? 'svg-icon:app-isSelect' : 'svg-icon:app-noSelect'
                "
              />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="tsx">
import { Icon } from '@/components/Icon'
import { handleGetASRList } from '../IndexApi'
const filterText = ref('')
watch(filterText, (val) => {})
const activeList = ref([])
const cardList = ref([])
const allConfig: any = inject('allConfig')

const handleSelectConfig = (e) => {
  activeList.value = [e.id]
  allConfig.asrServiceConfig = activeList.value.map((item) => ({ id: item }))
  /* const index = activeList.value.indexOf(e.id)
  if (index > -1) {
    activeList.value.splice(index, 1) // 删除元素
  } else {
    activeList.value.push(e.id) // 添加元素
  }
  allConfig.asrServiceConfig = activeList.value */
}
const handleSearch = () => {
  handleGetASRList({ name: `*${filterText.value}*`, pageSize: -1 }).then((res) => {
    cardList.value = res.result.records
  })
}
onMounted(() => {
  if (allConfig.asrServiceConfig?.length) {
    activeList.value = allConfig.asrServiceConfig.map((e) => e.id)
  }
  handleSearch()
})
</script>

<style scoped lang="less">
.current-config {
  width: 100%;
  height: auto;
  padding: 0 10px;
  box-sizing: border-box;

  .current-app-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px 20px;
  }

  .current-app-card {
    position: relative;
    width: 100%;
    height: 100px;
    padding: 12px;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 8px;
    &.active {
      // box-shadow: 0 0 0 2px #2b90fb inset;
      // border: 2px solid #2b90fb;
      box-shadow: inset 0 0 0 2px #2b90fb;
    }
    .activeIcon {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 999;
    }
  }
}
</style>
