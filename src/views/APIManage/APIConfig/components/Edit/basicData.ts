import { pa } from 'element-plus/es/locale'

//api 发布基础表单数据
export const initApiFromData = {
  baseInfo: {
    apiCode: '',
    apiName: '',
    categoryId: '1',
    businessSystemCode: 'bcs',
    apiDesc: '',
    type: '1',
    requestType: 'GET',
    apiSecret: '',
    url: '',
    linkUrl: '',
    resultType: ''
  },
  paramInfo: [
    {
      apiId: '',
      paramName: '',
      paramType: 'string',
      paramDesc: '',
      paramLocation: 'query',
      paramOrder: 0,
      required: '0',
      sample: '',
      createBy: '',
      createTime: '',
      updateBy: '',
      updateTime: ''
    }
  ],
  questionInfo: [
    {
      apiId: '',
      questionContent: '',
      createBy: '',
      createTime: '',
      updateBy: '',
      updateTime: ''
    }
  ],
  linkInfo: [],
  linkInfoNo: 1,
  speakInfo: '',
  styleInfo: [
    {
      resultType: '',
      styleId: '',
      styleName: '',
      styleScheme: '',
      styleType: ''
    }
  ]
}

// 树形结构转json
export const treeToJson = (tree) => {
  let result = {}

  for (const node of tree) {
    const key = node.key
    let value

    if (node.children && node.children.length > 0) {
      // 递归处理子节点
      if (node.type === 'array') {
        value = [treeToJson(node.children)]
      } else {
        value = treeToJson(node.children)
      }
    } else {
      // 根据类型设置默认值
      switch (node.type) {
        case 'string':
          value = ''
          break
        case 'number':
          value = 0
          break
        case 'boolean':
          value = false
          break
        case 'object':
          value = {}
          break
        case 'array':
          value = []
          break
        default:
          value = null
      }
    }
    if (key === 'ITEMS' || key === '根节点') {
      result = value
    } else {
      result[key] = value
    }
  }
  return result
}
