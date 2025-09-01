// api枚举
enum API {
  //数据列表
  FetchData = '98520761e9f23b202cefe1a3b146a856',
  FetchStaticData = 'ASRManage/ConfigurationManagementList',
  //新增
  Save = '540bfaf5f24202404e96f05ceb8f8017',
  // 编辑
  Edit = '5820e78292955260b5e8afbc87c0ffa3',
  //删除
  Delete = '559137567b7747b10184ef9fc0801d09',
  // 启停
  SwitchStatus = '5da326603ce4d2b42e76d398dc286d9a',
  //导出
  Export = 'daf00ca742dc2047961d311e2f9a6f7a',
  //保存热词表配置
  SaveHotWord = '8ec4a4a51aa33cff629a8681c87e109f',
  // 根据id获取热词表配置
  GetHotWord = 'af8da6712ea6b079b36d5cffc71586f6',
  //保存关键词配置
  SaveKeyword = '54efcca14c861da22faa99db5059ce83',
  //根据id获取关键词配置
  GetKeyword = '19005e9a96e0600f6481d584793dc8f5',
  // 获取服务名称
  GetServiceName = '61ae3f79197c9112b776a2bf077b55fb'
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
export const handleDelete = (params) => {
  return apiPostData(API.Delete, {}, params)
}
export const handleSwitchStatus = (data) => {
  return apiPostData(API.SwitchStatus, data)
}
// 导出
export const handleExport = (params) => {
  return apiGetData(API.Export, params)
}

// 保存热词表配置
export const handleSaveHotWord = (data, params) => {
  return apiPostData(API.SaveHotWord, data, params)
}
// 根据id获取热词表配置
export const handleGetHotWord = (params) => {
  return apiGetData(API.GetHotWord, params)
}
// 保存关键词配置
export const handleSaveKeyword = (data, params?) => {
  return apiPostData(API.SaveKeyword, data, params)
}
// 根据id获取关键词配置
export const handleGetKeyword = (params) => {
  return apiGetData(API.GetKeyword, params)
}

// 静态数据
export const handleGetTableList = (query) => {
  return getJSONData(API.FetchData)
}
// 获取服务名称
export const getServiceName = () => {
  return apiGetData(API.GetServiceName, { pageNo: 1, pageSize: -1 }).then((res) => {
    const list = res?.result?.records || []
    return list.map((item) => ({
      label: item.name || '未知服务',
      value: item.id
    }))
  })
}
