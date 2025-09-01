import request from '@/axios'
import { useUserStoreWithOut } from '@/store/modules/user'
// 登录所需参数
const paramConfigs = {
  apiPrefix: import.meta.env.VITE_API_PREFIX,
  apiExcept: import.meta.env.VITE_API_EXCEPT,
  identityId: import.meta.env.VITE_IDENTITY_ID,
  identitySecret: import.meta.env.VITE_IDENTITY_SECRET
}
// 常用网关请求公共参数
const apiConfigs = {
  xaAppId: import.meta.env.VITE_XA_APPID,
  xaAppSecret: import.meta.env.VITE_XA_APPSECRET,
  xaEnvironment: 0
}

// 查询传参说明：为空时暂定为不传
export function dealParams(searchParams, searchSchema) {
  const searchParamsTrans = Object.assign({}, searchParams)
  for (let i = 0; i < searchSchema.length; i++) {
    const component = searchSchema[i]
    if (searchParamsTrans[component.field] && component?.ConditionalType) {
      switch (component.ConditionalType) {
        case '*': //全模糊
          searchParamsTrans[component.field] =
            component?.ConditionalType +
            searchParamsTrans[component.field] +
            component.ConditionalType
          break
        case 'left*': //左模糊
          searchParamsTrans[component.field] = '*' + searchParamsTrans[component.field]
          break
        case 'right*': //右模糊
          searchParamsTrans[component.field] = searchParamsTrans[component.field] + '*'
          break
        case 'timeRange': //范围查询
          searchParamsTrans[component.field + '_begin'] = searchParamsTrans[component.field][0]
          searchParamsTrans[component.field + '_end'] = searchParamsTrans[component.field][1]
          delete searchParamsTrans[component.field]
          break
        case 'multipleSelect': //多选select转为逗号分隔
          if (
            Array.isArray(searchParamsTrans[component.field]) &&
            searchParamsTrans[component.field].length
          ) {
            searchParamsTrans[component.field] = searchParamsTrans[component.field].join(',')
          } else {
            delete searchParamsTrans[component.field]
          }
          break
        case 'or': //OR条件查询
          if (component.keyWords && component.keyWords.length) {
            component.keyWords.map((e) => {
              searchParamsTrans[e + '_or'] = searchParamsTrans[component.field]
            })
          } else {
            searchParamsTrans[component.field + '_or'] = searchParamsTrans[component.field]
          }
          delete searchParamsTrans[component.field]
          break
        default: //大于、小于、不等
          searchParamsTrans[component.field] =
            component?.ConditionalType + searchParamsTrans[component.field]
      }
    }
  }
  return searchParamsTrans
}

export const loginApi = (formData) => {
  const params = {
    logincode: formData.username,
    password: formData.password,
    clientid: paramConfigs.identityId,
    clientsecret: paramConfigs.identitySecret,
    expirestime: '2592000'
  }
  return request.get({
    url: '/qkidentity/api/sso/login',
    params
  })
}

function replaceApiPrefix(str, replacement) {
  const rest = str.slice(paramConfigs.apiPrefix.length)
  return replacement + rest
}

export const commonPostData = (
  xaApiSecret: string,
  // query
  queryParams: Object,
  // body
  data: Object,
  CONTENT_TYPE: AxiosContentType = 'application/json' //默认为json
) => {
  // if(paramConfigs.apiExcept.indexOf(xaApiSecret) === -1){
  //   xaApiSecret =replaceApiPrefix(xaApiSecret,paramConfigs.apiPrefix)
  // }

  const params = {
    ...apiConfigs,
    xaApiSecret,
    ticket: useUserStoreWithOut().getTicket,
    ...queryParams
  }
  return request.post({
    url: '/quickapi/api/do/post',
    params,
    data,
    headers: { 'Content-Type': CONTENT_TYPE }
  })
}

export const commonGetData = (
  xaApiSecret: string,
  data: Object,
  CONTENT_TYPE: AxiosContentType = 'application/json' //默认为json
) => {
  // if(paramConfigs.apiExcept.indexOf(xaApiSecret) === -1){
  //   xaApiSecret =replaceApiPrefix(xaApiSecret,paramConfigs.apiPrefix)
  // }
  const params = {
    ...apiConfigs,
    xaApiSecret,
    ticket: useUserStoreWithOut().getTicket,
    ...data
  }
  return request.get({
    url: '/quickapi/api/do/get',
    params,
    headers: { 'Content-Type': CONTENT_TYPE }
  })
}
// export default { commonPostData }
export const apiGetData = (url, params) => {
  return request.get({
    url: `${import.meta.env.VITE_API_BUSINESS_PATH}` + url + `${import.meta.env.VITE_API_VERSION}/`,
    params,
    headers: { 'Content-Type': 'application/json', ticket: useUserStoreWithOut().getTicket }
  })
}
export const apiPostData = (
  url,
  data,
  params = {},
  config = {},
  ContentType = 'application/json'
) => {
  return request.post({
    url: `${import.meta.env.VITE_API_BUSINESS_PATH}` + url + `${import.meta.env.VITE_API_VERSION}/`,
    params,
    data,
    headers: { 'Content-Type': ContentType, ticket: useUserStoreWithOut().getTicket },
    ...config
  })
}
export const getJSONData = (jsonFieldName: string) => {
  return request.get({
    url: new URL(`${import.meta.env.VITE_BASE_PATH}/APIJSON/${jsonFieldName}.json`, import.meta.url)
      .href,
    headers: { 'Content-Type': 'application/json', ticket: useUserStoreWithOut().getTicket }
  })
}
