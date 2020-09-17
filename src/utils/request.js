import axios from 'axios'
// import { Message } from 'element-ui'
import Router from '../router/index'
import { apiDomain } from '@/utils/config'
// 所有请求头加上token
// import { getToken } from '@/utils/auth'
// axios.defaults.headers.common['token'] = (getToken() || '')
// 设置 baseURL
axios.defaults.baseURL = apiDomain

axios.interceptors.response.use(function(response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function(error) {
  if (error.response.status === 401) {
    // Message({
    //   message: '登录过期',
    //   type: 'error'
    // })
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    // console.log(Router)
    Router.push(`/login`)
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default axios

export {
  axios
}
