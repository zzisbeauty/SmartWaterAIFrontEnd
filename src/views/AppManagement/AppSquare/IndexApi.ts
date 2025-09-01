// api枚举
enum API {
  // 应用
  FetchData = 'fb71d602be7e9665be5539aa6fa4757c',
  // 应用详情
  GetAppDetail = 'c2ddee07ea194282f026051bb779e546',
  // APPFetchData = 'AppManage/APPList',
  // 新增
  Save = 'b04d5913d08316f17bf5d458b0980546',
  // 编辑
  Edit = '45ca50df4853aee1ced5e32a21c5b1a7',
  // 删除
  Delete = '780f70faba8c63dc1ff527482e406642',
  // 正式API网关
  APIList = 'f9384b5f7e93e55f6d8bf5cc80b1f4f3',
  // 当前设置API
  // APIFetchData = 'AppManage/APIList',
  APIFetchData = 'f51c2a56dbf3bfae45edbeccf0b4ece4',
  // ASRFetchData = 'AppManage/ASRList',
  ASRFetchData = '98520761e9f23b202cefe1a3b146a856',
  // ModelFetchData = 'AppManage/ModelList',
  ModelFetchData = 'a76ee5df2fccdab93b74af25fcd205ee',
  // DigitalFetchData = 'AppManage/DigitalList',
  DigitalFetchData = 'f3058a8fa1d5c508b11df98ced03fd1e',
  // KnowledgeFetchData = 'AppManage/KnowledgeList'
  KnowledgeFetchData = '9307d9455609abf91fa103905995ee28'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'

// 获取本地APP列表
export const handleGetAppList = (params) => {
  return apiGetData(API.FetchData, params)
  // return getJSONData(API.APPFetchData)
}
// 通过id获取APP详情
export const handleGetAppDetail = (params) => {
  return apiGetData(API.GetAppDetail, params)
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
// 正式api列表接口
export const handleGetAPITree = (query) => {
  return apiGetData(API.APIList, { ...query, column: 'createTime', order: 'asc' })
}

// 查询API列表
export const handleGetAPIList = (params) => {
  return apiGetData(API.APIFetchData, params)
  // return getJSONData(API.APIFetchData)
}

// 查询asr列表
export const handleGetASRList = (params) => {
  // return getJSONData(API.ASRFetchData)
  return apiGetData(API.ASRFetchData, params)
}
// 模型列表
export const handleGetModelList = (params) => {
  // return getJSONData(API.ModelFetchData)
  return apiGetData(API.ModelFetchData, params)
}
// 数字人列表
export const handleGetDigitalList = (params) => {
  // return getJSONData(API.DigitalFetchData)
  return apiGetData(API.DigitalFetchData, params)
}
// 知识库列表
export const handleGetKnowledgeList = (params) => {
  // return getJSONData(API.KnowledgeFetchData)
  return apiGetData(API.KnowledgeFetchData, params)
}
