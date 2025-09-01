import { commonGetData, commonPostData, dealParams } from '@/utils/request'
enum API {
  FileUpload = import.meta.env.VITE_UPLOAD_API
}
export const handleFileUpload = (params) => {
  return commonPostData(String(API.FileUpload), {}, { ...params }, 'multipart/form-data')
}