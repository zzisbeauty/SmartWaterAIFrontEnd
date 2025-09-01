<template>
  <div class="ai-pagenation">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array<number>,
    default() {
      return [10, 20, 30, 50]
    }
  },
  pagerCount: {
    type: Number,
    default: 5
  },
  layout: {
    type: String,
    default: 'prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  }
})

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val)
})

const emit = defineEmits(['pagination', 'update:page', 'update:limit'])

const handleSizeChange = (val) => {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    // scrollTo(0, 800);
  }
}

const handleCurrentChange = (val) => {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    // scrollTo(0, 800);
  }
}

onMounted(() => {
  // 组件挂载后的逻辑
})

onBeforeUnmount(() => {
  // 组件销毁前的逻辑
})
</script>
<style lang="less" scoped>
.ai-pagenation {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  .el-pagination__jump {
    color: #ffffffb6;
    margin-left: 0;
    font-weight: 400;
  }

  .is-in-pagination {
    input {
      font-size: 18px;
      @include btn-style();
    }
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: unset;
  }

  .el-pager li {
    line-height: 26px;
    min-width: 20px !important;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    @include btn-style();
    min-width: 28px !important;
  }

  .el-pagination__editor.el-input {
    width: 40px;
  }
}

.btn-style() {
  color: #ffffffb6;
  background-color: rgba(8, 31, 69, 0.8);
  border: 1px solid rgb(0, 180, 255);
  box-shadow:
    inset -1px 0px 10px 2px rgba(8, 31, 69, 0.8),
    inset 0 0 10px #72b4e8;
}
</style>
