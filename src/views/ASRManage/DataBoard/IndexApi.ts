// api枚举
enum API {
  //数据列表
  FetchData = '61ae3f79197c9112b776a2bf077b55fb',
  //导出
  Export = '313fe8cc4d9c73725a988cc3fe7ff05c'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'
// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  return apiGetData(API.FetchData, params)
}

// 导出
export const handleExport = (params) => {
  return apiGetData(API.Export, params)
}
