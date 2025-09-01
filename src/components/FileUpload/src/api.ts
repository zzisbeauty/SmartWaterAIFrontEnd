enum API {
  FileUpload = import.meta.env.VITE_UPLOAD_API
}
import { apiGetData, apiPostData } from '@/utils/request'

export const handleFileUpload = (file) => {
  return apiPostData(API.FileUpload, file, {}, {}, 'multipart/form-data')
}

// export const fileChange = async (res) => {
//     return handleFileUploadf({
//         file: res.file,
//         dataId:res.data.dataId
//     })
// }
