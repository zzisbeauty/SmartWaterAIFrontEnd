// api枚举
enum API {
  FetchData = 'DigitalHuman/RealTime',
}
// get\post接口
import { apiGetData, apiPostData ,getJSONData} from '@/utils/request'
// 查询列表
export const handleGetTableList = (params) => {
  return getJSONData(API.FetchData)
}

