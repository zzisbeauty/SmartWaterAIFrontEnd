import { TableButtonList } from '@/components/TableButtonList'
import { getServiceName } from './IndexApi'
export const getSearchSchema: FormSchema[] = [
  {
    field: 'asrId_dictText',
    label: '名称',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'asrId',
    label: '服务名称',
    component: 'Select',
    componentProps: {
      options: [],
      clearable: true
    },
    optionApi: async () => {
      const res = await getServiceName()
      return res || []
    }
  },
  {
    field: 'status',
    label: '启停状态',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'timeRange',
    label: '开通时间',
    component: 'DatePicker',
    colProps: {
      span: 8
    },
    componentProps: {
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      // timeFormat: 'HH:mm',
      startPlaceholder: '开通时间',
      endPlaceholder: '到期日期',
      clearable: true
    }
  }
]
export function getTableColumns(btnAction: (title: any, data: any) => void): TableColumn[] {
  return [
    {
      field: 'index',
      label: '序号',
      type: 'index'
    },
    {
      label: '名称',
      field: 'name'
    },
    {
      label: '服务名称',
      field: 'asrId_dictText'
    },
    {
      label: '语音格式',
      field: 'phoneticMatric'
    },
    {
      label: '模型特征串',
      field: 'modelCharacter'
    },
    {
      label: '头静音时间',
      field: 'headSilenceTime',
      formatter: (row: any) => {
        return row.headSilenceTime + 'ms'
      }
    },
    {
      label: '尾静音时间',
      field: 'tailSilenceTime',
      formatter: (row: any) => {
        return row.tailSilenceTime + 'ms'
      }
    },
    {
      label: '转为阿拉伯数字',
      field: 'toArabicNumberals',
      slots: {
        default: (data: any) => {
          return (
            <el-tag type={data.row.toArabicNumberals ? 'primary' : 'danger'} class="w-48px">
              {data.row.toArabicNumberals_dictText}
            </el-tag>
          )
        }
      }
    },
    {
      label: '添加标点',
      field: 'addPunctuation',
      slots: {
        default: (data: any) => {
          return (
            <el-tag type={data.row.addPunctuation ? 'primary' : 'danger'} class="w-48px">
              {data.row.addPunctuation_dictText}
            </el-tag>
          )
        }
      }
    },
    {
      label: '输出中间结果',
      field: 'outputMiddleResult',
      slots: {
        default: (data: any) => {
          return (
            <el-tag type={data.row.outputMiddleResult ? 'primary' : 'danger'} class="w-48px">
              {data.row.outputMiddleResult ? '是' : '否'}
            </el-tag>
          )
        }
      }
    },
    {
      label: '输出分词',
      field: 'outputPartticple',
      slots: {
        default: (data: any) => {
          return (
            <el-tag type={data.row.outputPartticple ? 'primary' : 'danger'} class="w-48px">
              {data.row.outputPartticple ? '是' : '否'}
            </el-tag>
          )
        }
      }
    },
    {
      label: '启停状态',
      field: 'status',
      slots: {
        default: (data: any) => {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <el-popconfirm
                width="200"
                title={`确定${data.row.status ? '禁用' : '启用'}该ASR吗？`}
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
      field: 'action',
      label: '操作',
      width: '220px',
      slots: {
        default: (data: any) => {
          return (
            <>
              <TableButtonList row={data.row} list={getTableButtonAction(btnAction)} />
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

export function getTableButtonList(btnAction: (title: string, row?: any) => void): TableButton[] {
  return [
    {
      label: '新增',
      code: permissionCode.ADD,
      callback: () => btnAction('新增')
    },
    {
      label: '导出',
      code: permissionCode.DELETE,
      callback: () => btnAction('导出')
    }
  ]
}

export function getTableButtonAction(btnAction: (title: string, row?: any) => void) {
  return [
    {
      label: '详情',
      code: permissionCode.VIEW,
      icon: 'svg-icon:table-details',
      callback: (clickRow) => btnAction('详情', clickRow)
    },
    {
      label: '编辑',
      code: permissionCode.EDIT,
      icon: 'svg-icon:table-edit',
      callback: (clickRow) => btnAction('编辑', clickRow)
    },
    {
      label: '配置热词表',
      icon: 'svg-icon:table-config',
      code: permissionCode.MODIFY,
      callback: (clickRow) => btnAction('配置热词表', clickRow)
    },
    {
      label: '配置关键词',
      icon: 'svg-icon:table-config',
      code: permissionCode.MODIFY,
      callback: (clickRow) => btnAction('配置关键词', clickRow)
    },
    {
      label: '删除',
      icon: 'svg-icon:table-delete',
      code: permissionCode.DELETE,
      popconfirm: true,
      popconfirmProps: {
        title: `确定删除该条目吗？`,
        placement: 'bottom-end'
      },
      onConfirm: (clickRow) => btnAction('删除', clickRow)
    }
  ]
}

export const getEditSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    colProps: {
      span: 12
    },
    component: 'Input'
  },
  {
    field: 'asrId',
    label: '服务名称',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [],
      clearable: true
    },
    optionApi: async () => {
      const res = await getServiceName()
      return res || []
    }
  },
  {
    field: 'phoneticMatric',
    label: '语音格式',
    colProps: {
      span: 12
    },
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'pcm8k16bit',
          value: 'pcm8k16bit'
        },
        {
          label: 'pcm48k16bit',
          value: 'pcm48k16bit'
        }
      ]
    }
  },
  {
    field: 'modelCharacter',
    label: '模型特征串',
    colProps: {
      span: 12
    },
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'chinese_8k_general',
          value: 'chinese_8k_general'
        },
        {
          label: 'chinese_16k_general',
          value: 'chinese_16k_general'
        }
      ]
    }
  },
  {
    field: 'headSilenceTime',
    label: '头静音时间',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      type: 'number',
      placeholder: '请输入头静音时间',
      slots: {
        suffix: () => 'ms'
      }
    }
  },
  {
    field: 'tailSilenceTime',
    label: '尾静音时间',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      type: 'number',
      placeholder: '请输入尾静音时间',
      slots: {
        suffix: () => 'ms'
      }
    }
  },
  {
    field: 'toArabicNumberals',
    label: '转为阿拉伯数字',
    colProps: {
      span: 12
    },
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    },
    value: 1
  },
  {
    field: 'addPunctuation',
    label: '添加标点',
    colProps: {
      span: 12
    },
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    },
    value: 1
  },
  {
    field: 'outputPartticple',
    label: '输出分词',
    colProps: {
      span: 12
    },
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    },
    value: 1
  },
  {
    field: 'outputMiddleResult',
    label: '输出中间结果',
    colProps: {
      span: 12
    },
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    },
    value: 1
  },
  {
    field: 'status',
    label: '启停状态',
    colProps: {
      span: 12
    },
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    },
    value: 1
  }
]
const { required } = useValidator()
export const getEditSchemaRules = {
  name: [required()],
  asrId_dictText: [required()],
  phoneticMatric: [required()]
}
