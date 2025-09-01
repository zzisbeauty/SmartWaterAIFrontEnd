<script setup lang="tsx">
import Edit from './components/Edit/Index.vue'
import Detail from './components/Detail/Index.vue'
import { handleMulDelete, handleGetTableList, handleFileUpload, handleExport } from './IndexApi'
import { Icon } from '@iconify/vue'
// 定义搜索参数，并执行搜索事件
const { searchRegister, searchMethods } = useSearch()
const { setValues, getSearchParam } = searchMethods
const searchParams = ref<Record<string, any>>({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  immediate: true,
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params = dealParams(searchParams.value, searchSchema)
    try {
      const res: any = await handleGetTableList({
        pageNo: unref(currentPage),
        pageSize: unref(pageSize),
        ...params
      })
      return {
        list: res.result.records,
        total: res.result.total
      }
    } catch (error) {
      console.error('获取表格数据失败:', error)
      useMessage('error', '获取数据失败')
      return {
        list: [],
        total: 0
      }
    }
  }
})
const { loading, dataList, total, currentPage, pageSize, requestTime } = tableState
const { getList, refresh, getElTableExpose } = tableMethods

/**
 * 定义搜索表单项配置集合，每个对象表示一个搜索条件字段
 * 包含字段标识、显示标签、组件类型及组件属性配置
 */
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'apiCode',
    label: '接口编号',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'apiName',
    label: '接口名称',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'categoryId',
    label: '所属分类',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'api_categray' })
      return res || []
    }
  },
  {
    field: 'businessSystemCode',
    label: '业务系统',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'business_code' })
      return res || []
    }
  },
  {
    field: 'type',
    label: '接口类型',
    component: 'Select',
    componentProps: {},
    optionApi: async () => {
      const res = await getDictById({ code: 'api_type' })
      return res || []
    }
  }
])

/**
 * 定义表格列配置集合
 * 每个对象表示一列
 * 包含字段映射、显示标签、样式设置及自定义插槽组件
 */
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
    label: '接口编号',
    field: 'apiCode'
  },

  {
    label: '接口名称',
    field: 'apiName',
    width: '200px'
  },

  {
    label: '所属分类',
    field: 'categoryId_dictText'
  },

  {
    label: '业务系统',
    field: 'businessSystemCode_dictText'
  },

  {
    label: '接口类型',
    field: 'type',
    slots: {
      default: (data: any) => {
        return (
          <el-tag
            type={
              data.row.type_dictText == '网关接口'
                ? 'primary'
                : data.row.type_dictText == '一般接口'
                  ? 'warning'
                  : 'success'
            }
            class="w-65px"
          >
            {data.row.type_dictText}
          </el-tag>
        )
      }
    }
  },

  {
    label: '请求方式',
    field: 'requestType'
  },

  {
    label: '请求地址',
    field: 'url'
  },

  {
    field: 'action',
    label: '操作',
    width: '200px',
    slots: {
      default: (data: any) => {
        return (
          <>
            <El-Button
              type="primary"
              link
              onClick={() => handleShowDetail(data.row)}
              v-actPermission={permissionCode.VIEW}
            >
              <Icon icon="svg-icon:table-details" class="m-3px" />
              详情
            </El-Button>
            <El-Button
              type="primary"
              link
              onClick={() => editDialog(data.row)}
              v-actPermission={permissionCode.EDIT}
            >
              <Icon icon="svg-icon:table-edit" class="m-3px" />
              配置
            </El-Button>
          </>
        )
      }
    }
  }
])
/* // 1. 从配置文件生成配置
const columns = createTableColumns(handleChangeState, handleShowDetail);

// 2. 使用 reactive 包裹保持响应式
const tableColumns = reactive<TableColumn[]>(columns); */

/**
 * 定义表格操作按钮列表配置项集合。
 * 每个按钮对象包含以下属性说明：
 * - label: 按钮显示名称（必填）
 * - code: 对应的权限校验代码（必填）
 * - callback: 点击按钮时触发的回调函数（必填）
 */
const tableButtonList = ref([
  {
    label: '新增', // 按钮显示名称
    code: permissionCode.ADD, // 对应的权限校验代码
    callback: () => {
      // 点击回调函数，参数为按钮类型标识符
      btnAction('新增')
    }
  },
  {
    label: '导入',
    code: permissionCode.IMPORT,
    callback: () => btnAction('导入')
  },
  {
    label: '导出',
    code: permissionCode.EXPORT,
    callback: () => btnAction('导出')
  },
  {
    label: '删除',
    code: permissionCode.DELETE,
    callback: () => btnAction('删除')
  }
])

const singleTableRef = ref<InstanceType<typeof Table>>()
const currentRow = ref()
const handleCurrentChange = async (val) => {
  currentRow.value = val.currentRow
}

/**
 * 按钮事件
 */
