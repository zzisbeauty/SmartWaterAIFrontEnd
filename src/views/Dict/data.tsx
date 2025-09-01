import { TableButtonList } from '@/components/TableButtonList'

export function getTableColumns(btnAction: (title: any, data: any) => void): TableColumn[] {
  return [
    {
      field: 'index',
      label: '序号',
      type: 'index'
    },
    {
      label: '字典名称',
      field: 'dictName'
    },
    {
      label: '字典编码',
      field: 'dictCode'
    },
    {
      label: '描述',
      field: 'description'
    },

    {
      field: 'action',
      label: '操作',
      width: '230px',
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
export function getTableButtonAction(btnAction: (title: string, row?: any) => void) {
  return [
    // {
    //   label: '详情',
    //   code: permissionCode.VIEW,
    //   icon:'svg-icon:table-details',
    //   callback: (clickRow) => btnAction('详情',clickRow)
    // },
    {
      label: '字典配置',
      icon: 'svg-icon:table-config',
      code: permissionCode.MODIFY,
      callback: (clickRow) => btnAction('字典配置', clickRow)
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
export const getSearchSchema: FormSchema[] = [
  {
    field: 'dictName',
    label: '字典名称',
    component: 'Input',
    ConditionalType: '*'
  }
]

type TableButton = {
  label: string
  code: string
  callback: () => void
}
export function getTableButtonList(btnAction: (title: string) => void): TableButton[] {
  return [
    {
      label: '新增',
      code: permissionCode.ADD,
      callback: () => btnAction('新增')
    }
  ]
}
