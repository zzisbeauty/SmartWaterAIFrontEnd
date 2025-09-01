import { TableButtonList } from '@/components/TableButtonList'

export function getTableColumns(btnAction: (title: any, data: any) => void): TableColumn[] {
  return [
    {
      field: 'index',
      label: '序号',
      type: 'index'
    },
    {
      label: '名称',
      field: 'itemText'
    },
    {
      label: '值',
      field: 'itemValue'
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
    field: 'name',
    label: '名称',
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
