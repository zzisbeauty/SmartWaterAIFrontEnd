import { placeholderSign } from 'element-plus/es/components/table-v2/src/private'
import component from 'virtual:svg-icons-register'


export function getTableButtonAction(btnAction: (title: string, row?: any) => void) {
  return [
    {
      label: '上移',
      icon: 'svg-icon:table-moveTop',
      code: permissionCode.VIEW,
      callback: (clickRow) => btnAction('上移', clickRow)
    },
    {
      label: '下移',
      code: permissionCode.VIEW,
      icon: 'svg-icon:table-moveBot',
      callback: (clickRow) => btnAction('下移', clickRow)
    },
    {
      label: '删除',
      icon: 'svg-icon:table-delete',
      code: permissionCode.VIEW,
      callback: (clickRow) => btnAction('删除', clickRow)
    }
  ]
}
export function getTableButtonAction_speak(btnAction: (title: string, row?: any) => void) {
  return [
    {
      label: '删除',
      icon: 'svg-icon:table-delete',
      code: permissionCode.VIEW,
      callback: (clickRow) => btnAction('删除', clickRow)
    }
  ]
}
export const getlinkTableConfig = () => {
  return {
    tableSchema: [
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
        label: '提示语',
        field: 'text'
      },

      {
        label: '接口名称',
        field: 'name'
      },

      {
        label: '所属分类',
        field: 'type'
      },

      {
        label: '业务系统',
        field: 'code'
      }
    ],
    searchSchema: [
      {
        label: '',
        field: 'text',
        component: 'Input',
        componentProps: { span: 6, placeholder: '请输入提示语' }
      },
      {
        label: '',
        field: 'name',
        component: 'Input',
        componentProps: { span: 6, placeholder: '请输入接口名称' }
      },
      {
        label: '',
        field: 'type',
        component: 'Select',
        componentProps: { span: 6, placeholder: '请选择所属分类' }
      },
      {
        label: '',
        field: 'code',
        component: 'Select',
        componentProps: { span: 6, placeholder: '请选择业务系统' }
      }
    ]
  }
}
