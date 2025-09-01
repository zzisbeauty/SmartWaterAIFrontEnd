enum API {
  // 获取知识库列表
  // FetchKnowledge = 'AppManage/KnowledgeList',
  FetchKnowledge = '9307d9455609abf91fa103905995ee28',
  //新增知识库
  Save = 'ac8bf117991736576cdea7e91231648e',
  // 编辑
  Edit = '168f38fd997d70f2a80f2997b830a406',
  // 删除
  Delete = 'fce8850409133782e40a445c1e493619',
  // 召回测试
  RetrievalTest = 'a2f7766a5da566f1aeff0369da30d1fb',
  // 获取知识库知识图谱详情
  KnowledgeGraph = '5b769dfde7e7561a2672b7c5af3e9338',

  // 通过知识库id获取文件列表  -- 自己
  FileList = 'KnowledgeMange/FileList',
  // FileList = '0b2cb443b0efd87ceeb8232c16a083bf',
  // 通过知识库id分页查询文档 -- 研究院
  FileListByO = 'ff509a723b07c42fc4afebf49f175005',
  // 新增知识库文档
  SaveFile = '21323d69c44ff596e13698d22e1990d4',
  // 通过id下载文档
  DownloadFile = '2a63490332034a148f50ccba7a22e760',
  // 删除知识库文档
  DeleteFile = '6d038650e9df7707bee39edf88fe2aec',
  // 文档启停
  SwitchFile = '19a83a553fb5e2f80444fe649bb9a0c9',
  // 文档解析
  ParseFile = '47ef7bdfe2f65f8cd5377da4ef90b8e3',
  // 文档切片查询
  FileSlice = '7e828a127a8d81cf0d411f4c886c06c8',
  // 文档切片状态切换
  SwitchFileSlice = 'b4589e79e2f4fcfa225ed68b3b52cf83'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'

// 获取知识库列表
export const handleFetchData = (params) => {
  // return getJSONData(API.FetchKnowledge)
  return apiGetData(API.FetchKnowledge, params)
}
// 知识库新增
export const handleSave = (data) => {
  return apiPostData(API.Save, data)
}
// 知识库编辑
export const handleEdit = (data) => {
  return apiPostData(API.Edit, data)
}
// 知识库删除
export const handleDelete = (data, params) => {
  return apiPostData(API.Delete, data, params)
}

// 知识库召回测试
export const handleRetrievalTest = (data) => {
  return apiPostData(API.RetrievalTest, data)
}

// 获取知识图谱
export const handleGetKnowledgeGraph = (params) => {
  return apiGetData(API.KnowledgeGraph, params)
}

// 通过知识库id获取知识库文档
export const handleFetchFileData = (params) => {
  // return getJSONData(API.FileList)
  // return apiGetData(API.FileList, params)
  return apiGetData(API.FileListByO, params)
}
// 新增知识库文档
export const handleSaveFile = (data) => {
  return apiPostData(API.SaveFile, data, {}, {}, 'form-data')
}
// 文档启停状态
export const switchStatusFile = (data) => {
  return apiPostData(API.SwitchFile, data)
}
// 文档下载
export const handleDownloadFile = (params) => {
  return apiGetData(API.DownloadFile, params)
}
// 文档删除
export const handleDeleteFile = (data = { docIdLis: '' }) => {
  return apiPostData(API.DeleteFile, data)
}
// 文档解析
export const handleParseFile = (data) => {
  return apiPostData(API.ParseFile, data)
}
// 文档切片查询
export const getFileSlice = (params) => {
  return apiPostData(API.FileSlice, {}, params)
}
// 文档切片状态切换
export const switchFileSlice = (data) => {
  return apiPostData(API.SwitchFileSlice, data)
}
