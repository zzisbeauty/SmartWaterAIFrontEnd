// api枚举
enum API {
  FetchData = 'f51c2a56dbf3bfae45edbeccf0b4ece4', //获取列表
  Delete = '1708f9b3c2744380f25f38ce176026b2', //单行删除
  //批量删除
  MulDelete = '7b59055e9a1f4dfbfc01dae20a9def8c',
  GetDetail = 'b5f839ea525c67ed5d1af10408eec867', //获取详情
  SaveData = '0dfc0e83eab6da9b8e40fabd4842e909', //新增
  Export = '8f5ddeda30d8b03e9637bd8ed056637e', //导出
  GetFile = '19c5c68716fa3e6f2166e6220de1fcc5', //获取下载模板
  FileUpload = '1734e96826e6a2cc2e3b81a4137e6102', //导入

  linkFetchData = 'c541d1df7e395e9daad5af668c6077af', // 获取当前系统内的所有提问语

  styleFetchData = '14d7327539725d5a6fe2c8533b4671c3', // 获取样式类型列表
  EditData = 'cda58fe297d9b74cd00cfd8d3953201f' //编辑
}
export const stylehandleFetchData = (query) => {
  return apiGetData(API.styleFetchData, { ...query })
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'
// 查询列表
export const handleGetTableList = (query) => {
  return apiGetData(API.FetchData, { ...query })
}
export const handleGetlinkTableList = (query) => {
  return apiGetData(API.linkFetchData, { ...query })
}

// 新增保存信息
export const handleSaveData = (params) => {
  return apiPostData(API.SaveData, params)
}
// 编辑保存
export const handleEditData = (params) => {
  return apiPostData(API.EditData, params)
}
//获取详细信息
export const handleGetApiInfo = (params) => {
  return apiGetData(API.GetDetail, params)
}

//删除信息
export const handleDeleteApi = (params) => {
  return apiPostData(API.Delete, {}, params)
}
// 批量删除
export const handleMulDelete = (data) => {
  return apiPostData(API.MulDelete, {}, data)
}
// 发送 GET 请求获取模板文件
export const handleGetFile = () => {
  return apiGetData(API.GetFile, {})
}
// 导入上传文件
export const handleFileUpload = (params) => {
  return apiPostData(API.FileUpload, { ...params }, {}, {}, 'multipart/form-data')
}
// 导出文件方法
export const handleExport = (body) => {
  return apiPostData(
    API.Export,
    body,
    {},
    {
      responseType: 'blob'
    }
  )
}
