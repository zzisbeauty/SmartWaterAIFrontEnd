<template>
  <div class="w-100% h-100%">
    <div class="w-100% h-32px py-10px flex justify-between items-center">
      <div class="color-#333 bold">共{{ cardList.length }}个模型</div>
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
    <el-scrollbar class="w-100% !h-[calc(100%-60px)]">
      <div class="current-config">
        <div class="current-app-grid">
          <div
            class="current-app-card"
            :class="{ active: activeList.includes(item.id) }"
            v-for="(item, index) in cardList"
            :key="index"
            @click="handleSelectConfig(item)"
          >
            <div class="h-50% flex justify-start items-center gap-20px m-b-8px">
              <img :src="importImg(`mockimg/modelIcon.png`)" width="54px" />
              <div class="flex flex-col gap-10px">
                <div class="font-bold font-size-18px color-#333">{{ item.name }}</div>
                <!-- <el-tag link class="w-80px">{{ item.manufacturer }}</el-tag> -->
                <div class="flex gap-10px">
                  <el-tag type="primary" size="small">{{ item.type }}</el-tag>
                  <el-tag type="warning" size="small">{{ item.modelCategoryId }}</el-tag>
                </div>
              </div>
            </div>
            <el-scrollbar max-height="60px" :noresize="true" class="">
              <div class="font-size-12px color-#777777">{{
                item.promptConfigStr || '暂无表述'
              }}</div>
            </el-scrollbar>
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
import { handleGetModelList } from '../IndexApi'
const filterText = ref('')
watch(filterText, (val) => {})
const activeList = ref([])

const cardList = ref([])
const allConfig: any = inject('allConfig')

const handleSelectConfig = (e) => {
  activeList.value = [e.id]
  allConfig.largeModelInfo = activeList.value.map((item) => ({ id: item }))
  /* const index = activeList.value.indexOf(e.id)
  if (index > -1) {
    activeList.value.splice(index, 1) // 删除元素
  } else {
    activeList.value.push(e.id) // 添加元素
  }
  allConfig.largeModelInfo = activeList.value */
}
const handleSearch = () => {
  handleGetModelList({ name: `*${filterText.value}*`, pageSize: -1 }).then((res) => {
    cardList.value = res.result.records
  })
}
onMounted(() => {
  if (allConfig.largeModelInfo?.length) {
    activeList.value = allConfig.largeModelInfo.map((e) => e.id)
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
    grid-template-columns: repeat(3, 1fr);
    gap: 15px 10px;
  }

  .current-app-card {
    position: relative;
    width: calc(100% - 20px);
    height: 160px;
    padding: 16px;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 8px;
    &.active {
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
