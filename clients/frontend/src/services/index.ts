import Request from './request'
import { AxiosResponse } from 'axios'

import type { RequestConfig } from './request/types'

export interface YWZResponse<T> {
  code: number;
  data: T;
  message: string;
  success: boolean
}

// 重写返回类型
interface YWZRequestConfig<T, R> extends RequestConfig<YWZResponse<R>> {
  data?: T
}

const request = new Request({
  baseURL: import.meta.env.VITE_OPER_API,
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: config => {
      const token = localStorage.getItem('userToken') ?? ''
      return {
        ...config,
        headers: {
          Authorization: token
        }
      }
    },
    // 响应拦截器
    responseInterceptors: (result: AxiosResponse) => {
      return result
    },
  },
})

/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {YWZRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const xRequest = <D = any, T = any>(config: YWZRequestConfig<D, T>) => {
  const { method = 'GET' } = config
  if (method === 'get' || method === 'GET' || method === 'delete' || method === 'DELETE') {
    config.params = config.data
    config.params = { pageSize: 10, ...config.params,}
  } else {
    // @ts-ignore
    config.data = { pageSize: 10, ...config.data}
  }
  const response = request.request<YWZResponse<T>>(config)
  
  return response;
}
// 取消请求
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url)
}
// 取消全部请求
export const cancelAllRequest = () => {
  return request.cancelAllRequest()
}

export default xRequest