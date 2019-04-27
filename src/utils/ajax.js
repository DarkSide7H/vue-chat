import axios from 'axios'

// const baseUrl = 'http://192.168.10.59:8762'
const urlPrefix = '/api'

const instance = axios.create({
  baseURL: urlPrefix + '/',
  headers: {
    'X-Custom-Header': 'Web',
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

instance.interceptors.request.use(config => {
  return config
}, error => {
  return error
})

instance.interceptors.response.use(response => {
  // 过滤null
  const success = response.data.success
  if (!success) {
    alert(response.data.error_message || '系统报错')
  }
  return response
}, error => {
  return alert(error)
})

export const get = (url, params = {}, config = {}) => instance.get(url, config)

export default {
  get
}
