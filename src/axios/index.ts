import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType, isApiTest } = option

  const userStore = useUserStoreWithOut()
  return service.request({
    url: url,
    method,
    params,
    data: data,
    isApiTest,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      // [userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '',
      ...headers
    }
  })
}

/**
 * 统一的 API 响应结构
 * @template T - 业务数据类型
 */
interface ResponseType<T> {
  code?: number
  message?: string
  result?: T
  success?: boolean
  timestamp?: number // 可选字段
}

/**
 * 统一的 API 分页数据结构
 */
interface ResultType {
  current?: number
  pages?: number
  records?: Array<any>
  size?: number
  total?: number
}

export default {
  get: <T = ResultType>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<ResponseType<T>>
  },
  post: <T = ResultType>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<ResponseType<T>>
  },
  delete: <T = ResultType>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<ResponseType<T>>
  },
  put: <T = ResultType>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<ResponseType<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
