import { TableButtonList } from '@/components/TableButtonList'
export const getSearchSchema: FormSchema[] = [
  {
    field: 'serviceName',
    label: '服务名称',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'serviceProvider',
    label: '服务商',
    component: 'Input',
    ConditionalType: '*',
    componentProps: {
      options: [],
      clearable: true
    }
    /*  optionApi: async () => {
      const res = await getDictById({ code: 'ASR_provider' })
      return res || []
    } */
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '临期',
          value: 2
        },
        {
          label: '过期',
          value: 3
        }
      ],
      clearable: true
    }
  },
  {
    field: 'openingTime',
    label: '开通时间',
    component: 'DatePicker',
    ConditionalType: 'timeRange',
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
      label: '服务商',
      field: 'serviceProvider'
    },
    {
      label: '服务名称',
      field: 'serviceName'
    },
    {
      label: '开通路数',
      field: 'routeNum'
    },
    {
      label: '开通时间',
      field: 'openingTime'
    },
    {
      label: '到期时间',
      field: 'expirationTime'
    },
    {
      label: '费用',
      field: 'cost',
      width: 80
    },
    {
      label: '认证签名',
      field: 'signatrue'
    },
    {
      label: '状态',
      field: 'status',
      slots: {
        default: (data: any) => {
          if (data.row.status) {
            let tagType = ''
            switch (data.row.status) {
              case 1:
                tagType = 'success'
                break
              case 2:
                tagType = 'warning'
                break
              case 3:
                tagType = 'danger'
                break
            }
            return (
              <>
                <El-Tag type={tagType} link class="w-48px">
                  {data.row.status_dictText}
                </El-Tag>
              </>
            )
          } else {
            return <></>
          }
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
    field: 'serviceProvider',
    label: '服务商',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [],
      clearable: true
    }
    /* optionApi: async () => {
      const res = await getDictById({ code: 'ASR_provider' })
      return res || []
    } */
  },
  {
    field: 'serviceName',
    label: '服务名称',
    colProps: {
      span: 12
    },
    component: 'Input'
  },
  {
    field: 'routeNum',
    label: '开通路数',
    colProps: {
      span: 12
    },
    component: 'Input'
  },
  {
    field: 'cost',
    label: '费用',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      type: 'number',
      placeholder: '请输入',
      step: 1,
      slots: {
        suffix: () => '元'
      }
    }
  },
  {
    field: 'openingTime',
    label: '开通时间',
    component: 'DatePicker',
    colProps: {
      span: 12
    },
    componentProps: {
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    field: 'expirationTime',
    label: '到期时间',
    component: 'DatePicker',
    colProps: {
      span: 12
    },
    componentProps: {
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  /* {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '临期',
          value: 2
        },
        {
          label: '过期',
          value: 3
        }
      ]
    },
    value: 1
  }, */
  {
    field: 'signatrue',
    label: '认证签名',
    colProps: { span: 24 },
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入认证签名',
      rows: 5
    }
  }
]
const { required } = useValidator()
export const getEditSchemaRules = {
  serviceProvider: [required()],
  serviceName: [required()],
  routeNum: [required()],
  status: [required()],
  cost: [required()]
}
