import moment from 'moment'
import {dotData} from '@/utils'
import lodash from 'lodash'
// set function parseTime,formatTime to filter
import {empty, isIntegerStringUtil} from '@/utils/validatorUtil'
import store from 'store'
import {operationListKey} from '@/utils/auth.js'

export {parseTime, formatTime} from '@/utils'

export const truncate = lodash.truncate

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    {value: 1E18, symbol: 'E'},
    {value: 1E15, symbol: 'P'},
    {value: 1E12, symbol: 'T'},
    {value: 1E9, symbol: 'G'},
    {value: 1E6, symbol: 'M'},
    {value: 1E3, symbol: 'k'}
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// unix时间戳格式器 YYYY-MM-DD HH:mm:ss
export function unixTimestampFilter(value, format = 'YYYY-MM-DD HH:mm') { // 设计要求默认不展示秒
  if (moment(parseInt(value)).format(format) === 'Invalid date' || !Number(value)) {
    return value
  } else {
    return moment(parseInt(value)).format(format)
  }
}

// 四舍五入格式数据
export function decimalNumFilter(value, num = 2) {
  let _test = /^-?\d+(\.\d*)?$/.test(value)
  if (_test) {
    const _number = parseFloat(value)
    return _number.toFixed(num)
  } else if (typeof value === 'number') { // 处理极小数 如：2.220446049250313e-16
    return value.toFixed(2)
  }
  return value
}

// 状态过滤
export function statusFilter(value) {
  switch (value) {
    case 1 :
      return '启用'
    case 0 :
      return '禁用'
    default :
      return '未知'
  }
}

// 是否
export function isTrue(value) {
  switch (value) {
    case 1 :
      return '是'
    case '1' :
      return '是'
    case 'true' :
      return '是'
    case true :
      return '是'
    case 0 :
      return '否'
    case '0' :
      return '否'
    case false :
      return '否'
    case 'false' :
      return '否'
    default :
      return '未知'
  }
}

// 字典过滤
export function filterDataBaseDictionary(value) {
  const DataBaseDictionary = dotData(window, 'DataBaseDictionary') || {}
  return DataBaseDictionary[value] || value
}

// 秒转换为 天 小时
export function filterSecond(value, dayFlag = false) {
  if (String(value) === '0') {
    return '0'
  }
  if (!/^\d+$/.test(value)) {
    return value
  }
  let temp = ''
  if (dayFlag) {
    const day = Math.floor(value / (24 * 60 * 60))
    if (day) {
      temp += `${day}天`
      value -= day * 24 * 60 * 60
    }
  }
  const hour = Math.floor(value / (60 * 60))
  if (hour) {
    temp += `${hour}小时`
    value -= hour * 60 * 60
  }

  const minute = Math.floor(value / 60)
  if (minute) {
    temp += `${minute}分钟`
  }
  if (temp === '') {
    temp = '小于1分钟'
  }
  return temp
}

/**
 * 提取出图片并进行数组化
 * @param value
 * @param reg
 * @returns {*}
 */
export function matchImageArr(value, reg = /\[images:([0-9a-zA-Z,-]*)\]/) {
  if (!value) {
    return []
  }
  // 匹配正则
  let matchArr = value.match(reg)
  // split 文本、图片
  if (Array.isArray(matchArr)) {
    let imageStr = matchArr[0]
    let startIndex = matchArr['index'] + imageStr.length
    let leaveStr = value.substr(startIndex)
    let temp = [
      {
        text: value.substr(0, matchArr['index']),
        imageStr: matchArr[1]
      },
      // 继续匹配
      ...matchImageArr(leaveStr)
    ]
    return temp
  }
  return [
    {
      text: value,
      imageStr: ''
    }
  ]
}

// 将一个对象转化未数组
export function stringToArr(str, json = false) {
  let temp = []
  if (Array.isArray(str)) {
    return str
  }
  if (typeof str === 'string' && str) {
    return str.split(',')
  }
  return temp
}

// 数字金额小写转换成中文大写
export function changeChineseNumber(num) {
  let pre = ''
  if (isNaN(num) || num > Number.MAX_VALUE) return ''
  if (num < 0) {
    num = Math.abs(num)
    pre = '负'
  }
  let cn = '零壹贰叁肆伍陆柒捌玖'
  let unit = ['拾百千', '分角']
  let unit1 = ['万亿', '']
  let numArray = num.toString().split('.')
  // let start = new Array(numArray[0].length - 1, 2)
  let start = [numArray[0].length - 1, 2]
  function toChinese(num, index) {
    let num2 = num.replace(/\d/g, function($1) {
      return cn.charAt($1) + unit[index].charAt(start-- % 4 ? start % 4 : -1)
    })
    return num2
  }
  for (let i = 0; i < numArray.length; i++) {
    let tmp = ''
    for (let j = 0; j * 4 < numArray[i].length; j++) {
      let strIndex = numArray[i].length - (j + 1) * 4
      let str = numArray[i].substring(strIndex, strIndex + 4)
      start = i ? 2 : str.length - 1
      let tmp1 = toChinese(str, i)
      tmp1 = tmp1.replace(/(零.)+/g, '零').replace(/零+$/, '')
      tmp1 = tmp1.replace(/^壹拾/, '拾')
      tmp = (tmp1 + unit1[i].charAt(j - 1)) + tmp
    }
    numArray[i] = tmp
  }
  numArray[1] = numArray[1] ? numArray[1] : ''
  numArray[0] = numArray[0] ? numArray[0] + '元' : [numArray[0], numArray[1] = numArray[1].replace(/^零+/, '')]
  numArray[1] = numArray[1].match(/分/) ? numArray[1] : numArray[1] + '整'
  return pre + numArray[0] + numArray[1]
}

// todo 数字转化未大写
export function simpleChineseNumber(num) {
  return num
}

// 左填充， 左不满位数进行填充
export function padStart(value, length, chars) {
  return lodash.padStart(value, length, chars)
}

// 天 小时 转化
export function filterDayHours(value) {
  if (String(value) === '0') {
    return '0'
  }
  if (empty(value) || !isIntegerStringUtil(value)) {
    return value
  }
  let temp = ''
  const day = Math.floor(value / (24 * 60 * 60 * 1000))
  if (day) {
    temp += `${day}天`
    value -= day * 24 * 60 * 60 * 1000
  }
  const hour = Math.floor(value / (60 * 60 * 1000))
  if (hour) {
    temp += `${hour}小时`
    value -= hour * 60 * 60 * 1000
  }
  return temp
}

// 判断是否有操作权限
export function hasOperation(key) {
  const list = store.get(operationListKey)
  if (Array.isArray(list)) {
    return list.indexOf(key) >= 0
  }
  return false
}
// 审核状态过滤
export function auditStatusFilter(value) {
  switch (value) {
    case 0 :
      return '待审核'
    case 1 :
      return '通过'
    case 2 :
      return '驳回'
    default :
      return '未知'
  }
}
// 下单方式
export function filterOrderWay(val) {
  let _val = parseInt(val)
  switch (_val) {
    case 1 : return '抛出竞价'
    case 2 : return '定向师傅报价'
    case 3 : return '悬赏定价'
    default : return ''
  }
}
