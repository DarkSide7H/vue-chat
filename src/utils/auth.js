import Cookies from 'js-cookie'
import localStore from 'store'
import {MessageBox} from 'element-ui'
import {dotData} from '@/utils'
import store from '@/store'

const TokenKey = 'Admin-Token' + '-' + window.location.port
const userKey = 'omsUser'
const TempToken = 'tempToken' // 临时token 保存 不能影响登录
export const operationListKey = 'operationListKey'

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 移除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

function _clearStore(token) {
  import('@/utils/ajax').then(ajax => {
    ajax.post('/token/destroy-token', {token})
  })
}

// 只是登出
export function onlyLoginOut() {
  removeToken()
}

// 登出
export function loginOut(alertFlag = false) {
  onlyLoginOut()
  const token = getToken()
  if (alertFlag) {
    MessageBox.confirm('请重新登录', '登录已过期', {
      type: 'warning',
      showCancelButton: false,
      closeOnClickModal: false
    }).then(_ => {
      _clearStore(token)
      window.location.reload()
    })
  } else {
    window.location.reload()
  }
}

// 获取用户基本信息
export function setUserInfo(user) {
  store.dispatch('SET_USER_INFO', user)
  localStore.set(userKey, user)
}

/**
 * 修改用户信息
 * @param name string 用户名称
 * @param token string 登陆token
 */
export function setUserInfoData(name = '', token = '') {
  let info = getUserInfo()
  if (name) {
    info.name = name
  }
  setUserInfo(info)
  if (token) {
    setToken(token)
  }
}

// 获取用户信息
export function getUserInfo(key = '') {
  let info = localStore.get(userKey)
  if (key) {
    return dotData(info, key) || ''
  }
  return info
}
// 写入权限信息
export function setOperationList(list) {
  localStore.set(operationListKey, list)
}

// 是否登陆了
export function isLogin() {
  return !!getToken()
}

// 设置临时token
export function setTempToken(token) {
  return Cookies.set(TempToken, token)
}

// 获取临时token
export function getTempToken() {
  return Cookies.get(TempToken)
}

// 移除token
export function removeTempToken() {
  return Cookies.remove(TempToken)
}
