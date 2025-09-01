import { TableButtonList } from '@/components/TableButtonList'
import { getDigitalHumanExample, getServiceName } from './IndexApi'

export const getSearchSchema: FormSchema[] = [
  /* {
    field: 'digitalHumanId__dictText',
    label: '数字人实例',
    component: 'Input',
    ConditionalType: '*'
  }, */
  {
    field: 'serviceId',
    label: '服务名称',
    component: 'Select',
    componentProps: {
      options: [],
    },
    optionApi: async () => {
      const res = await getServiceName()
      return res || []
    }
  },
  {
    field: 'status',
    label: '状态',
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
  }
]
export function getTableColumns(btnAction: (title: any, data: any) => void): TableColumn[] {
  return [
    {
      label: '序号',
      field: 'index',
      type: 'index'
    },
    /* {
      label: '数字人名称',
      field: 'name'
    }, */
    {
      label: '数字人实例',
      field: 'digitalHumanId_dictText'
    },
    {
      label: '服务名称',
      field: 'serviceId_dictText'
    },
    {
      label: '形象',
      field: 'imageUrl',
      slots: {
        default: (data: any) => {
          return (
            <img
              src={data.row.imageUrl}
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
      label: '音色',
      field: 'voice_dictText'
    },
    {
      label: 'token过期时间',
      field: 'tokenExpirationTime'
    },
    {
      label: '支持远程失效',
      field: 'supportLoseEfficacy',
      slots: {
        default: (data: any) => {
          return (
            <el-tag class="w-48px" type={data.row.supportLoseEfficacy ? 'primary' : 'danger'}>
              {data.row.supportLoseEfficacy_dictText}
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
                title={`确定${!data.row.status ? '禁用' : '启用'}该数字人实例吗？`}
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
export const uploadedFile = reactive<{ fileUrl; fileId }>({ fileUrl: '', fileId: '' })
export const digitalHumanOptions = ref([])
export const voiceOptions = ref([])
export function getEditSchema(setValue: ({}) => void): FormSchema[] {
  return [
    {
      field: 'serviceId',
      label: '服务名称',
      component: 'Select',
      colProps: {
        span: 24
      },
      componentProps: {
        options: [],
        clearable: true,
        filterable: true,
        on: {
          change: async (value) => {
            setValue({ digitalHumanId: '', voice: '' })
            uploadedFile.fileUrl = ''
            uploadedFile.fileId = ''
            const example = await getDigitalHumanExample({ serviceId: value })
            const list: any = example?.result || []
            digitalHumanOptions.value = list
              .find((item) => item.targetName === '形象')
              ?.itemList.map((item) => {
                return {
                  label: item.text,
                  value: item.key,
                  imageUrl: item.remark
                }
              })
            voiceOptions.value = list
              .find((item) => item.targetName === '音色')
              ?.itemList.map((item) => {
                return {
                  label: item.text,
                  value: item.key
                }
              })
          }
        }
      },
      optionApi: async () => {
        const res = await getServiceName()
        return res || []
      }
    },
    {
      field: 'digitalHumanId',
      label: '数字人实例',
      component: 'Select',
      colProps: {
        span: 24
      },
      componentProps: {
        options: digitalHumanOptions,
        clearable: true,
        filterable: true,
        on: {
          change: (value) => {
            const item = digitalHumanOptions.value.find((item) => item.value === value)
            uploadedFile.fileUrl = item.imageUrl
            uploadedFile.fileId = item.key
          }
        }
      }
    },
    {
      field: 'voice',
      label: '音色',
      component: 'Select',
      colProps: {
        span: 24
      },
      componentProps: {
        options: voiceOptions,
        clearable: true,
        filterable: true
      }
    },
    {
      field: 'tokenExpirationTime',
      label: 'token过期时间',
      component: 'Input',
      colProps: {
        span: 24
      },
      componentProps: {
        type: 'number',
        slots: {
          suffix: () => '分钟'
        }
      }
    },
    {
      field: 'supportLoseEfficacy',
      label: '支持远程失效',
      component: 'RadioGroup',
      colProps: {
        span: 24
      },
      componentProps: {
        options: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ]
      },
      value: '1'
    },
    {
      field: 'status',
      label: '启停状态',
      colProps: {
        span: 24
      },
      component: 'Switch',
      componentProps: {
        activeValue: 1,
        inactiveValue: 0
      }
    }
  ]
}
const { required } = useValidator()
export const getEditSchemaRules = {
  serviceId: [required()],
  digitalHumanId: [required()],
  voice: [required()]
}
