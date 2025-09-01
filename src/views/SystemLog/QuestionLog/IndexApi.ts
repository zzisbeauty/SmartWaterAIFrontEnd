// api枚举
enum API {
  FetchData = 'SystemLog/QuestionLog', //数据列表 9522d8e791dff40bee205cbb994c3515
  Export = 're_j25syjfe40059' //导出
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'


// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  return getJSONData(API.FetchData)
  // return apiGetData(API.FetchData, { ...query })
}

// 导出
export const handleExport = (params) => {
  return apiGetData(API.Export, params)
}


