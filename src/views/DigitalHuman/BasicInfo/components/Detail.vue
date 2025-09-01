<script setup lang="tsx">
const searchApiName = ref('') //api名称
const searchApiSecret = ref('') //api密钥
const tableDataObj = ref({})
const activeTab = ref('')
const { tableRegister, tableState, tableMethods } = useTable({
  immediate: false,
  fetchDataApi: async () => {
    // const { currentPage, pageSize } = tableState
    // const res: any = await handleApiAssortGetDetail({
    // id:unref(details).id
    // })
    // tableDataObj.value = res.result
    // const keys = Object.keys(res.result)
    // if(keys.length){
    //     activeTab.value = keys[0]
    // }
    return {
      list: []
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, refresh, getElTableExpose } = tableMethods
/**
 * 页面复合对象 search搜索栏对象  table表格对象
 * 初始化配置搜索项、表格等重要组件
 * 配置search对象即可使相应的对象在搜索组件中展示、配置table对象同理
 */
const tableSchemas = reactive<tableSchema[]>([
  {
    field: 'index',
    label: '序号',
    type: 'index'
  },
  {
    label: 'API名称',
    field: 'name'
  },
  {
    label: '密钥',
    field: 'apiSecret',
    width: '300px'
  },
  {
    label: '类型 ',
    field: 'apiType',
    width: '100px',
    align: 'center',
    headerAlign: 'center',
    table: {
      /**
       * slot插槽 此处支持jsx/tsx语法
       */
      slots: {
        default: (data: any) => {
          return (
            <>
              <El-Tag class="w-48px" type={data.row.apiType === '0' ? 'primary' : 'success'}>
                {data.row.apiType === '0' ? '私有' : '公开'}
              </El-Tag>
            </>
          )
        }
      }
    }
  },

  // {
  //   label: '版本',
  //   field: 'buName'
  // },
  {
    label: '启用/禁用',
    field: 'state',
    search: {
      label: '启用状态',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ]
      }
    },
    width: '100px',
    align: 'center',
    table: {
      /**
       * slot插槽 此处支持jsx/tsx语法
       */
      slots: {
        default: (data: any) => {
          return (
            <>
              {/* <el-popconfirm
                title={`确定${data.row.state ? '禁用' : '启用'}该API吗？`}
                onConfirm={() => handleChangeState(data.row)}
              >
                {{
                  reference: () => {
                    return <el-switch modelValue={Boolean(data.row.state)} />
                  }
                }}
              </el-popconfirm> */}
            </>
          )
        }
      }
    }
  },
  {
    label: '描述',
    field: 'descInfo'
  }
])

/**
 * 将配置的tableSchemas装进hood函数，得到全部配置
 * 得到的allSchemas当中可以分别拆除多种组件配置，
 *  包括searchSchema、tableColumns，可抽出这些对象并二次封装
 */
const { allSchemas } = useTableSchemas(tableSchemas)

const tabChange = (val) => {
  // dataList.value = tableDataObj.value[ activeTab.value]
  // const rawList = tableDataObj.value[activeTab.value] || []

  // const filteredList = rawList.filter((item: any) => {
  //   const matchName = !searchApiName.value || item.name.includes(searchApiName.value)
  //   const matchSecret = !searchApiSecret.value || item.apiSecret.includes(searchApiSecret.value)
  //   return matchName && matchSecret
  // })

  // dataList.value = filteredList
  handleSearch()
  //      searchApiName.value = ''
  //   searchApiSecret.value = ''
}
const handleSearch = () => {
  const rawList = tableDataObj.value[activeTab.value] || []

  const filteredList = rawList.filter((item: any) => {
    const matchName = !searchApiName.value || item.name.includes(searchApiName.value)
    const matchSecret = !searchApiSecret.value || item.apiSecret.includes(searchApiSecret.value)
    return matchName && matchSecret
  })
  dataList.value = filteredList
}
//重置
const handleReset = () => {
  searchApiName.value = ''
  searchApiSecret.value = ''
  handleSearch()
  //   refresh()
}

const details = ref<any>({})
const feedBackData = async (row) => {
  details.value = row
  //   handleReset()
  getList()
}
defineExpose({
  feedBackData
})
</script>

<template>
  <div class="w-100% h-100%">
    <div class="detail-box w-100% grid gap-y-15px" style="grid-template-columns: 1fr 1fr">
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">服务商：</span>
        <div class="flex-1 text-14px color-#333">{{ details.serviceProvider }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">服务名称：</span>
        <div class="flex-1 text-14px color-#333">{{ details.digitalPersonName }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">开通路数：</span>
        <div class="flex-1 text-14px color-#333">{{ details.routeNum }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">费用：</span>
        <div class="flex-1 text-14px color-#333">{{ details.cost }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">开通时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.openingTime }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">到期时间：</span>
        <div class="flex-1 text-14px color-#333">{{ details.expirationTime }}</div>
      </div>
      <div class="flex items-center">
        <span class="text-14px color-#777777 w-84px text-start">状态：</span>
        <div class="flex-1 text-14px color-#333">
          <el-tag
            :type="
              details.status == 1
                ? 'success'
                : details.status == 2
                  ? 'warning'
                  : details.status == 3
                    ? 'danger'
                    : 'info'
            "
            >{{ details.status == 1 ? '正常' : details.status == 2 ? '临期' : '过期' }}</el-tag
          >
        </div>
      </div>
    </div>
    <!-- 认证签名字段独占一行 -->
    <div class="detail-box p-t-15px w-100%">
      <div class="flex items-center w-100%">
        <span class="text-14px color-#777777 w-84px text-start">认证签名：</span>
        <div class="flex-1 text-14px color-#333">{{ details.signatrue }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title-box {
  padding: 10px 0;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #efefef;
    margin-left: 12px;
  }
}
.detail-box {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  border-radius: 4px 4px 0px 0px;
  // background: #F5F5F5;
}
.gray-card-tabs {
  :deep(.el-tabs__item) {
    background: rgba(0, 0, 0, 0.0392);
    border: 1px solid rgba(0, 0, 0, 0.149);
    border-radius: 4px 4px 0px 0px;
    margin-right: 5px;
    &:first-child {
      border-left: 1px solid rgba(0, 0, 0, 0.149) !important;
    }
    &.is-active {
      background: #ffffffff;
    }
  }
  :deep(.el-tabs__header) {
    // border-bottom: 0;
  }
  :deep(.el-tabs__nav) {
    border: 0 !important;
  }
}
</style>
