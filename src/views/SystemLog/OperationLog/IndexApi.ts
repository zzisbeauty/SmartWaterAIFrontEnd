// api枚举
enum API {
  //数据列表
  FetchData = 'SystemLog/OperationLog',
  //导出
  Export = 're_j25syjfe40059',
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'
// 查询列表
export const handleGetTableList = (query) => {
  return getJSONData(API.FetchData)
}
export const handleDeleteApi = (query) => {
  return new Promise((resolve, reject) => {})
}

/**
 *
 *  Index.vue 中调用
 *
 */
// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  // , column: 'sort', order: 'desc'
  return apiGetData(API.FetchData, params)
}






