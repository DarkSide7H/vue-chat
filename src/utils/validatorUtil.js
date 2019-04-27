/**
 * 纯判断验证器
 * Created by Administrator on 2017/3/3.
 */
import lodash from 'lodash'
import IDValidator from 'id-validator'
import moment from 'moment'

// 小数点后的长度
const decimalLength = (value) => {
  const str = String(value)
  if (str.indexOf('.') >= 0) {
    return str.substr(str.indexOf('.') + 1).length
  }
  return 0
}

// 小数整数长度
export function intLength(value) {
  const str = String(value)
  if (str.indexOf('.') >= 0) {
    return str.substring(0, str.indexOf('.')).length
  }
  return str.length
}

// 手机号验证
export function isPhoneUtil(value) {
  if (empty(value)) {
    return true
  }
  return /(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(value)
}

export function isPhoneOrTelUtil(value) {
  return isPhoneUtil(value) || isTel(value)
}

// 手机验证方法
export function isPhoneAlias(value) {
  if (empty(value)) {
    return true
  }
  return /^\d{11}$/.test(value)
}

// 电话的验证方法
export function isTel(value) {
  if (empty(value)) {
    return true
  }
  return /^[ \-0-9]{7,20}$/.test(value)
}

// 密码验证
export function ispwd(value) {
  if (empty(value)) {
    return true
  }
  return /^[\w]{6,12}$/.test(value)
}

// 手机号必填
export function isPhoneRequired(value) {
  return /(^1[3|4|5|7|8|9][0-9]{9}$)/.test(value)
}

// 验证码必填
export function isvalidatequired(value) {
  return /^\d{6}$/.test(value)
}

// 文本必填
export function isTextquired(value) {
  if (empty(value)) {
    return false
  }
  return true
}

// 小数型 字符串
export function isNumberStringUtil(value) {
  if (empty(value)) {
    return true
  }
  return /^-?\d+(\.\d*)?$/.test(value)
}

// 整型 字符串
export function isIntegerStringUtil(value) {
  if (empty(value)) {
    return true
  }
  return /^-?\d+$/.test(value)
}

// 范围验证
export function rangeUtil(value, min, max, string = false) {
  if (empty(value) && String(value) !== '0') {
    return true
  }
  if (!string && isNumberStringUtil(value)) {
    const number = parseFloat(value)
    if (min !== undefined && max !== undefined) {
      return number >= min && number <= max
    } else if (max === undefined) {
      return number >= min
    } else if (min === undefined) {
      return number <= max
    }
    return false
  }
  const strLength = value.length
  if (min !== undefined && max !== undefined) {
    return strLength >= min && strLength <= max
  } else if (max === undefined) {
    return strLength >= min
  } else if (min === undefined) {
    return strLength <= max
  }
}

// 满足规定长度的小数型字符串
export function isFormatNumberStringUtil(value, decimal = 2, int) {
  if (empty(value)) {
    return true
  }
  if (int) {
    return isNumberStringUtil(value) && decimalLength(value) <= decimal && intLength(value) <= int
  }
  return isNumberStringUtil(value) && decimalLength(value) <= decimal
}

// 全是中文
export function isChinese(value) {
  if (empty(value)) {
    return true
  }
  return /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value)
}

// 不能是英文
export function isNotChinese(value) {
  if (empty(value)) {
    return true
  }
  return /[a-zA-Z0-9\u4e00\u9fa5-\uffff]+$/.test(value)
}

// 只能英文+字符串
export function isEnglishOrNumber(value) {
  if (empty(value)) {
    return true
  }
  return /[a-zA-Z0-9]+$/.test(value)
}

// 只能是英文
export function isEnglish(value) {
  if (empty(value)) {
    return true
  }
  return /[a-zA-Z]+$/.test(value)
}

// 是否为空
export function empty(value) {
  const type = typeof value
  if (type === 'number') {
    return value === 0
  } else if (type === 'boolean') {
    if (value === true) {
      return false
    }
  }
  return lodash.isEmpty(value)
}

// 是否是方法
export function isFunction(value) {
  return lodash.isFunction(value)
}

// 正常文字(汉字. 英文)， 排除特殊符号
export function isTextUtil(value) {
  if (empty(value)) {
    return true
  }
  return /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value)
}

// 正常文字(汉字. 英文. 数字)， 排除特殊符号
export function isTextEnglishUtil(value) {
  if (empty(value)) {
    return true
  }
  return /^[a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value)
}

// 正常文字(汉字. 英文. 数字)， 少量特殊符号
export function isTextEnglishWithEspecialUtil(value) {
  if (empty(value)) {
    return true
  }
  return /^[a-zA-Z._@0-9\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value)
}

// 判断是否有空格
export function eliminateSpaceUtil(value) {
  return !/\s+/.test(value)
}

// 判断是否是身份证
export function isID(value) {
  if (empty(value)) {
    return true
  }
  const validator = new IDValidator()
  return validator.isValid(value)
}

// 是正则
export function isRegExp(val) {
  return lodash.isRegExp(val)
}

// 判断一个时间断是否包含另一个时间段
export function isNotIntersectTime(inputStartTime, inputEndTime, startTime, endTime) {
  // 前相交
  if (moment(inputStartTime).isBefore(moment(startTime), 'day') && moment(inputEndTime).isAfter(moment(startTime), 'day')) {
    return false
  }
  // 后相交
  if (moment(inputStartTime).isBefore(moment(endTime), 'day') && moment(inputEndTime).isAfter(moment(endTime), 'day')) {
    return false
  }
  // 被包含
  if (moment(inputStartTime).isAfter(moment(endTime), 'day') && moment(inputEndTime).isBefore(moment(endTime), 'day')) {
    return false
  }
  // 有重叠的天
  if (moment(inputStartTime).isSame(moment(endTime), 'day') || moment(inputStartTime).isSame(moment(startTime), 'day') || moment(inputEndTime).isSame(moment(startTime), 'day') || moment(inputEndTime).isSame(moment(endTime), 'day')
  ) {
    return false
  }
  return true
}

function _chTimeIntervalToNumber(str) {
  switch (str) {
    case 'ch_forenoon' :
      return 1
    case 'ch_afternoon' :
      return 2
    case 'ch_evening' :
      return 3
  }
}

// 一个特殊的字典比较 上午(ch_forenoon) < 下午(ch_afternoon) < 晚上(ch_evening)
export function chTimeIntervalGT(a, b) {
  let _a = _chTimeIntervalToNumber(a)
  let _b = _chTimeIntervalToNumber(b)
  return _a > _b
}

export function isvalidUsername(str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  if (empty(textval)) {
    return true
  }
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  /* eslint-disable no-useless-escape */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export default {
  isPhoneUtil,
  isPhoneAlias,
  isTel,
  isNumberStringUtil,
  isIntegerStringUtil,
  isFormatNumberStringUtil,
  rangeUtil,
  isChinese,
  isEnglish,
  empty,
  isFunction,
  isTextUtil,
  eliminateSpaceUtil,
  isTextEnglishWithEspecialUtil,
  isID,
  isRegExp,
  isNotChinese,
  isPhoneOrTelUtil,
  isNotIntersectTime,
  validateURL,
  isEnglishOrNumber
}
