import { Icon } from '@/components/Icon'
import { TableButtonList } from '@/components/TableButtonList'
import { ElButton } from 'element-plus'
import { getServiceName } from '../ConfigurationManagement/IndexApi'
export const getSearchSchema: FormSchema[] = [
  {
    field: 'serviceName',
    label: '名称',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'serviceProvider',
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
    field: 'account',
    label: '使用账号',
    component: 'Input',
    ConditionalType: '*'
  },
  {
    field: 'clientIP',
    label: '客户端IP',
    component: 'Input',
    ConditionalType: '*'
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
      field: 'serviceProvider'
    },
    {
      label: '形象',
      field: 'image',
      slots: {
        default: (data: any) => {
          return (
            <img
              src={data.row.image}
              class="v-middle"
              style={`width: 40px; height: 40px; object-fit: cover; object-position: top;`}
              onClick={(e) => {
                e.stopPropagation()
                btnAction('预览', data.row)
              }}
            />
          )
        }
      }
    },
    {
      label: '使用账号',
      field: 'account'
    },
    {
      label: '客户端IP',
      field: 'clientIP',
      slots: {
        default: (data: any) => {
          return (
            <>
              <div class={'flex items-center'}>
                <span>{data.row.clientIP}</span>
                <span class={'flex pointer'} onClick={() => btnAction('复制', data.row.clientIP)}>
                  <Icon icon={'svg-icon:app-copyBtn'} size={18} />
                </span>
              </div>
            </>
          )
        }
      }
    },
    {
      label: '开始使用时间',
      field: 'startTime'
    },
    {
      label: '当前使用时长',
      field: 'useTime'
    },
    {
      field: 'action',
      label: '操作',
      width: '80px',
      align: 'left',
      slots: {
        default: (data: any) => {
          return (
            <>
              <div onClick={(e) => e.stopPropagation()}>
                <el-popconfirm
                  width="240"
                  placement="bottom-end"
                  title={`确定下线该数字人实例吗？`}
                  onConfirm={() => btnAction('下线', data.row)}
                >
                  {{
                    reference: () => {
                      return (
                        <ElButton link plain type="danger" v-actPermission={permissionCode.EDIT}>
                          <Icon size={18} icon="svg-icon:table-offline" class="m-3px" />
                          下线
                        </ElButton>
                      )
                    }
                  }}
                </el-popconfirm>
              </div>
            </>
          )
        }
      }
    }
  ]
}
export function getTableButtonAction(btnAction: (title: string, row?: any) => void) {
  return []
}
type TableButton = {
  label: string
  code: string
  callback: () => void
}
export function getTableButtonList(btnAction: (title: string, row?: any) => void): TableButton[] {
  return []
}
