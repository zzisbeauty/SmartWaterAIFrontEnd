<template>
  <div class="ai-table norem-chartBg" v-if="isTable">
    <ElTable :data="tableData" stripe>
      <el-table-column
        v-for="item in tableConfig.propList"
        :prop="item.prop"
        :label="item.label"
        :key="item.prop"
        min-width="100"
        align="center"
      />
    </ElTable>
    <commonPagination
      v-if="tableConfig.total > 10"
      :total="tableConfig.total"
      v-model:page="page"
      v-model:limit="size"
      @pagination="pageFun"
      @update:page="updatePage"
      @update:limit="updateLimit"
    />
  </div>
  <div v-else>
    <div class="common-ul" v-if="tableConfig.tableList && tableConfig.tableList.length">
      <ul class="list-disc px-30px">
        <li v-for="(li, index) in tableConfig.tableList" :key="index">
          <span class="mx-8px" v-for="item in tableConfig.propList" :key="item.prop"
            >{{ item.label }}: {{ li[item.prop] }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, inject, nextTick, computed } from 'vue'
import commonPagination from './commonPagination.vue'

const props = defineProps({
  tableConfig: {
    type: Object,
    default: () => ({}),
    required: true
  },
  /* propList: {
    type: Array<any>,
    default: () => []
  },
  tableList: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number
  }, */
  maxHeight: {
    type: String,
    default: '250'
  }
})
const isTable = computed(() => props.tableConfig.tableList.length > 0)
const tableMinHeight = computed(() => {
  return props.tableConfig.total > 10 ? '480px' : '0'
})
const list = props.tableConfig.tableList
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const updatePage = (cur: number) => {
  page.value = cur
}
const updateLimit = (cur: number) => {
  size.value = cur
}
onMounted(() => {
  pageFun()
})

const getData = () => {
  // 获取数据的逻辑
}
const scrollToBottom = inject('scrollToBottom', () => {})
const pageFun = async () => {
  const begin = (page.value - 1) * size.value
  const end = page.value * size.value
  const data = props.tableConfig.tableList
  tableData.value = data.slice(begin, end)
  await nextTick()
  scrollToBottom()
}
</script>
<style lang="less" scoped>
/* ::v-deep ::-webkit-scrollbar {
  width: 6px;
  height: 10px;
  background-color: #14569f;
}

::v-deep ::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #027eb6;
}

::v-deep ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: rgba(231, 12, 12, 0.2);
}

::v-deep .el-table th.gutter {
  display: none;
  width: 0;
}

::v-deep .el-table colgroup col[name='gutter'] {
  display: none;
  width: 0;
} */

.ai-table {
  :deep(.el-table) {
    min-height: v-bind(tableMinHeight);
    border-radius: 6px !important;
    border: 1px solid rgb(182, 220, 252);
    .el-table__header-wrapper,
    .el-table__fixed-header-wrapper {
      th {
        word-break: break-word;
        background-color: #4da9ff;
        color: #fff;
        height: 40px;
        font-size: 13px;
        border: none;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: 0em;
        color: #ffffff;
      }
    }
    .el-table__header {
      background-color: #4da9ff;
      th,
      tr,
      thead {
        background-color: #4da9ff;
      }
    }
    td.el-table__cell {
      // border-right: 1px solid rgb(182, 220, 252);
      // border: 0.5px solid #4DA9FF;
      border-right: 0.1px solid #4da9ff57;
      border-bottom: 0.1px solid #4da9ff57;
    }
    tr.el-table__row--striped td.el-table__cell {
      background-color: #eef9ff !important;
    }
    .el-table__border-left-patch {
      display: none;
      &:before {
        height: 0;
      }
    }
  }
}

.norem-chartBg {
  // width: calc(100% - 70px);
  border-radius: 12px;
  // padding: 20px 20px 10px 20px;
  margin: 10px;
  // border: 1px solid rgb(111, 195, 255);
  // background: linear-gradient(to bottom, rgba(49, 122, 184, 0.24), rgb(1, 16, 27));
  // box-shadow: inset -1px 0px 20px 5px #018ce5c2, inset 0 0 30px 0px #011a2e;
}
</style>
