import { reactive } from 'vue'
import { eachTree, treeMap, filter } from '@/utils/tree'
import { FormSchema } from '@/components/Form'
import { TableColumn } from '@/components/Table'
import { DescriptionsSchema } from '@/components/Descriptions'

export type tableSchema = Omit<TableColumn, 'children'> & {
  search?: CrudSearchParams
  table?: CrudTableParams
  form?: CrudFormParams
  detail?: CrudDescriptionsParams
  children?: tableSchema[]
}

interface CrudSearchParams extends Omit<FormSchema, 'field'> {
  // 是否隐藏在查询项
  hidden?: boolean
}

interface CrudTableParams extends Omit<TableColumn, 'field'> {
  // 是否隐藏表头
  hidden?: boolean
}

interface CrudFormParams extends Omit<FormSchema, 'field'> {
  // 是否隐藏表单项
  hidden?: boolean
}

interface CrudDescriptionsParams extends Omit<DescriptionsSchema, 'field'> {
  // 是否隐藏表单项
  hidden?: boolean
}

interface AllSchemas {
  searchSchema: FormSchema[]
  tableColumns: TableColumn[]
  formSchema: FormSchema[]
  detailSchema: DescriptionsSchema[]
}

// 过滤所有结构
export const useTableSchemas = (
  tableSchema: tableSchema[]
): {
  allSchemas: AllSchemas
} => {
  // 所有结构数据
  const allSchemas = reactive<AllSchemas>({
    searchSchema: [],
    tableColumns: [],
    formSchema: [],
    detailSchema: []
  })

  const searchSchema = filterSearchSchema(tableSchema)
  // @ts-ignore
  allSchemas.searchSchema = searchSchema || []

  const tableColumns = filterTableSchema(tableSchema)
  allSchemas.tableColumns = tableColumns || []

  const formSchema = filterFormSchema(tableSchema)
  allSchemas.formSchema = formSchema

  const detailSchema = filterDescriptionsSchema(tableSchema)
  allSchemas.detailSchema = detailSchema

  return {
    allSchemas
  }
}

// 过滤 Search 结构
const filterSearchSchema = (tableSchema: tableSchema[]): FormSchema[] => {
  const searchSchema: FormSchema[] = []
  const length = tableSchema.length
  for (let i = 0; i < length; i++) {
    const schemaItem = tableSchema[i]
    // 判断是否隐藏
    if (schemaItem?.search) {
      const searchSchemaItem = {
        component: schemaItem?.search?.component || 'Input',
        ...schemaItem.search,
        field: schemaItem.field,
        label: schemaItem.search?.label || schemaItem.label
      }

      searchSchema.push(searchSchemaItem)
    }
  }

  return searchSchema
}

// 过滤 table 结构
const filterTableSchema = (tableSchema: tableSchema[]): TableColumn[] => {
  const tableColumns = treeMap<tableSchema>(tableSchema, {
    conversion: (schema: tableSchema) => {
      if (!schema?.table?.hidden) {
        return {
          ...schema,
          ...schema.table
        }
      }
    }
  })

  // 第一次过滤会有 undefined 所以需要二次过滤
  return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
    if (data.children === void 0) {
      delete data.children
    }
    return !!data.field
  })
}

// 过滤 form 结构
const filterFormSchema = (tableSchema: tableSchema[]): FormSchema[] => {
  const formSchema: FormSchema[] = []
  const length = tableSchema.length

  for (let i = 0; i < length; i++) {
    const formItem = tableSchema[i]
    const formSchemaItem = {
      component: formItem?.form?.component || 'Input',
      ...formItem.form,
      field: formItem.field,
      label: formItem.form?.label || formItem.label
    }

    formSchema.push(formSchemaItem)
  }

  return formSchema
}

// 过滤 descriptions 结构
const filterDescriptionsSchema = (tableSchema: tableSchema[]): DescriptionsSchema[] => {
  const descriptionsSchema: FormSchema[] = []

  eachTree(tableSchema, (schemaItem: tableSchema) => {
    // 判断是否隐藏
    if (!schemaItem?.detail?.hidden) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail,
        field: schemaItem.field,
        label: schemaItem.detail?.label || schemaItem.label
      }

      // 删除不必要的字段
      delete descriptionsSchemaItem.hidden

      descriptionsSchema.push(descriptionsSchemaItem)
    }
  })

  return descriptionsSchema
}
