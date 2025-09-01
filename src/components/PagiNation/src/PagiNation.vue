<template>
  <div class="flex justify-between pagination-container position-absolut">
    <ElPagination
        :size="size"
      v-show="total > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="isBackground"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      :small="isSmall"
      class="float-right mb-15px mt-15px"
      :layout="layoutLeft"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div class="el-pagination__total" v-if="queryTime"
        >查询耗时: {{ queryTime }} ms</div
      >
    </ElPagination>
    <ElPagination
        :size="size"
      v-show="total > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="isBackground"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      :small="isSmall"
      class="float-right mb-15px mt-15px"
      :layout="layoutRight"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, watchEffect, ref, unref } from 'vue'
import { ElPagination } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 修改分页器默认文字
zhCn.el.pagination.goto = '跳至'
const appStore = useAppStore()
const { t } = useI18n()
defineOptions({ name: 'Pagination' })
const layoutCurrentSize = computed(() => appStore.currentSize)
const isSmall = ref<boolean>(layoutCurrentSize.value === 'small')
watchEffect(() => {
  isSmall.value = unref(layoutCurrentSize) === 'small'
})
const props = defineProps({
  total: propTypes.number.def(0),
  page: propTypes.number.def(1),
  limit: propTypes.number.def(10),
  pageSizes: propTypes.array.def([10, 20, 30, 50, 100]),
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  layoutLeft: propTypes.string.def('total, sizes, slot'),
  layoutRight: propTypes.string.def('prev, pager, next, jumper'),
  queryTime: propTypes.number.def(0),
  isBackground: propTypes.bool.def(true),
  size: propTypes.string.def('default')
})
const emit = defineEmits(['update:page', 'update:limit', 'pagination', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
const handleSizeChange = (val) => {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val) => {
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>
<style lang="less" scoped></style>
<style lang="less">
.pagination-container {
  position: absolute;
  height: 42px;
  padding-top: 5px;
  padding-bottom: 5px;
  bottom: 0;
  width: calc(100% - 40px);
  left: 20px;
  .el-pager li {
    border-radius: 4px;
  }
}

@media (max-width: 768px) {
  .pagination-container .el-pagination > .el-pagination__jump {
    display: none !important;
  }

  .pagination-container .el-pagination > .el-pagination__sizes {
    display: none !important;
  }
}
</style>
