// api枚举
enum API {
  //数据列表
  FetchData = '61ae3f79197c9112b776a2bf077b55fb',
  FetchStaticData = 'ASRManage/BasicInfoList',
  //新增
  Save = 'dbb0f8090c2bcc5ed1109e5e3c78efff',
  // 编辑
  Edit = 'c1e0fe156b4537ca4e9e0f4573bf85dc',
  //删除
  Delete = '813785d7bc95fdd3331a5ff29c73d74f',
  //导出
  Export = '313fe8cc4d9c73725a988cc3fe7ff05c'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'
// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  return apiGetData(API.FetchData, params)
}

// 新增
export const handleSave = (data) => {
  return apiPostData(API.Save, data)
}
// 编辑
export const handleEdit = (data) => {
  return apiPostData(API.Edit, data)
}

// 删除
export const handleDelete = (data) => {
  return apiPostData(API.Delete, {}, data)
}
// 导出
export const handleExport = (params) => {
  return apiGetData(API.Export, params)
}

// 静态数据
export const handleGetTableList = (query) => {
  return getJSONData(API.FetchStaticData)
}
