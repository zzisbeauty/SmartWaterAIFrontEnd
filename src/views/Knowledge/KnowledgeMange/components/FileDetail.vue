<template>
  <div class="w-100% h-100% relative">
    <div class="w-100% h-32px pb-10px flex justify-between items-center">
      <!-- <el-checkbox v-model="checked" label="选择所有" size="large" /> -->
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
    <div class="h-[calc(100%-32px-60px)] bg-#F8F8F8 p16px box-border">
      <div v-if="datalist.length" class="flex flex-col gap-12px">
        <div v-for="(item, index) in datalist" :key="index">
          <div class="listItem">
            <el-checkbox v-model="item.checked" label="" size="large" />
            <div>{{ item.text }}</div>
            <el-switch v-model="item.switch" class="ml6px" @change="handleSwitchStatus(item)" />
          </div>
        </div>
      </div>
      <div v-else class="h-100% flex flex-col gap-20px items-center justify-center">
        <img src="@/assets/imgs/table-empty.png" alt="" />
        <span class="color-#333 font-size-14px">暂无数据</span>
      </div>
    </div>
    <BasePagiNation
      v-model:limit="pageOption.pageSize"
      v-model:page="pageOption.currentPage"
      :total="pageOption.total"
      :page-sizes="pageOption.pageSizes"
      :layout="pageOption.layout"
      class="mt-10px"
      @pagination="handlePagination"
    />
  </div>
</template>

<script setup lang="tsx">
import { PagiNation as BasePagiNation } from '@/components/PagiNation'
import { getFileSlice, switchFileSlice } from '../IndexApi'
const pageOption = reactive({
  total: 0, // 初始为0，应通过接口获取实际值
  pageSize: 10,
  currentPage: 1,
  size: 'small',
  layout: 'total, sizes, prev, pager, next, jumper',
  showTotal: (total, range) => `共 ${total} 条`,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40, 50]
})
const details: any = ref()
const filterText = ref('')
const checked = ref(false)
const datalist = ref([
  {
    id: '1',
    checked: true,
    switch: true,
    text: `在西门外年尼院住着他师父极一精一演先天神数，于去冬家了妙玉本欲扶灵回乡的，他师父临寂遗言，说他农食起居不宜回乡，在此静居，后来自有你的结果。所以他竞来回乡。王夫人不等回完，便说：“跟这样，我们何不接了他来”`
  },
  {
    id: '2',
    checked: true,
    switch: true,
    text: `在西门外年尼院住着他师父极一精一演先天神数，于去冬家了妙玉本欲扶灵回乡的，他师父临寂遗言，说他农食起居不宜回乡，在此静居，后来自有你的结果。所以他竞来回乡。王夫人不等回完，便说：“跟这样，我们何不接了他来”`
  },
  {
    id: '3',
    checked: true,
    switch: true,
    text: `在西门外年尼院住着他师父极一精一演先天神数，于去冬家了妙玉本欲扶灵回乡的，他师父临寂遗言，说他农食起居不宜回乡，在此静居，后来自有你的结果。所以他竞来回乡。王夫人不等回完，便说：“跟这样，我们何不接了他来”`
  }
])
const handleSearch = () => {
  const getData = {
    pageNo: pageOption.currentPage,
    pageSize: pageOption.pageSize,
    docId: details.value.id,
    KeyWords: filterText.value
  }
  getFileSlice(getData).then((res) => {
    if (res.success) {
      datalist.value = res.result.records || []
    } else {
      datalist.value = []
      useMessage('warning', res.message)
    }
  })
}
// 切片状态切换
const handleSwitchStatus = (e) => {
  const postData = {
    docId: details.value.docId,
    slicingIdList: e.slicingIdList,
    status: e.switch
  }
  switchFileSlice(postData)
}
const feedBackData = (row: any) => {
  details.value = row
  handleSearch()
}
// 分页事件处理
const handlePagination = (params) => {
  // 处理分页变化，重新获取数据
  // fetchData()
}
defineExpose({
  feedBackData
})
</script>

<style lang="less" scoped>
:deep(.pagination-container) {
  height: 32px;
}

.listItem {
  width: 100%;
  font-size: 14px;
  min-height: 64px;
  box-sizing: border-box;
  padding: 12px 16px;
  border-radius: 2px;
  background: #ffffff;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}
</style>
