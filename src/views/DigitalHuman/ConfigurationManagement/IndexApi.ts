// api枚举
enum API {
  //数据列表
  FetchData = 'f3058a8fa1d5c508b11df98ced03fd1e',
  //新增
  Save = '45cfaf7dab75cd5787416e105f99e4b5',
  // 编辑
  Edit = '5c065c2050ba15e16d75df77941e470d',
  //删除
  Delete = '83704999090c1507b6a8022763b2330e',
  // 启停
  SwitchStatus = '9c3622f8111d73c1c26e64bdfbf3dcce',
  //导出
  Export = 'eb0aaa69360f45d635ad623e9367f1cb',
  // 获取服务名称
  GetServiceName = '2a3842a638f6b0c5b2a70d02e84702eb',
  // 获取数字人实例
  DigitalHumanExample = 'c7eebccbfcefdf3fe8143a8cca606475'
}
// get\post接口
import { apiGetData, apiPostData } from '@/utils/request'

// 请求数据、获取表格获取行内容
export const handleFetchData = (params) => {
  return apiGetData(API.FetchData, params)
}
// 新增
export const handleSave = (data) => {
  return apiPostData(API.Save, data)
}
// 编辑
export const handleEdit = (data) => {
  return apiPostData(API.Edit, data)
}
// 删除
export const handleDelete = (params) => {
  return apiPostData(API.Delete, {}, params)
}
// 启停
export const handleSwitchStatus = (data) => {
  return apiPostData(API.SwitchStatus, data)
}
// 导出
export const handleExport = (params) => {
  return apiGetData(API.Export, params)
}

// 获取服务名称
export const getServiceName = () => {
  return apiGetData(API.GetServiceName, { pageNo: 1, pageSize: -1 }).then((res) => {
    const list = res?.result?.records || []
    return list.map((item) => ({
      label: item.serviceName || '未知服务',
      value: item.id
    }))
  })
}
// 获取数字人实例
export const getDigitalHumanExample = (params) => {
  return apiGetData(API.DigitalHumanExample, params)
}
