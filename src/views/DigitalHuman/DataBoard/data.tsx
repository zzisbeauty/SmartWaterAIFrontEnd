export function getTableColumns(): TableColumn[] {
  return [
    {
      field: 'index',
      label: '序号',
      type: 'index'
    },
    {
      label: '数字人名称',
      field: 'name'
    },
    {
      label: '服务商',
      field: 'serviceProvider'
    },

   
    {
      label: '使用账号',
      field: 'account'
    },
    {
      label: '客户IP地址',
      field: 'ip'
    },
    {
      label: '开始使用时间',
      field: 'startTime',
      minWidth: 120
    },
    {
      label: '结束使用时间',
      field: 'endTime',
      minWidth: 120
    },
    {
      label: '使用时长',
      field: 'duration'
    }
  ]
}

