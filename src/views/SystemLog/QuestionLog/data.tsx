import { TableButtonList } from '@/components/TableButtonList'
export const getSearchSchema: FormSchema[] = [
  {
    field: 'applicationName',
    label: '应用名称',
    component: 'Select',
    colProps: {
      span: 4
    },
    componentProps: {
      filterable: true, // 启用搜索功能
      clearable: true,
      options: [
        {
          label: '智能客服助手',
          value: '1'
        },
        {
          label: '内涝监测助手',
          value: '2'
        }
      ],
      filterOption: (input: string, option: { label: string; value: string }) => {
        return option.label.toLowerCase().includes(input.toLowerCase()) // 实现自定义过滤逻辑
      }
    }
  },
  {
    field: 'userAccount',
    label: '用户账号',
    colProps: {
      span: 4
    },
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'createTime',
    label: '创建时间',
    component: 'DatePicker',
    colProps: {
      span: 4
    },
    componentProps: {
      type: 'date',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    value: dayjs().format('YYYY-MM-DD')
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
      label: '应用名称',
      field: 'applicationName'
    },
    {
      label: '用户账号',
      field: 'userAccount'
    },
    {
      label: '客户端',
      field: 'client'
    },
    {
      label: '会话编号',
      field: 'sessionNumber'
    },
    {
      label: '创建时间',
      field: 'createTime',
      minWidth: '100px',
      formatter: (row: any) => {
        // 时间格式化
        return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      label: '处理总用时',
      field: 'processingTime',
      formatter: (row: any) => {
        return row.processingTime || '' + 'ms'
      }
    },
    {
      label: '输入总tokens数量',
      field: 'enterTokens'
    },
    {
      label: '输出总tokens数量',
      field: 'OutputTokens'
    },
    {
      field: 'action',
      label: '操作',
      width: '100px',
      slots: {
        default: (data: any) => {
          return (
            <>
              <TableButtonList
                row={data.row}
                list={getTableButtonAction(btnAction)}
              />
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
      color: 'red',
      callback: (clickRow) => btnAction('详情', clickRow)
    }
  ]
}
