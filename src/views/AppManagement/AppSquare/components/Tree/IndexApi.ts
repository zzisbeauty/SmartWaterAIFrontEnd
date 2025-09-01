// api枚举
enum API {
    FetchData = '4aa2e28c95b63bbd38201de03847df5a'
    }
    // get\post接口
    import { apiGetData, apiPostData  } from '@/utils/request'


    /**
     *
     *  Index.vue 中调用
     *
     */
    // 查询API分类列表
    export const handleGetTreeList = async () => {
      const res:any = await apiGetData(API.FetchData, {})
      return res.result
    }