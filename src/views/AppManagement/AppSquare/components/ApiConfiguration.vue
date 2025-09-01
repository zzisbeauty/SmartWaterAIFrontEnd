<script setup lang="tsx">
import LeftTree from './Tree/Index.vue'
import { handleGetAPIList } from '../IndexApi'

// 注入父级提供的 allConfig
const allConfig: any = inject('allConfig')

//左侧分类筛选
const currentNodeKey = ref('')
const addApiNodeId = ref('')
const handleNodeClick = (data: any) => {
  currentNodeKey.value = data.id
  addApiNodeId.value = data.child && data.child.length ? '' : data.id
  refresh()
}
const singleTableRef = ref<{ elTableRef: any } & InstanceType<typeof Table>>()
const currentRow = ref()
const handleCurrentChange = debounce(async (val) => {
  // currentRow.value = val.val
  // singleTableRef.value?.elTableRef?.toggleRowSelection(val.val)
  currentRow.value = val.val
  singleTableRef.value?.elTableRef?.toggleRowSelection(val.val)

  // 获取当前表格选中的行并同步到父组件
  const elTableExpose = await getElTableExpose()
  const selectedRows = elTableExpose.getSelectionRows()
  allConfig.apiInfoList = selectedRows
}, 100)

// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res: any = await handleGetAPIList({
      pageNo: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchParams.value
    })
    return {
      list: res.result.records,
      total: res.result.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'apiName',
    label: 'API名称',
    component: 'Input',
    colProps: {
      span: 6
    },
    ConditionalType: '*'
  },
  {
    field: 'categoryId',
    label: 'API所属分类',
    component: 'Select',
    colProps: {
      span: 6
    },
    componentProps: {
      placeholder: '请选择API所属分类'
    },
    optionApi: async () => {
      const res = await getDictById({ code: 'api_categray' })
      return res || []
    }
  },
  {
    field: 'businessSystemCode',
    label: '所属系统',
    component: 'Select',
    colProps: {
      span: 6
    },
    componentProps: {
      placeholder: '请选择所属系统',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '内涝监测系统',
          value: '1'
        },
        {
          label: '智能客服系统',
          value: '2'
        }
      ]
    },
    optionApi: async () => {
      const res = await getDictById({ code: 'business_code' })
      return res || []
    }
  }
])
const tableColumns = reactive<TableColumn[]>([
  {
    type: 'selection',
    fixed: 'left',
    field: ''
  },
  {
    field: 'index',
    label: '序号',
    type: 'index'
  },
  {
    label: '接口名称',
    field: 'apiName'
  },

  {
    label: '接口分类',
    field: 'category_dictText'
  },
  {
    label: '业务系统',
    field: 'businessSystemCode_dictText'
  },
  {
    label: '接口类型',
    field: 'type_dictText',
    width: 100,
    slots: {
      default: (data: any) => {
        if (data.row.type) {
          let tagType = ''
          let statusText = ''
          switch (String(data.row.type)) {
            case '0':
              tagType = 'success'
              statusText = '网关接口'
              break
            case '1':
              tagType = 'primary'
              statusText = '一般接口'
              break
            default:
              tagType = 'warning'
              statusText = '链接'
              break
          }
          return (
            <>
              <El-Tag type={tagType} link class="w-71px">
                {statusText}
              </El-Tag>
            </>
          )
        } else {
          return <></>
        }
      }
    }
  }
])

const submit = async () => {
  const elTableExpose = await getElTableExpose()
  // 获取当前表格选中的行
  const selectedRows = elTableExpose.getSelectionRows()
  // 更新 allConfig 中的 api 字段
  allConfig.apiInfoList = selectedRows
  return true
}

