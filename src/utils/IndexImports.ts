// // ts表单配置对象类型，不强制使用
// //搜索组件
// export { Search } from '@/components/Search';
// // 查询组件 方法
// export { useSearch } from '@/hooks/web/useSearch';
//  // 文字国际化，不强制使用
// export { useI18n } from '@/hooks/web/useI18n';
// // 表格左上角按钮部分组件
// export { tableTitle } from '@/components/tableTitle';
// // 表格组件
// export { Table } from '@/components/Table';
// //表格hooks
// export { useTable } from '@/hooks/web/useTable';
// // 弹窗组件
// export { Dialog } from '@/components/Dialog';
// // 配置页面各组件内容大对象，必备
// export { type tableSchema, useTableSchemas } from '@/hooks/web/useTableSchemas';
// // 按钮组件
// export { BaseButton } from '@/components/Button';
// // 按钮列表
// export {ButtonList} from '@/components/ButtonList';
// // 导入组件
// export { Import } from '@/components/Import';
// // 请求方法
// export { commonGetData, commonPostData, dealParams } from '@/utils/request';
// // 导出文件方法
// export { default as fileExport } from '@/utils/fileExports';
//  // 防抖和乘法
// export { debounce, multiply } from 'lodash-es';
// // 消息提示
// export { useMessage } from '@/hooks/web/useMessage';
//  //更多组件
// export { CheckMore } from '@/components/CheckMore';
//  //全局配置的动作点权限code
// export {default as  permissionCode } from '@/utils/permissionCode';
export type { FormSchema } from '@/components/Form'
export type { TableColumn } from '@/components/Table'
export { Table } from '@/components/Table'
export { cloneDeep,debounce,throttle } from 'lodash-es'
export { default as dayjs } from 'dayjs'
export  { useVModel } from '@vueuse/core'
export const importImg = (url) => {
  return new URL(`../assets/imgs/${url}`, import.meta.url).href
}
