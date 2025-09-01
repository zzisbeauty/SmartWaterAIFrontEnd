import { useI18n } from '@/hooks/web/useI18n'
import { FormItemRule } from 'element-plus'

const { t } = useI18n()

interface LengthRange {
  min: number
  max: number
  message?: string
}
// 是否为空，是返回true，内部方法，不用作校验用途
const isNull = (obj) => {
  const controlObj = obj?.trim()
  if (controlObj?.length == 0 || controlObj == null || controlObj == undefined) {
    return true
  } else {
    return false
  }
}
// 身份证校验码验证
function validateIdCardChecksum(idCard) {
  // 如果是15位身份证，先转换为18位
  if (idCard.length === 15) {
    idCard = convertTo18IdCard(idCard)
    if (!idCard) {
      return false // 转换失败，返回false
    }
  }

  // 确保身份证号码长度达到了18位
  if (idCard.length !== 18) {
    return false
  }

  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checksumMapping = {
    0: '1',
    1: '0',
    2: 'X',
    3: '9',
    4: '8',
    5: '7',
    6: '6',
    7: '5',
    8: '4',
    9: '3',
    10: '2'
  }

  let total = 0
  for (let i = 0; i < 17; i++) {
    total += parseInt(idCard[i]) * factors[i]
  }

  const remainder = total % 11
  const checksum = checksumMapping[remainder]

  return idCard[17].toUpperCase() === checksum
}
// 将15位身份证号码转换为18位
function convertTo18IdCard(idCard15) {
  if (idCard15.length !== 15) {
    return null // 不是15位身份证号码，返回null
  }

  const idCard17 = idCard15.slice(0, 6) + '19' + idCard15.slice(6)
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

  let total = 0
  for (let i = 0; i < 17; i++) {
    total += parseInt(idCard17[i]) * factors[i]
  }

  const remainder = total % 11
  const checksumMapping = {
    0: '1',
    1: '0',
    2: 'X',
    3: '9',
    4: '8',
    5: '7',
    6: '6',
    7: '5',
    8: '4',
    9: '3',
    10: '2'
  }
  const checksum = checksumMapping[remainder]

  return idCard17 + checksum
}
export const useValidator = () => {
  // 不能为空
  const required = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      required: true,
      message: message || t('common.required'),
      trigger: trigger
    }
  }
  // 长度
  const lengthRange = (options: LengthRange, trigger: string = 'blur'): FormItemRule => {
    const { min, max, message } = options

    return {
      min,
      max,
      message: message || t('common.lengthRange', { min, max }),
      trigger: trigger
    }
  }
  // 不能含有空格
  const notSpace = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (val?.indexOf(' ') !== -1) {
          callback(new Error(message || t('common.notSpace')))
        } else {
          callback()
        }
      },
      trigger: trigger
    }
  }
  // 不能含有特殊字符
  const notSpecialCharacters = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
          callback(new Error(message || t('common.notSpecialCharacters')))
        } else {
          callback()
        }
      },
      trigger: trigger
    }
  }
  // 数字或空
  const isIntegerOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^[-+]?\d+$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '必须为数字'))
        }
      },
      trigger: trigger
    }
  }
  // 判断输入的字符是否为中文 cchar或者null,空
  const isChineseOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^[\u0391-\uFFE5]+$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '必须为中文字符'))
        }
      },
      trigger: trigger
    }
  }
  // 英文字符串或空
  const isEnglishStrOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^[a-z,A-Z]+$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '必须为英文字符'))
        }
      },
      trigger: trigger
    }
  }
  // 邮箱或空
  const isEmailOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^\w{3,}@\w+(\.\w+)+$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '邮箱格式不正确'))
        }
      },
      trigger: trigger
    }
  }
  // 是否为座机号码或空
  const isTelephoneOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^(0\d{2,3}-){0,1}\d{7,8}$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '座机号不正确'))
        }
      },
      trigger: trigger
    }
  }
  // 是否为手机号码或空
  const isMobileOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || /^1(3|4|5|6|7|8|9)\d{9}$/gi.test(val)) {
          callback()
        } else {
          callback(new Error(message || '手机号格式不正确'))
        }
      },
      trigger: trigger
    }
  }
  //验证是否手机号或座机号码 mobile phone或者null,空
  // 不推荐，建议分开两个输入框
  const isMobileOrPhoneOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (
          isNull(val) ||
          /^1(3|4|5|6|7|8|9)\d{9}$/gi.test(val) ||
          /^(0\d{2,3}-){0,1}\d{7,8}$/gi.test(val)
        ) {
          callback()
        } else {
          callback(new Error(message || '手机号或座机号格式不正确'))
        }
      },
      trigger: trigger
    }
  }
  // 判断是否为身份证 idcard 或者 null、空
  const isIDCardOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
    const idCardRegex = /^(?:\d{15}|\d{17}[\dXx])$/
    return {
      validator: (_, val, callback) => {
        if (isNull(val) || (idCardRegex.test(val) && validateIdCardChecksum(val))) {
          callback()
        } else {
          callback(new Error(message || '身份证格式不正确'))
        }
      },
      trigger: trigger
    }
  }
// 判断单个IP是否是合法IPv4地址
const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipv4Regex.test(ip)) return false
  const parts = ip.split('.').map(Number)
  return parts.every(part => part >= 0 && part <= 255)
}
// 判断是否是合法的 IPv4 或 CIDR 网段
const isValidIPv4OrCIDR = (ip: string): boolean => {
  // 匹配单个IP或CIDR格式：如 192.168.1.1 或 192.168.1.0/24
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
  if (!ipRegex.test(ip)) return false

  // 分割 IP 和子网掩码部分
  const [ipPart, maskPart] = ip.split('/')

  // 校验 IP 部分是否合法
  const parts = ipPart.split('.').map(Number)
  if (parts.some(part => part < 0 || part > 255)) return false

  // 如果有子网掩码，校验是否在 0~32 范围内
  if (maskPart !== undefined) {
    const mask = Number(maskPart)
    if (mask < 0 || mask > 32) return false
  }

  return true
}
// 判断整个字符串是否是合法的逗号分隔IPv4地址或CIDR网段
const isValidCommaSeparatedIPv4List = (value: string): boolean => {
  if (!value) return true

  const ips = value.split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0)

  return ips.every(ip => isValidIPv4OrCIDR(ip))
}
  // 校验逗号分隔的IPv4地址列表或空
const isCommaSeparatedIPv4ListOrNull = (message?: string, trigger: string = 'blur'): FormItemRule => {
  return {
    validator: (_, val, callback) => {
      if (
        isNull(val) ||
        isValidCommaSeparatedIPv4List(val)
      ) {
        callback()
      } else {
        callback(new Error(message || '请输入合法的逗号分隔的IPv4地址或CIDR网段'))
      }
    },
    trigger
  }
}


  return {
    required,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    isIntegerOrNull,
    isChineseOrNull,
    isEnglishStrOrNull,
    isEmailOrNull,
    isTelephoneOrNull,
    isMobileOrNull,
    isMobileOrPhoneOrNull,
    isIDCardOrNull,
    isCommaSeparatedIPv4ListOrNull
  }
}
