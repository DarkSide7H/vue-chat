/**
 * Created by jiachenpan on 16/11/18.
 */
import lodash from 'lodash'
import $ from 'jquery'
import { MessageBox, Notification } from 'element-ui'

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 格式化时间
export function getQueryObject(url) {
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

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    /* eslint-disable no-control-regex */
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

// 获取object 里的的数据，避免保错
export function dotData(object, dotString, defaultValue = undefined) {
  return lodash.get(object, dotString, defaultValue)
}

// 根据点语法设置值
export function setDotData(object, path, value) {
  lodash.set(object, path, value)
}

// 提示
export function alert(message, title = '提示', type = 'error') {
  Notification({
    title,
    type,
    message
  })
}

/**
 * @author 封装 element-ui confirm
 * @param text
 * @param title
 * @param config
 * @returns {Promise}
 */
export function confirm(text, title = '提示', config = {}) {
  return new Promise((resolve, reject) => {
    let confirmButtonLoadingClose = () => {
    }
    let _config = merge({
      showCancelButton: true,
      closeOnClickModal: false,
      center: true
    }, config)
    let afterCloseResolve = () => {
    }
    _config.beforeClose = (action, instance, done) => {
      if (lodash.isFunction(config.beforeClose)) {
        config.beforeClose(action, instance, () => {
        })
      }
      if (lodash.isFunction(config.confirmCallBack)) {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          confirmButtonLoadingClose = () => {
            instance.confirmButtonLoading = false
          }
          config.confirmCallBack({
            confirmButtonLoadingClose,
            close: () => new Promise((resolve, reject) => {
              done()
              afterCloseResolve = resolve
            }),
            action
          })
        } else {
          done()
        }
      }
      if (!config.confirmButtonLoading) {
        done()
      }
    }
    delete _config.confirmButtonLoading
    MessageBox.confirm(text, title, _config).then(_ => {
      afterCloseResolve()
      resolve()
    }).catch(err => {
      afterCloseResolve()
      reject(err)
    })
  })
}

// 数组转化为主键对象
export function arrayPk(arr = [], id = 'id') {
  let refer = {}
  for (let v of arr) {
    refer[v[id]] = v
  }
  return refer
}

// 主键对象转化为数组
export function pkArray(obj) {
  let refer = []
  for (let k in obj) {
    refer.push(obj[k])
  }
  return refer
}

/**
 * 数组转化为数结构
 * @param arr
 * @param pk
 * @param pid
 * @param child
 * @param root
 * @param toString 判断是否把数字转化为string
 * @returns {Array}
 */
export function arrayToTree(arr, pk = 'id', pid = 'pid', child = '_child', root = 0, toString = false) {
  let refer = arrayPk(arr, pk)
  let tree = []
  let parent = []
  if (toString) {
    root = String(root)
  }
  arr.forEach((data, key) => {
    let parentId = toString ? String(data[pid]) : data[pid]
    if (root === parentId) {
      tree.push(arr[key])
    } else {
      if (refer[parentId]) {
        parent = refer[parentId]
        if (!Array.isArray(parent[child])) {
          parent[child] = []
        }
        parent[child].push(arr[key])
      }
    }
  })
  return tree
}

// 树结构的数据转化为array 结构
export function treeToArray(arr, child = '_child') {
  let copyArr = copy(arr, true)
  let temp = []
  if (Array.isArray(copyArr)) {
    copyArr.forEach(v => {
      let childArr = dotData(v, child)
      if (Array.isArray(childArr) && childArr.length > 0) {
        let deepArr = treeToArray(childArr, child)
        delete v[child]
        deepArr.forEach(v2 => {
          temp.push(v2)
        })
      }
      temp.push(v)
    })
  }
  return temp
}

// 拷贝数组或对象
export function copy(value, deep = false) {
  if (deep) {
    return lodash.cloneDeep(value)
  }
  return lodash.clone(value)
}

// copy alias
export function clone(value, deep = false) {
  return copy(value, deep)
}

// 判断复杂对象是否相等
export function isEqual(value, other) {
  return lodash.isEqual(value, other)
}

// array_column
export function arrayColumn(arr, key) {
  let temp = []
  if (Array.isArray(arr)) {
    arr.forEach(v => {
      temp.push(v[key])
    })
  }
  return temp
}

//  判断是否是ie9
export function isIE9() {
  return !!navigator.userAgent.match(/MSIE 9.0/)
}

// 判断支持 placeholder
export function supportPlaceHolder() {
  return 'placeholder' in document.createElement('input')
}

