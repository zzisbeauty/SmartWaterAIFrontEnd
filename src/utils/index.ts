/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData
 */
export function objToFormData(obj: Recordable) {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}
// 获取url链接拼接的参数
export function getQueryObject(url: string) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
export function isValidJSONString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
// 减法运算
function getDecimalPlaces(num: number): number {
  const parts = num.toString().split('.')
  return parts.length === 2 ? parts[1].length : 0
}

export function calcSubtract(num1: any, num2: any): number | null {
  if (typeof num1 !== 'number' || isNaN(num1) || typeof num2 !== 'number' || isNaN(num2)) {
    return null
  }
  const l1 = getDecimalPlaces(num1)
  const l2 = getDecimalPlaces(num2)
  const m = Math.pow(10, Math.max(l1, l2))
  return (num1 * m - num2 * m) / m
}
export function formatNumber(num, count = 2) {
  if (!num) {
    return 0
  } else if (num % 1 === 0) {
    return num
  } else {
    return parseFloat(num.toFixed(count)) // 转换回数字
  }
}
export function dynamicCalculationWidth(prop, tableData, title, num = 0) {
  if (tableData.length === 0) {
    // 表格没数据不做处理
    return
  }
  let flexWidth = 0 // 初始化表格列宽
  let columnContent = '' // 占位最宽的内容
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = '14px Microsoft YaHei'
  if (prop === '' && title) {
    // 标题长内容少的，取标题的值,
    columnContent = title
  } else {
    // 获取该列中占位最宽的内容
    let index = 0
    for (let i = 0; i < tableData.length; i++) {
      const now_temp = tableData[i][prop] + ''
      const max_temp = tableData[index][prop] + ''
      const now_temp_w = context.measureText(now_temp).width
      const max_temp_w = context.measureText(max_temp).width
      if (now_temp_w > max_temp_w) {
        index = i
      }
    }
    columnContent = tableData[index][prop]
    // 比较占位最宽的值跟标题、标题为空的留出四个位置
    const column_w = context.measureText(columnContent).width
    const title_w = context.measureText(title).width
    if (column_w < title_w) {
      columnContent = title || '占位符'
    }
  }
  // 计算最宽内容的列宽
  const width = context.measureText(columnContent)
  flexWidth = width.width + 40 + num

  return flexWidth + 'px'
}
export const importAssetsImg = (url) => {
  return new URL(`@/assets/imgs/${url}.png`, import.meta.url).href
}
export const dealOptions = (options, props = { label: 'label', value: 'value' }) => {
  return options.map((item) => {
    return {
      label: item[props.label],
      value: item[props.value]
    }
  })
}

// 获取手机还是电脑登录
export function getDeviceType() {
  const userAgent = navigator.userAgent
  if (userAgent.match(/Android/i) || userAgent.match(/iPhone/i)) {
    return 'mobile'
  } else {
    return 'desktop'
  }
}
// 获取ip
export function getIP(callback) {
  const recordedIPs = {}
  const RTCPeerConnection =
    window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  if (!RTCPeerConnection) {
    console.error('浏览器不支持 RTCPeerConnection')
    return
  }

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  })

  function handleCandidate(candidate) {
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/
    const match = candidate.match(ipRegex)
    if (match && match[0] && !recordedIPs[match[0]]) {
      callback(match[0])
      recordedIPs[match[0]] = true
    }
  }

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      handleCandidate(event.candidate.candidate)
    } else {
      // 处理所有候选完成后的逻辑
      const lines = pc.localDescription?.sdp.split('\n') || []
      lines.forEach((item) => {
        if (item.startsWith('a=candidate:')) {
          handleCandidate(item)
        }
      })
    }
  }

  // 创建数据通道并生成 Offer
  pc.createDataChannel('')
  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .catch((error) => console.error('创建 Offer 失败:', error))
}
