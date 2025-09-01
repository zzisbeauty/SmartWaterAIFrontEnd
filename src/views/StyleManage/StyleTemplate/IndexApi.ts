// api枚举
enum API {
  //数据列表
  FetchData = '14d7327539725d5a6fe2c8533b4671c3',
  //新增
  Save = '94c72a5950487c117bbcae5f6f6d9a08',
  // 编辑
  Edit = '49064f225e7d73f7dbb749f6369cd180',
  //删除
  Delete = '0ef9cf0664ddce3068ec30498add8f6d',
  //上传图片
  updateFile = 'f9941e255a4de9bb8a885055b0f5c4b9'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'
/**
 *
 *  Index.vue 中调用
 *
 */
// 请求数据、获取表格获取行内容
export const handleFetchData = (query) => {
  return apiGetData(API.FetchData, { ...query })
}

// 删除
export const handleDelete = (params) => {
  return apiPostData(API.Delete, {}, params)
}

/**
 *  在Edit.vue 中调用
 */
// 编辑、新增提交方法
export const handleSave = (data) => {
  return apiPostData(API.Save, data)
}
export const handleEdit = (data) => {
  return apiPostData(API.Edit, data)
}

