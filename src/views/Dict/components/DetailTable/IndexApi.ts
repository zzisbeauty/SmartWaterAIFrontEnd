// api枚举
enum API {
  FetchData = 'f71a2a86f49584dc228d3a57b9ee5cf0',
  Delete = '1868f8bce516540f6f7cecc3e515fa6b',
  GetDetail = '659097308d0980031adc39c26adcfe7b',
  Edit = '76851d51d89ceaee1d408bd0d399bf56',
  Add = 'c26dd777266417d25a72aefcda01a4df'
}
// get\post接口
import { apiGetData, apiPostData, getJSONData } from '@/utils/request'
// 查询列表
export const handleFetchData = (params) => {
  return apiGetData(API.FetchData, params)
}

// 编辑
export const handleEditData = (params) => {
  return apiPostData(API.Edit, { ...params })
}
// 新增
export const handleAddData = (params) => {
  return apiPostData(API.Add, { ...params })
}
// 切换

//获取详细信息
export const handleGetDetail = (params) => {
  return apiGetData(API.GetDetail, params)
}

//删除信息
export const handleDeleteData = (data) => {
  return apiPostData(API.Delete, {}, data)
}