// 深度克隆一个vue对象
export function deepCloneNodes(vnodes, createElement) {
  function cloneVNode(vnode) {
    const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode))
    const cloned = createElement(vnode.tag, vnode.data, clonedChildren)
    cloned.text = vnode.text
    cloned.isComment = vnode.isComment
    cloned.componentOptions = vnode.componentOptions
    cloned.elm = vnode.elm
    cloned.context = vnode.context
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    return cloned
  }

  const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode))
  return clonedVNodes
}

// 对象合并
export const merge = lodash.merge

// 删除一条数据
export function delArr(arr, index) {
  if (arr.length > 1) {
    arr.splice(index, 1)
  }
}

// 替换null 为 ''空
export function replaceNullDeep(object) {
  if (Array.isArray(object)) {
    let temp = []
    for (let value of object) {
      temp.push(replaceNullDeep(value))
    }
    return temp
  } else {
    let temp = {}
    const isObject = lodash.isObjectLike(object)
    if (isObject && object) {
      for (let k in object) {
        temp[k] = replaceNullDeep(object[k])
      }
    } else {
      temp = object === null ? '' : object
    }
    return temp
  }
}

// 过滤掉数据中的null、undefined
export function trimFun(object) {
  if (Array.isArray(object)) {
    for (let item of object) {
      if (!lodash.isObjectLike(object) && !Array.isArray(object)) {
        item = lodash.trim(item)
      } else {
        trimFun(item)
      }
    }
  } else {
    if (lodash.isObjectLike(object)) {
      for (let key in object) {
        if (!lodash.isObjectLike(object[key]) && !Array.isArray(object[key])) {
          object[key] = lodash.trim(object[key])
        } else {
          trimFun(object[key])
        }
      }
    }
  }
  return object
}

// 过滤掉对象内字符串内的空格
export function replaceSpaceDeep(obj) {
  for (let k in obj) {
    if (lodash.isString(obj[k])) {
      obj[k] = lodash.trim(obj[k])
    }
  }
  return obj
}

// 将一个json 字符串转化未 数组
export function handleJsonStringArr(str) {
  if (Array.isArray(str)) {
    return str
  }
  if (str) {
    try {
      let arr = JSON.parse(str)
      if (Array.isArray(arr)) {
        return arr
      } else {
        console.error('不是一个可转化为数组的json串：' + str)
      }
    } catch (e) {
      if (typeof str === 'string' && str) {
        return str.split(',')
      }
    }
  }
  return []
}

// 菜单设置
export function setMenuActive(tree, id, pidKey = 'pid', active = 'active', level = 1) {
  tree[id][active] = true
  tree[id]['level'] = level
  let pid = tree[id][pidKey]
  let pidTree = tree[pid]
  if (pidTree) {
    setMenuActive(tree, pid, pidKey, active, level++)
  }
}

// 验证打印组件
export function validateLODOP(LODOP) {
  if (LODOP) {
    if (LODOP.VERSION < '6.2.2.2') { // 2018年6月1号LODOP最新版本号'6.2.2.2'
      Notification({
        title: '提示:',
        message: '<span style="color: #f3c200;">你安装的打印插件版本过低，请点击</span><a style="color: #32c5d2;" href="/static/clodop-download/c_lodop.zip">下载</a><span style="color: #f3c200;">新版本，安装后刷新即可！</span>',
        duration: 0,
        dangerouslyUseHTMLString: true
      })
    } else {
      return true
    }
  } else {
    Notification({
      title: '提示:',
      message: '<span style="color: #f3c200;">你还没有安装打印插件，请点击</span><a style="color: #32c5d2;" href="/static/clodop-download/c_lodop.zip">下载</a><span style="color: #f3c200;">，安装后刷新即可！</span>',
      duration: 0,
      dangerouslyUseHTMLString: true
    })
  }
  return false
}

//  blockUI, unblockUI
// 异步获取打印插件
export function getLodop() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'http://localhost:8000/CLodopfuncs.js',
      dataType: 'script',
      cache: true
    }).done((script, textStatus) => {
      resolve(window.getCLodop())
    }).fail((jqxhr, settings, exception) => {
      $.ajax({
        url: 'http://localhost:18000/CLodopfuncs.js',
        dataType: 'script',
        cache: true
      }).done((script, textStatus) => {
        resolve(window.getCLodop())
      }).fail((jqxhr, settings, exception) => {
        resolve(null)
      })
    })
  }).then(reuslt => {
    validateLODOP(reuslt)
    return reuslt
  })
}

// 数据树有子节点就回掉callback
export function hasChildCallBack(treeData, callback = (v) => {
  console.log(v)
}, child = '_child') {
  if (Array.isArray(treeData)) {
    treeData.forEach(v => {
      let childArr = dotData(v, child)
      if (childArr) {
        callback(v)
        hasChildCallBack(childArr, callback, child)
      }
    })
  }
}
