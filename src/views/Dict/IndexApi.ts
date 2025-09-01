// api枚举
enum API {
  FetchData = 'df58feacb5ced5c45006c71f5a636157',
  Delete = 'e3ff369c25ad2828406edf0cbabe7691',
  GetDetail = 'a62b610cef59fc78065d07b211cd2dda',
  Edit = '5ef89613895d31a6b5e19541562d8a29',
  Add = 'eccd4637d86966831e64be50c8aebe7e'
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
