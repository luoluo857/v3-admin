import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 从环境变量获取API基础URL
  timeout: 15000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送前可以进行一些处理，例如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 这里可以根据后端的响应结构进行定制
    if (res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('响应错误：', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service