const btnAction = async (title: string) => {
  const elTableExpose: any = await getElTableExpose()
  const ids = elTableExpose.getSelectionRows().map((item: any) => item.id)
  const requiresSelection = !['新增', '导入', '导出'].includes(title)

  if (requiresSelection && !ids.length) {
    useMessage('error', '请选择一条数据')
    return false
  }

  switch (title) {
    case '新增':
      editDialog()
      break
    case '配置':
      editDialog(currentRow.value)
      break
    case '删除':
      MuldoDelete(ids)
      break
    case '导入':
      doUpload()
      break
    case '导出':
      doExport(ids)
      break
    default:
      break
  }
}

//详情-弹窗
const dialogVisibleDetail = ref(false)
const dialogDetailTitle = ref('详情')
const detail = ref()
/**
 * 显示详情对话框并初始化数据
 * @param {Object} row - 当前选中的数据行
 * @returns {Promise<void>} - 无返回值的Promise
 */
const handleShowDetail = async (row: any) => {
  // 开启详情对话框
  dialogVisibleDetail.value = true
  // 根据当前行数据设置对话框标题
  dialogDetailTitle.value = `${row.apiName} - 详情`
  // 在DOM更新后调用API方法反馈数据
  nextTick(() => {
    detail.value.feedBackData(row)
  })
}

const edit = ref()
/**
 * 新增-编辑弹窗
 * @param {Object} row
 */
const editDialog = async (row: any = null) => {
  console.log(row)
  edit.value.feedBackData(row)
}

// 批量删除
const MuldoDelete = (ids: string[]) => {
  const idsString = ids.join(',')
  ElMessageBox.confirm('是否确认删除？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      loading.value = true
      handleMulDelete({ ids: idsString })
        .then((res: any) => {
          loading.value = false
          if (res.success) {
            getList()
            useMessage('success', res.message || '删除成功')
          } else {
            useMessage('error', res.message || '删除失败')
          }
        })
        .catch((error) => {
          loading.value = false
          console.error('删除失败:', error)
          useMessage('error', '删除失败')
        })
    })
    .catch(() => {})
}
/*
 * 导入
 */

const importVisible = ref(false) // 控制导入窗口的显示
const importExplain = ref(['以文本格式填写相关内容', '正确填写类型名称，可查阅相关数据字典']) // 导入模板内的导入说明
const importTitle = ref('导入样例') //导入弹窗标题
const doUpload = () => {
  importTitle.value = '导入文件'
  importVisible.value = true
}

// // 获取导入模板
// const getFile = async () => {
//   try {
//     downloadByUrl(new URL(`@/assets/API导入模板.xlsx`, import.meta.url).href, `API导入模板.xlsx`)
//   } catch (error) {
//     console.error('下载文件时出错：', error)
//   }
// }
// // 导入上传文件
// const importRef = ref()
// const importClose = () => {
//   importVisible.value = false
// }
// const importLoading = ref(false)
// const fileUpload = (file) => {
//   const whiteList = ['xls', 'xlsx']
//   if (!whiteList.includes(file.name.split('.')[1])) {
//     useMessage('warning', '请上传xlsx格式的文件')
//     return false
//   } else {
//     importLoading.value = true
//     handleFileUpload({
//       file: file
//     }).then((res: any) => {
//       importLoading.value = false
//       if (res.success) {
//         getList()
//         useMessage('success', res.message)
//         importVisible.value = false
//       } else {
//         useMessage('error', res.message)
//       }
//     })
//   }
// }

/*
 * 导出
 */
const exportLoading = ref(false)
const doExport = async (ids: string[]) => {
  // console.log('ids', ids)
  // try {
  //   exportLoading.value = true
  //   const params = await getSearchParam()
  //   const response: any = await handleExport({ ...params, ids })
  //   downLoadByType(response)
  //   exportLoading.value = false
  // } catch (error) {
  //   exportLoading.value = false
  //   console.error('导出失败:', error)
  //   useMessage('error', '导出失败')
  // }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <div class="w-[100%-320px] flex-1 overflow-hidden">
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
            :requestTime="requestTime"
            @handle-row-current-change="handleCurrentChange"
            highlight-current-row
            sortable
            showAction
            :border="false"
            :showOverflowTooltip="true"
            @register="tableRegister"
            @refresh="refresh"
          >
            <template #buttonSlot>
              <tableTitle>
                <ButtonList :list="tableButtonList" />
              </tableTitle>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <Edit ref="edit" @success="getList" />
    <FullDialog v-loading="loading" v-model="dialogVisibleDetail" :title="dialogDetailTitle">
      <Detail ref="detail" v-if="dialogVisibleDetail" />
    </FullDialog>
    <!-- 导入导出组件，配置不需改变 -->
    <!-- <Import
      ref="importRef"
      v-model="importVisible"
      :title="importTitle"
      @get-template="getFile"
      @upload-file="fileUpload"
      :auto-upload="false"
      :importExplain="importExplain"
      :show-file-list="true"
      @close="importClose"
      :loading="importLoading"
    /> -->
  </div>
</template>

<style lang="less" scoped></style>
