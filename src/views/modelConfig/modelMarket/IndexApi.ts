enum API {
  //数据列表
  // FetchData = 'StyleManage/styleTemplate',
  FetchData = 'a76ee5df2fccdab93b74af25fcd205ee',
  //新增
  Save = '',
  // 编辑
  Edit = '45287d729f812e4a0cc7286c1f9526d4',
  //删除
  Delete = ''
}
// get\post接口
import { apiGetData, apiPostData, getJSONData } from '@/utils/request'

/**
 *
 *  Index.vue 中调用
 *
 */
// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  return apiGetData(API.FetchData, params)
  // return getJSONData(API.FetchData)
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
