import type { CSSProperties } from 'vue'
import { RawAxiosRequestHeaders } from 'axios'
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type ComponentRef<T> = InstanceType<T>

  declare type LocaleType = 'zh-CN' | 'en'

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger'

  declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

  declare type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'
declare type SelectOption = {
    label: string;
    value: string;
  }   
  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  declare interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headers?: RawAxiosRequestHeaders
    responseType?: AxiosResponseType,
    isApiTest?: boolean
  }
  declare interface sqlfilterParams {
    [key: string]: sqlfilterParamsObj
  }
  interface pageParams {
    current: Number
    size: Number
    [key: string]: any
  }
  interface requestParams {
    objParams?: pageParams
    sqlfilterParams?: sqlfilterParams
  }
  //   .net版本请求参数
  declare interface sqlfilterParamsObj {
    FieldValue: any
    ConditionalType: number
    FieldType?: string //保留参数，如时间段查询ConditionalType 为3~4 ，在apiRequest中特殊处理该传参,
    FieldName?: string
  }
  declare interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
  }

  declare interface ThemeTypes {
    elColorPrimary?: string
    rightMenuBorderColor?: string
    rightMenuBgColor?: string
    rightMenuTopBgColor?: string
    rightMenuBgLightColor?: string
    rightMenuBgActiveColor?: string
    rightMenuCollapseBgActiveColor?: string
    rightMenuTextColor?: string
    rightMenuTopTextColor?: string
    rightMenuTextActiveColor?: string
    leftMenuBorderColor?: string
    leftMenuBgColor?: string
    leftMenuBgLightColor?: string
    leftMenuBgActiveColor?: string
    leftMenuCollapseBgActiveColor?: string
    leftMenuTextColor?: string
    leftMenuTextActiveColor?: string
    leftMenuTextHoverColor?: string
    logoTitleTextColor?: string
    logoBorderColor?: string
    topHeaderBgColor?: string
    topHeaderTextColor?: string
    topHeaderHoverColor?: string
    topToolBorderColor?: string
    partingLine?: string
  }
}
