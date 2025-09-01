<script setup lang="tsx">
import { Icon } from '@/components/Icon'
import { handleGetDigitalList } from '../IndexApi'
const filterText = ref('')
watch(filterText, (val) => {})
const activeList = ref([])
const allConfig: any = inject('allConfig')

const cardList = ref([])

const handleSelectConfig = (e) => {
  activeList.value = [e.id]
  allConfig.digitalHumanServiceConfig = activeList.value.map((item) => ({ id: item }))
  /* const index = activeList.value.indexOf(e.id)
  if (index > -1) {
    activeList.value.splice(index, 1) // 删除元素
  } else {
    activeList.value.push(e.id) // 添加元素
  }
  allConfig.digitalHumanServiceConfig = activeList.value */
}
const handleSearch = () => {
  // handleGetDigitalList({ name: `*${filterText.value}*`, pageSize: -1 }).then((res) => {
  handleGetDigitalList({pageSize: -1 }).then((res) => {
    cardList.value = res.result.records
  })
}
onMounted(() => {
  if (allConfig.digitalHumanServiceConfig?.length) {
    activeList.value = allConfig.digitalHumanServiceConfig.map((e) => e.id)
  }
  handleSearch()
})
</script>
<template>
  <div class="w-100% h-100%">
    <div class="w-100% h-32px py-10px flex justify-between items-center">
      <div class="color-#333 bold">共{{ cardList.length }}个数字人</div>
      <!-- <el-input
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
      </el-input> -->
    </div>
    <el-scrollbar class="w-100% max-h-90%">
      <div class="current-config">
        <div class="current-app-grid">
          <div
            class="current-app-card"
            :class="{ active: activeList.includes(item.id) }"
            v-for="(item, index) in cardList"
            :key="index"
            @click="handleSelectConfig(item)"
          >
            <div class="w-60% h-100% flex flex-col justify-between">
              <div>
                <div class="font-bold font-size-18px color-#333 m-b-8px">{{ item.digitalHumanId_dictText }}</div>
                <el-scrollbar max-height="50px" :noresize="true" class="z-99">
                  <div class="font-size-12px color-#777777">{{ item.serviceId_dictText }}</div>
                </el-scrollbar>
              </div>
              <el-tag link class="w-80px">{{ item.voice_dictText }}</el-tag>
            </div>
            <!-- 卡片背景图 -->
            <div class="person-bg">
              <img :src="item.imageUrl" />
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
    gap: 20px;
  }

  .current-app-card {
    display: flex;
    position: relative;
    width: 100%;
    height: 136px;
    padding: 16px 16px 16px 16px;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 8px;
    &.active {
      // box-shadow: 0 0 0 2px #2b90fb inset;
      // border: 2px solid #2b90fb;
      box-shadow: inset 0 0 0 2px #2b90fb;
    }

    .person-bg {
      // position: absolute;
      // top: 0%;
      bottom: 0;
      right: 2%;
      height: 100%;
      // width: 45%;
      width: 125px;
      // background: url('@/assets/imgs/appMange/person-bg.png') no-repeat;
      background-position: 100% 16px;
      background-size: 100% 100%;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      img {
        // width: 90%;
        // max-height: 90%;
        width: 100px;
        height: 100px;
      }
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
