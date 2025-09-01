// api枚举
enum API {
    GetTree = 're_cf24f8f1fcfcdb15',
    TreeAdd = 're_10d9c4ac7b422b93',
    DelTreeNode = 're_98a68930860cadbb',
    TreeEdit='re_a98e51a5d5c90945'
}
// get\post接口
import { commonGetData, commonPostData, dealParams } from '@/utils/request'


// 获取左侧树
export const getTreeData = (query) => {
    return commonPostData(API.GetTree, { ...query }, {})
}
//   编辑树
export const handleLeftAdd = (params) => {
    return commonPostData(API.TreeAdd, {}, { ...params })
  }
  export const handleDelete = (params) => {
    return commonPostData(API.DelTreeNode, {...params}, { })
  }
export const handleLeftEdit = (params) => {
    return commonPostData(API.TreeEdit, {}, { ...params })
}