onMounted(async () => {
  const elTableExpose: any = await getElTableExpose()
  // 遍历回显
  const arr = [
    {
      id: '1914516355569291266',
      apiId: null,
      assortId: '1914512707548221441',
      name: '保存分类',
      apiSecret: '3b455636492b0458ee2f3802ea6d7104',
      apiType: '0',
      descInfo: '保存分类\n',
      method: 'POST',
      requestAgreement: 'HTTP',
      isCheck: 0,
      url: '/call/apiAssort/add',
      state: 1,
      serviceType: '1',
      servicePath: null,
      parameterType: 3,
      queryParameter: '[]',
      headerParameter: '[]',
      requestParameter:
        '[{"id":"1745290650455","key":"根节点","type":"object","describe":"","isRequired":0,"remark":"","children":[{"id":"1745290655779","key":"assortName","type":"string","describe":"分类名称","isRequired":0,"remark":"","children":[]},{"id":"1745290656429","key":"assortCode","type":"string","describe":"分类编码","isRequired":0,"remark":"","children":[]},{"id":"1745290656852","key":"sort","type":"number","describe":"排序编号","isRequired":0,"remark":"","children":[]},{"id":"1745290683634","key":"state","type":"string","describe":"分类状态 1 启用 0 禁用","isRequired":0,"remark":"","children":[]},{"id":"1745290686289","key":"parentId","type":"string","describe":"父级ID -1 代表父级","isRequired":0,"remark":"","children":[]}]}]',
      serviceParameter: null,
      constantParameter: '[]',
      resultNotes:
        '[{"id":"1745290729306","key":"根节点","type":"object","describe":"","isRequired":0,"remark":"","children":[{"id":"1745290734850","key":"success","type":"string","describe":"","isRequired":0,"remark":"","children":[]},{"id":"1745290735088","key":"message","type":"string","describe":"","isRequired":0,"remark":"","children":[]},{"id":"1745290735243","key":"code","type":"string","describe":"","isRequired":0,"remark":"","children":[]},{"id":"1745290735727","key":"result","type":"string","describe":"","isRequired":0,"remark":"","children":[]},{"id":"1745290754636","key":"timestamp","type":"string","describe":"","isRequired":0,"remark":"","children":[]}]}]',
      customParameter: '[]',
      resultType: 'json',
      plugins: null,
      delFlag: 0,
      tenementGuid: null,
      createBy: 'anonymousUser',
      createTime: '2025-04-22 00:00:00',
      updateBy: null,
      updateTime: null,
      releaseMark: [
        {
          releaseSate: 1,
          environment: 'TEST',
          versionNum: 'v68'
        },
        {
          releaseSate: 1,
          environment: 'RELEASE',
          versionNum: 'v63'
        },
        {
          releaseSate: 1,
          environment: 'PRE',
          versionNum: 'v63'
        }
      ]
    }
  ]
  allConfig.apiInfoList?.forEach((row) => {
    elTableExpose.toggleRowSelection(row, true)
  })
})
onBeforeUnmount(async () => {
  await submit()
})
defineExpose({ submit })
</script>

<template>
  <div class="flex w-100% h-100% box-border py10px">
    <!-- <div class="w-300px bg-#FFF">
      <LeftTree v-model="currentNodeKey" @change="handleNodeClick" />
    </div> -->
    <div class="w-[100%-310px] flex-1 ml-10px overflow-hidden">
      <div class="h-100% table-page-container">
        <!-- 搜索组件，该组件配置如下即可，不需改变 -->
        <Search
          :schema="searchSchema"
          isCol
          @search="setSearchParams"
          @reset="setSearchParams"
          @register="searchRegister"
        />
        <div class="p-15px pb0 card-container flex-1">
          <!-- 表格组件，该组件配置如下即可，不需改变 -->
          <Table
            ref="singleTableRef"
            v-model:pageSize="pageSize"
            v-model:currentPage="currentPage"
            :columns="tableColumns"
            :data="dataList"
            :loading="loading"
            :pagination="{
              total: total
            }"
            highlight-current-row
            sortable
            :showAction="false"
            :border="false"
            :showOverflowTooltip="true"
            :reserveSelection="true"
            @register="tableRegister"
            @refresh="refresh"
            @handle-row-click="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.circle) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  margin-right: 3px;
  &.TEST {
    background: var(--el-color-danger-light-5);
    & + span {
      color: var(--el-color-danger);
    }
  }
  &.PRE {
    background: var(--el-color-warning-light-5);
    & + span {
      color: var(--el-color-warning);
    }
  }
  &.RELEASE {
    background: var(--el-color-success-light-5);
    & + span {
      color: var(--el-color-success);
    }
  }
}
</style>
