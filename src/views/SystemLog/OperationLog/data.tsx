import { Icon } from '@/components/Icon'
import { TableButtonList } from '@/components/TableButtonList'

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
      label: '日志类型',
      field: 'logType',
      slots: {
        default: (data: any) => {
          if (data.row.logType) {
            let tagType = ''
            let statusText = ''
            switch (data.row.logType) {
              case '1':
                tagType = 'success'
                statusText = '操作日志'
                break
              case '2':
                tagType = 'primary'
                statusText = '系统日志'
                break
              case '3':
                tagType = 'warning'
                statusText = '异常日志'
                break
            }
            return (
              <>
                <El-Tag type={tagType} link class="w-71px">
                  {statusText}
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
      label: '操作类型',
      field: 'operationType'
    },
    {
      label: '用户账号',
      field: 'userAccount'
    },
    {
      label: '用户名称',
      field: 'userName'
    },
    {
      label: '客户端IP',
      field: 'clientIP',
      minWidth: 120,
      slots: {
        default: (data: any) => {
          return (
            <>
              <div class={'flex items-center'}>
                <span>{data.row.clientIP}</span>
                <span
                  class={"flex pointer"}
                  onClick={() => btnAction('复制', data.row.clientIP)}
                >
                  <Icon
                    icon={'svg-icon:app-copyBtn'}
                    size={18}
                  />
                </span>
              </div>
            </>
          )
        }
      }
    },
    {
      label: '请求方法',
      field: 'requestMethod',
      slots: {
        default: (data: any) => {
          if (data.row.requestMethod) {
            let tagType = ''
            let statusText = ''
            switch (data.row.requestMethod) {
              case 'POST':
                tagType = 'success'
                statusText = 'POST'
                break
              case 'GET':
                tagType = 'primary'
                statusText = 'GET'
                break
              case 'DELETE':
                tagType = 'danger'
                statusText = 'DELETE'
                break
              default:
                tagType = 'warning'
                statusText = 'ORDER'
            }
            return (
              <>
                <El-Tag type={tagType} link class="w-71px">
                  {statusText}
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
      label: '请求路径',
      field: 'requestPath',
      slots: {
        default: (data: any) => {
          return (
            <>
              <div class={'flex items-center'}>
                <span>{data.row.requestPath}</span>
                <span
                  class={"flex pointer"}
                  onClick={() => btnAction('复制', data.row.requestPath)}
                >
                  <Icon
                    icon={'svg-icon:app-copyBtn'}
                    size={18}
                  />
                </span>
              </div>
            </>
          )
        }
      }
    },
    {
      label: '请求参数',
      field: 'requestParameters',
      slots: {
        default: (data: any) => {
          return (
            <El-Button
              type="text"
              onClick={() => btnAction('请求参数', data.row)}
              class="request-params-button"
            >
              {data.row.requestParameters}
            </El-Button>
          )
        }
      }
    },
    {
      label: '请求类型',
      field: 'requestType'
    },
    {
      label: '耗时',
      field: 'timeConsuming'
    },
    {
      label: '操作时间',
      minWidth: '120px',
      field: 'operatingTime'
    },
    {
      field: 'action',
      label: '操作',
      align:'left',
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
export function getTableButtonAction(btnAction: (title: string, row?: any) => void) {
  return [
    {
      label: '详情',
      code: permissionCode.VIEW,
      icon: 'svg-icon:table-details',
      callback: (clickRow) => btnAction('详情', clickRow)
    }
  ]
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
