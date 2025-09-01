// api枚举
enum API {
  //数据列表
  FetchData = '2a3842a638f6b0c5b2a70d02e84702eb',
  //新增
  Save = '1603658b86a3e4e1622f23bbb5cacd6a',
  // 编辑
  Edit = 'ae8d5b468f74868d195736df2f32c192',
  //删除
  Delete = '48d1b3ac250d3713cb936020f48f5142',
  //导出
  Export = '41418ef86d9450cc602521a0880528a3'
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
