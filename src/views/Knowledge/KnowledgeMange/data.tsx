import { Icon } from '@/components/Icon'
import { TableButtonList } from '@/components/TableButtonList'
const { required } = useValidator()
export const getSearchSchema: FormSchema[] = [
  {
    field: 'name',
    label: '知识库名称',
    component: 'Input',
    ConditionalType: '*'
  }
]
export const getAddSchema: FormSchema[] = [
  {
    field: 'name',
    label: '知识库名称',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      // showMessage: false
    },
    formItemProps: {
      style: {
        // 'margin-bottom': 0
      }
    }
  },
  {
    field: 'description',
    label: '知识库表述',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3
    }
  },
  {
    label: '知识库缩略图',
    field: 'iconUrl',
    component: 'FileUpload',
    colProps: {
      span: 24
    },
    componentProps: {
      dataId: '',
      fileList: '',
      onlyImg: false,
      limit: 1,
      accept: 'image/jpg,image/jpeg,image/png',
      beforeUpload: (file) => {
        const isValidType = ['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)
        if (!isValidType) {
          useMessage('warning', '只能上传 JPG/PNG/GIF 格式的图片!')
          return false
        }
        return true
      }
    }
  }
]
export const getAddSchemaRules = {
  name: [required()],
  description: [required()]
  // avatar: [required()]
}

// 文件配置页
export const getFileSearchSchema: FormSchema[] = [
  {
    field: 'name',
    label: '文件名称',
    component: 'Input'
  }
]
export function getFileTableColumns(btnAction: (title: any, data: any) => void): TableColumn[] {
  return [
    {
      field: 'index',
      label: '序号',
      type: 'index'
    },
    {
      label: '名称',
      field: 'name',
      minWidth: 160,
      slots: {
        default: (data: any) => {
          return (
            <>
              <el-button
                type="primary"
                link
                // class="underline underline-solid"
                onClick={() => {
                  btnAction('详情', data.row)
                }}
              >
                {data.row.name}
              </el-button>
            </>
          )
        }
      }
    },
    {
      label: '分块数',
      field: 'chunkNum'
    },
    {
      label: '切片方法',
      field: 'docParser'
    },
    {
      label: '上传日期',
      field: 'createTime'
    },
    {
      label: '启停状态',
      // field: 'startStopStatus',
      field: 'status',
      slots: {
        default: (data: any) => {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <el-popconfirm
                width="180"
                title={`确定${data.row.status ? '禁用' : '启用'}该文件吗？`}
                onConfirm={() => btnAction('启停', data.row)}
              >
                {{
                  reference: () => {
                    return <el-switch modelValue={Boolean(data.row.status)} />
                  }
                }}
              </el-popconfirm>
            </div>
          )
        }
      }
    },
    {
      label: '解析状态',
      // field: 'status',
      field: 'parserStatus',
      slots: {
        default: (data: any) => {
          const statusConfig = {
            已解析: { type: 'success' },
            未解析: { type: 'warning' }
          }
          const tagConfig = statusConfig[data.row.parserStatus]
          // const tagConfig = data.row.parserStatus != '解析中'
          return tagConfig ? (
            <El-Tag type={tagConfig.type} link class="w-48px">
              {data.row.parserStatus}
            </El-Tag>
          ) : (
            <el-progress class="w-150px" striped striped-flow percentage={data.row.progress?.toFixed(3)} />
          )
        }
      }
    },
    {
      field: 'action',
      label: '操作',
      width: '220px',
      slots: {
        default: (data: any) => {
          return (
            <>
              {data.row.parserStatus !== '解析中' ? (
                <El-Button
                  type="primary"
                  link
                  onClick={() => btnAction('解析', data.row)}
                  v-actPermission={permissionCode.VIEW}
                >
                  <Icon size={18} icon="svg-icon:table-details" class="m-3px" />
                  解析
                </El-Button>
              ) : (
                <El-Button
                  type="danger"
                  link
                  onClick={() => btnAction('停止', data.row)}
                  v-actPermission={permissionCode.EDIT}
                >
                  <Icon size={18} icon="svg-icon:table-edit" class="m-3px" />
                  停止
                </El-Button>
              )}
              <El-Button
                type="primary"
                link
                onClick={() => btnAction('下载', data.row)}
                v-actPermission={permissionCode.EDIT}
              >
                <Icon size={18} icon="svg-icon:table-edit" class="m-3px" />
                下载
              </El-Button>
              <el-popconfirm title={`确定删除吗？`} onConfirm={() => btnAction('删除', data.row)}>
                {{
                  reference: () => (
                    <El-Button type="primary" link v-actPermission={permissionCode.DELETE}>
                      <Icon size={18} icon="svg-icon:table-delete" class="m-3px" />
                      删除
                    </El-Button>
                  )
                }}
              </el-popconfirm>
            </>
          )
        }
      }
    }
  ]
}

type TableButton = {
  label: string
  code: string
  callback: () => void
}
export function getFileTableAction(btnAction: (title: string, row?: any) => void): TableButton[] {
  return [
    {
      label: '新增',
      code: permissionCode.ADD,
      callback: () => btnAction('新增')
    }
  ]
}
