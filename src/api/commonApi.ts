// api枚举
enum API {
  FileUpload = import.meta.env.VITE_UPLOAD_API,
  //数据列表
  DictAll = '61ae3f79197c9112b776a2bf077b55fb',
  DictById = 'd3d51919db795142ee038109d5fa5a41'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'

// 导入上传文件
export const handleFileUpload = (file) => {
  return apiPostData(API.FileUpload, { ...file }, {}, {}, 'multipart/form-data')
}

// 获取全部字典
export const getDictAllApi = (query) => {
  return apiPostData(API.DictAll, {}, { ...query })
}

// 获取单个字典
export const getDictById = (data) => {
  return apiGetData(API.DictById, {
    code: data.code,
    table: data.table || '',
    text: data.text || '',
    keys: data.keys || ''
  }).then((res: any) => {
    return res.result.map((item) => {
      return {
        label: item.text,
        value: item.value
      }
    })
  })
}
