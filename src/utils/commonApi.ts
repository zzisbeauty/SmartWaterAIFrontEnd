// api枚举
enum API {
  //数据列表
  DICT = '7e4fd4aa0084dd4a4529f29f7fa1b6b8',
  FetchData = '26d179d352f6bb9f5aaf8c136dc210bd'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'

// 获取字典 --（策略分类）
export const handleFetchDict = () => {
  return apiPostData(API.DICT, {},{ pageNo:1,pageSize:-1,pid:'1913036751084085250'})
}
//根据分类 获取策略列表
export const handleFetchPolicyData = (params) => {
  return apiGetData(API.FetchData, params)
}



